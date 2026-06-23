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
    snail_require_admin_password();

    $sitePath = snail_data_path('data/site.json');
    $backupName = snail_backup_site_file($sitePath);

    snail_json_response([
        'ok' => true,
        'backup' => $backupName,
    ]);
} catch (Throwable $error) {
    snail_json_response([
        'ok' => false,
        'error' => 'backup_failed',
        'message' => $error->getMessage(),
    ], 400);
}
