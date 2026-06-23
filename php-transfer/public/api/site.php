<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/lib/bootstrap.php';

snail_suppress_warnings();

try {
    $sitePath = snail_data_path('data/site.json');
    $data = snail_read_json_file($sitePath);

    snail_json_response([
        'ok' => true,
        'source' => 'json',
        'reason' => 'ok',
        'data' => $data,
    ]);
} catch (Throwable $error) {
    snail_json_response([
        'ok' => false,
        'source' => 'json',
        'reason' => 'error',
        'message' => $error->getMessage(),
    ], 500);
}
