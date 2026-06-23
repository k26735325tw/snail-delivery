<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/lib/bootstrap.php';

snail_suppress_warnings();

snail_json_response([
    'ok' => true,
    'service' => 'snail-delivery-php-transfer',
    'version' => '1.0.0',
]);
