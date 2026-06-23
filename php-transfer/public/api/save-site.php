<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/lib/bootstrap.php';

snail_suppress_warnings();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    snail_json_response([
        'ok' => false,
        'error' => 'method_not_allowed',
        'message' => '只允許 POST',
    ], 405);
}

try {
    $auth = snail_require_admin_password();

    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        throw new RuntimeException('請提供 JSON body');
    }

    $decoded = json_decode(ltrim($raw, "\xEF\xBB\xBF"), true);
    if (!is_array($decoded)) {
        throw new RuntimeException('JSON 格式錯誤');
    }

    $sitePath = snail_data_path('data/site.json');
    $backupName = snail_backup_site_file($sitePath);
    snail_write_json_file($sitePath, $decoded);

    $response = [
        'ok' => true,
        'saved' => true,
        'backup' => $backupName,
    ];

    if (!$auth['required'] && !empty($auth['warning'])) {
        $response['warning'] = $auth['warning'];
    }

    snail_json_response($response);
} catch (Throwable $error) {
    snail_json_response([
        'ok' => false,
        'error' => 'save_failed',
        'message' => $error->getMessage(),
    ], 500);
}
