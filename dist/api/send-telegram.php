<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 30 * 1024 * 1024) {
    respond(413, false, 'The upload is too large. Please choose smaller images.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0 && empty($_POST) && empty($_FILES)) {
    respond(413, false, 'The upload exceeds the server limit. Please choose smaller images.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$requestHost = strtolower(preg_replace('/:\\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || !hash_equals($requestHost, $originHost)) {
        respond(403, false, 'Request origin is not allowed.');
    }
}

$configPath = dirname(__DIR__, 2) . '/telegram-config.php';
if (!is_readable($configPath)) {
    error_log('Telegram config is missing or unreadable: ' . $configPath);
    respond(500, false, 'Booking service is not configured.');
}

$config = require $configPath;
$botToken = is_array($config) ? trim((string) ($config['bot_token'] ?? '')) : '';
$chatId = is_array($config) ? trim((string) ($config['chat_id'] ?? '')) : '';
if ($botToken === '' || $chatId === '' || !preg_match('/^\\d+:[A-Za-z0-9_-]+$/', $botToken)) {
    error_log('Telegram config does not contain bot_token and chat_id.');
    respond(500, false, 'Booking service is not configured.');
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(200, true, 'Request received.');
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/oma-booking-' . hash('sha256', $clientIp);
$lastRequest = is_file($rateFile) ? (int) file_get_contents($rateFile) : 0;
if ($lastRequest > time() - 20) {
    respond(429, false, 'Please wait a moment before sending another request.');
}

function field(string $name, int $maxLength, bool $required = false): string
{
    $rawValue = $_POST[$name] ?? '';
    if (!is_string($rawValue)) {
        respond(422, false, 'Invalid form data.');
    }
    $value = trim($rawValue);
    if ($required && $value === '') {
        respond(422, false, 'Please complete all required fields.');
    }
    $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    if ($length > $maxLength) {
        respond(422, false, 'One or more fields are too long.');
    }
    return $value;
}

$name = field('name', 120, true);
$contact = field('contact', 180, true);
$idea = field('idea', 2000, true);
$placement = field('placement', 180) ?: 'Not decided';
$artist = field('artist', 100) ?: 'No preference';

$photos = [];
$photoUpload = $_FILES['photos'] ?? null;
if (is_array($photoUpload) && isset($photoUpload['error'])) {
    $errors = is_array($photoUpload['error']) ? $photoUpload['error'] : [$photoUpload['error']];
    $names = is_array($photoUpload['name'] ?? null) ? $photoUpload['name'] : [$photoUpload['name'] ?? 'photo'];
    $sizes = is_array($photoUpload['size'] ?? null) ? $photoUpload['size'] : [$photoUpload['size'] ?? 0];
    $temporaryNames = is_array($photoUpload['tmp_name'] ?? null) ? $photoUpload['tmp_name'] : [$photoUpload['tmp_name'] ?? ''];

    $activeErrors = array_filter($errors, static fn($error): bool => (int) $error !== UPLOAD_ERR_NO_FILE);
    if (count($activeErrors) > 5) {
        respond(422, false, 'You can upload a maximum of 5 images.');
    }
    if ($activeErrors !== [] && !class_exists('finfo')) {
        error_log('The PHP Fileinfo extension is not enabled.');
        respond(500, false, 'Image upload is unavailable.');
    }

    $fileInfo = $activeErrors !== [] ? new finfo(FILEINFO_MIME_TYPE) : null;
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    foreach ($errors as $index => $uploadError) {
        $uploadError = (int) $uploadError;
        if ($uploadError === UPLOAD_ERR_NO_FILE) continue;
        if ($uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE) {
            respond(422, false, 'Each image must be 5 MB or smaller.');
        }
        if ($uploadError !== UPLOAD_ERR_OK) {
            respond(422, false, 'One of the images could not be uploaded.');
        }

        $temporaryName = (string) ($temporaryNames[$index] ?? '');
        $size = (int) ($sizes[$index] ?? 0);
        if ($size < 1 || $size > 5 * 1024 * 1024 || !is_uploaded_file($temporaryName)) {
            respond(422, false, 'Each image must be a valid file no larger than 5 MB.');
        }
        $mimeType = (string) $fileInfo->file($temporaryName);
        if (!in_array($mimeType, $allowedTypes, true)) {
            respond(422, false, 'Only JPG, PNG, and WebP images are allowed.');
        }

        $safeName = preg_replace('/[^A-Za-z0-9._-]/', '-', basename((string) ($names[$index] ?? 'photo')));
        $photos[] = [
            'path' => $temporaryName,
            'mime' => $mimeType,
            'name' => $safeName !== '' ? $safeName : 'photo',
        ];
    }
}

$escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$message = "<b>New OMA Tattoo booking request</b>\n\n"
    . "<b>Name:</b> " . $escape($name) . "\n"
    . "<b>Contact:</b> " . $escape($contact) . "\n"
    . "<b>Artist:</b> " . $escape($artist) . "\n"
    . "<b>Placement:</b> " . $escape($placement) . "\n\n"
    . "<b>Tattoo idea:</b>\n" . $escape($idea);

if (!function_exists('curl_init')) {
    error_log('The PHP cURL extension is not enabled.');
    respond(500, false, 'Booking service is unavailable.');
}

function telegramRequest(string $botToken, string $method, array $payload, bool $multipart = false): bool
{
    $curl = curl_init('https://api.telegram.org/bot' . $botToken . '/' . $method);
    $options = [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $multipart ? $payload : json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 30,
    ];
    if (!$multipart) $options[CURLOPT_HTTPHEADER] = ['Content-Type: application/json'];
    curl_setopt_array($curl, $options);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);

    $result = is_string($response) ? json_decode($response, true) : null;
    $successful = $status === 200 && is_array($result) && ($result['ok'] ?? false) === true;
    if (!$successful) error_log('Telegram ' . $method . ' failed. HTTP ' . $status . ' ' . $curlError);
    return $successful;
}

if ($photos !== []) {
    $plainCaption = "OMA booking photos\nName: {$name}\nContact: {$contact}\nArtist: {$artist}\nPlacement: {$placement}";
    if (count($photos) === 1) {
        $photo = $photos[0];
        $photoSent = telegramRequest($botToken, 'sendPhoto', [
            'chat_id' => $chatId,
            'caption' => $plainCaption,
            'photo' => new CURLFile($photo['path'], $photo['mime'], $photo['name']),
        ], true);
    } else {
        $media = [];
        $photoPayload = ['chat_id' => $chatId];
        foreach ($photos as $index => $photo) {
            $attachmentName = 'photo' . $index;
            $mediaItem = ['type' => 'photo', 'media' => 'attach://' . $attachmentName];
            if ($index === 0) $mediaItem['caption'] = $plainCaption;
            $media[] = $mediaItem;
            $photoPayload[$attachmentName] = new CURLFile($photo['path'], $photo['mime'], $photo['name']);
        }
        $photoPayload['media'] = json_encode($media, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $photoSent = telegramRequest($botToken, 'sendMediaGroup', $photoPayload, true);
    }
    if (!$photoSent) respond(502, false, 'Unable to send the reference images. Please try again.');
}

$messageSent = telegramRequest($botToken, 'sendMessage', [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
]);
if (!$messageSent) {
    respond(502, false, 'Unable to send your booking details right now.');
}

@file_put_contents($rateFile, (string) time(), LOCK_EX);
respond(200, true, $photos === [] ? 'Your booking request was sent.' : 'Your booking request and reference images were sent.');
