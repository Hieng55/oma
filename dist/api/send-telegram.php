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

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, false, 'Request is too large.');
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

$escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$message = "<b>New OMA Tattoo booking request</b>\n\n"
    . "<b>Name:</b> " . $escape($name) . "\n"
    . "<b>Contact:</b> " . $escape($contact) . "\n"
    . "<b>Artist:</b> " . $escape($artist) . "\n"
    . "<b>Placement:</b> " . $escape($placement) . "\n\n"
    . "<b>Tattoo idea:</b>\n" . $escape($idea);

$payload = json_encode([
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

if (!function_exists('curl_init')) {
    error_log('The PHP cURL extension is not enabled.');
    respond(500, false, 'Booking service is unavailable.');
}

$curl = curl_init('https://api.telegram.org/bot' . $botToken . '/sendMessage');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 15,
]);
$telegramResponse = curl_exec($curl);
$telegramStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$curlError = curl_error($curl);
curl_close($curl);

$telegramResult = is_string($telegramResponse) ? json_decode($telegramResponse, true) : null;
if ($telegramStatus !== 200 || !is_array($telegramResult) || ($telegramResult['ok'] ?? false) !== true) {
    error_log('Telegram send failed. HTTP ' . $telegramStatus . ' ' . $curlError);
    respond(502, false, 'Unable to send your request right now.');
}

@file_put_contents($rateFile, (string) time(), LOCK_EX);
respond(200, true, 'Your booking request was sent.');
