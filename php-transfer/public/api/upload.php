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

    if (!isset($_FILES['file'])) {
        throw new RuntimeException('找不到上傳檔案');
    }

    $file = $_FILES['file'];
    if (!is_array($file) || !isset($file['error'], $file['tmp_name'], $file['name'], $file['size'])) {
        throw new RuntimeException('上傳格式錯誤');
    }

    if ((int) $file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('檔案上傳失敗');
    }

    if ((int) $file['size'] > 20 * 1024 * 1024) {
        throw new RuntimeException('檔案不可超過 20MB');
    }

    $originalName = (string) $file['name'];
    $extension = snail_sanitize_upload_extension(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!snail_allowed_upload_extension($extension)) {
        throw new RuntimeException('不支援的副檔名');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $detectedMime = $finfo->file($file['tmp_name']);
    if (!is_string($detectedMime)) {
        throw new RuntimeException('無法辨識 MIME type');
    }

    $mimeExtension = snail_mime_to_extension($detectedMime);
    if ($mimeExtension === null) {
        throw new RuntimeException('不支援的 MIME type');
    }

    if ($mimeExtension !== $extension) {
        throw new RuntimeException('副檔名與 MIME type 不符');
    }

    $uploadsDir = snail_data_path('public/uploads');
    if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0775, true) && !is_dir($uploadsDir)) {
        throw new RuntimeException('無法建立 uploads 目錄');
    }

    $newFileName = 'upload-' . date('Ymd-His') . '-' . bin2hex(random_bytes(6)) . '.' . $extension;
    $targetPath = rtrim($uploadsDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $newFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new RuntimeException('無法儲存上傳檔案');
    }

    snail_json_response([
        'ok' => true,
        'url' => '/uploads/' . $newFileName,
    ]);
} catch (Throwable $error) {
    snail_json_response([
        'ok' => false,
        'error' => 'upload_failed',
        'message' => $error->getMessage(),
    ], 400);
}
