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

function field(string $name, int $maxLength, bool $required = false): string
{
    $rawValue = $_POST[$name] ?? '';
    if (!is_string($rawValue)) respond(422, false, 'Invalid form data.');
    $value = trim($rawValue);
    if ($required && $value === '') respond(422, false, 'Please complete all required fields.');
    $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    if ($length > $maxLength) respond(422, false, 'One or more fields are too long.');
    return $value;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, false, 'The application is too large.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$requestHost = strtolower(preg_replace('/:\\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || !hash_equals($requestHost, $originHost)) {
        respond(403, false, 'Request origin is not allowed.');
    }
}

if (field('website', 200) !== '') {
    respond(200, true, 'Application received.');
}

$rateFile = sys_get_temp_dir() . '/oma-application-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$lastRequest = is_file($rateFile) ? (int) file_get_contents($rateFile) : 0;
if ($lastRequest > time() - 45) {
    respond(429, false, 'Please wait a moment before sending another application.');
}

$fullName = field('full_name', 120, true);
$email = field('email', 180, true);
$phone = field('phone', 80) ?: 'Not provided';
$instagram = field('instagram', 120, true);
$role = field('role', 120, true);
$location = field('location', 120) ?: 'Not provided';
$portfolio = field('portfolio', 300) ?: 'Not provided';
$introduction = field('introduction', 3000, true);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Please enter a valid email address.');
}
if ($portfolio !== 'Not provided' && !filter_var($portfolio, FILTER_VALIDATE_URL)) {
    respond(422, false, 'Please enter a valid portfolio URL.');
}

$configPath = dirname(__DIR__, 2) . '/telegram-config.php';
if (!is_readable($configPath)) {
    error_log('Telegram config is missing or unreadable: ' . $configPath);
    respond(500, false, 'Application service is not configured.');
}

$config = require $configPath;
$botToken = is_array($config) ? trim((string) ($config['bot_token'] ?? '')) : '';
$chatId = is_array($config) ? trim((string) ($config['chat_id'] ?? '')) : '';
if ($botToken === '' || $chatId === '' || !preg_match('/^\\d+:[A-Za-z0-9_-]+$/', $botToken)) {
    error_log('Telegram config does not contain a valid bot_token and chat_id.');
    respond(500, false, 'Application service is not configured.');
}
if (!function_exists('curl_init')) {
    error_log('The PHP cURL extension is not enabled.');
    respond(500, false, 'Application service is unavailable.');
}

$escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$message = "<b>New OMA Tattoo work application</b>\n\n"
    . "<b>Name:</b> " . $escape($fullName) . "\n"
    . "<b>Email:</b> " . $escape($email) . "\n"
    . "<b>Phone:</b> " . $escape($phone) . "\n"
    . "<b>Instagram:</b> " . $escape($instagram) . "\n"
    . "<b>Applying as:</b> " . $escape($role) . "\n"
    . "<b>Current location:</b> " . $escape($location) . "\n"
    . "<b>Portfolio:</b> " . $escape($portfolio) . "\n\n"
    . "<b>Introduction:</b>\n" . $escape($introduction);

$payload = json_encode([
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'disable_web_page_preview' => true,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$curl = curl_init('https://api.telegram.org/bot' . $botToken . '/sendMessage');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 20,
]);
$telegramResponse = curl_exec($curl);
$telegramStatus = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$curlError = curl_error($curl);
curl_close($curl);

$telegramResult = is_string($telegramResponse) ? json_decode($telegramResponse, true) : null;
if ($telegramStatus !== 200 || !is_array($telegramResult) || ($telegramResult['ok'] ?? false) !== true) {
    error_log('Telegram application send failed. HTTP ' . $telegramStatus . ' ' . $curlError);
    respond(502, false, 'Unable to send your application right now.');
}

@file_put_contents($rateFile, (string) time(), LOCK_EX);
respond(200, true, 'Your application was sent. The OMA team will review it soon.');
