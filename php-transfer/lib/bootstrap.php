<?php

declare(strict_types=1);

function snail_base_path(): string
{
    return dirname(__DIR__);
}

function snail_data_path(string $relative = ''): string
{
    $base = snail_base_path();

    return $relative === '' ? $base : $base . DIRECTORY_SEPARATOR . ltrim($relative, DIRECTORY_SEPARATOR);
}

function snail_json_response(array $payload, int $statusCode = 200): void
{
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    }

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function snail_suppress_warnings(): void
{
    ini_set('display_errors', '0');
    error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE & ~E_DEPRECATED);
}

function snail_read_json_file(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException('site.json 不存在');
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        throw new RuntimeException('無法讀取 site.json');
    }

    $decoded = json_decode(ltrim($raw, "\xEF\xBB\xBF"), true);
    if (!is_array($decoded)) {
        throw new RuntimeException('site.json 內容不是有效 JSON');
    }

    return $decoded;
}

function snail_write_json_file(string $path, array $data): void
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        throw new RuntimeException('無法建立資料夾');
    }

    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        throw new RuntimeException('無法序列化 JSON');
    }

    $tmpPath = $path . '.tmp-' . bin2hex(random_bytes(6));
    if (file_put_contents($tmpPath, $json . PHP_EOL, LOCK_EX) === false) {
        @unlink($tmpPath);
        throw new RuntimeException('無法寫入暫存檔');
    }

    if (!rename($tmpPath, $path)) {
        @unlink($tmpPath);
        throw new RuntimeException('無法更新 site.json');
    }
}

function snail_load_admin_config(): array
{
    $path = snail_data_path('config.local.php');
    if (!is_file($path)) {
        return ['exists' => false, 'password' => null];
    }

    $config = require $path;
    if (!is_array($config)) {
        throw new RuntimeException('config.local.php 必須回傳陣列');
    }

    return [
        'exists' => true,
        'password' => isset($config['admin_password']) ? (string) $config['admin_password'] : '',
    ];
}

function snail_get_request_header(string $name): string
{
    $headerName = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    $value = $_SERVER[$headerName] ?? '';

    return is_string($value) ? trim($value) : '';
}

function snail_require_admin_password(): array
{
    $config = snail_load_admin_config();

    if (!$config['exists']) {
        return [
            'required' => false,
            'warning' => 'config.local.php 不存在，已允許本機開發模式。',
        ];
    }

    $expected = (string) ($config['password'] ?? '');
    $provided = snail_get_request_header('X-Admin-Password');

    if ($expected === '') {
        throw new RuntimeException('config.local.php 的 admin_password 不可為空');
    }

    if (!hash_equals($expected, $provided)) {
        snail_json_response([
            'ok' => false,
            'error' => 'unauthorized',
            'message' => '管理密碼錯誤',
        ], 401);
    }

    return [
        'required' => true,
        'warning' => null,
    ];
}

function snail_backup_site_file(string $sitePath, ?string $backupDir = null): string
{
    if (!is_file($sitePath)) {
        throw new RuntimeException('目前沒有可備份的 site.json');
    }

    $backupDir = $backupDir ?? snail_data_path('backups');
    if (!is_dir($backupDir) && !mkdir($backupDir, 0775, true) && !is_dir($backupDir)) {
        throw new RuntimeException('無法建立備份資料夾');
    }

    $fileName = 'site-' . date('Ymd-His') . '.json';
    $backupPath = rtrim($backupDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

    if (!copy($sitePath, $backupPath)) {
        throw new RuntimeException('無法建立 site.json 備份');
    }

    return $fileName;
}

function snail_allowed_upload_extension(string $extension): bool
{
    return in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'], true);
}

function snail_mime_to_extension(string $mimeType): ?string
{
    return match (strtolower($mimeType)) {
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'video/mp4' => 'mp4',
        'video/webm' => 'webm',
        default => null,
    };
}

function snail_sanitize_upload_extension(string $extension): string
{
    $extension = strtolower($extension);
    if ($extension === 'jpeg') {
        return 'jpg';
    }

    return $extension;
}
