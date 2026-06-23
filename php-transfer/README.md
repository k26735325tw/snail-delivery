# snail-delivery HTML + PHP 交接版

這個資料夾是給只會維護 PHP 主機的人使用的交接版本。

重點：
- 原本的 Next.js 專案仍然保留，不需要刪除
- 這一版不需要 Node.js
- 這一版不需要 Next.js
- 這一版不需要 Vercel
- 內容存在 `data/site.json`
- 圖片與影片上傳後會放到 `public/uploads/`

## 本機啟動

```bash
cd php-transfer/public
php -S 127.0.0.1:8080
```

開啟：
- http://127.0.0.1:8080
- http://127.0.0.1:8080/about.html
- http://127.0.0.1:8080/merchant.html
- http://127.0.0.1:8080/courier.html
- http://127.0.0.1:8080/consumer.html
- http://127.0.0.1:8080/admin/visual.html
- http://127.0.0.1:8080/api/health.php
- http://127.0.0.1:8080/api/site.php

## 正式部署

1. 上傳 `php-transfer/public` 內容到網站根目錄
2. `data/` 與 `backups/` 建議放在網站根目錄外
3. 如果主機限制，也可以照目前結構部署，但要保護 `data/` 與 `backups/`
4. `public/uploads/` 需要可寫入
5. `data/site.json` 需要可寫入
6. 建立 `config.local.php`，並設定管理密碼

## 管理密碼

正式部署時請在 `php-transfer/config.local.php` 放入：

```php
<?php

return [
    'admin_password' => '請換成自己的管理密碼',
];
```

後台會在第一次進入時要求輸入密碼，並儲存在 `sessionStorage`。

## 交接注意事項

- 不需要 Node.js
- 不需要 Next.js
- 不需要 Vercel
- 不需要 Vercel Blob
- 只需要 PHP 主機
- 圖片與影片存在 `uploads/`
- 內容存在 `data/site.json`

## 編輯內容

- `api/site.php`：讀取目前內容
- `api/save-site.php`：儲存內容並自動備份
- `api/upload.php`：上傳圖片或影片
- `api/backup-site.php`：手動備份目前內容
- `admin/visual.html`：簡化後台
