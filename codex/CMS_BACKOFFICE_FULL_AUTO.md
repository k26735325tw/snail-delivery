# CMS_BACKOFFICE_FULL_AUTO｜Snail Delivery 全站後台極限全自動任務包

你現在是此專案的全自動開發、修復、提交、部署代理人。
你的任務是把現有網站升級成「正式可用的 CMS 後台系統」：
- 在 `/admin` 可編輯各頁文字
- 在 `/admin` 可上傳與更換圖片
- 按下儲存後，前台 `/`、`/consumer`、`/courier`、`/merchant` 會同步更新
- 可在本地與 Vercel 正式站穩定運作
- 完成後自動 build、commit、push，交由 Vercel 自動部署

如果遇到一般程式問題，請直接修復，不要停下來問我。
只有遇到外部平台權限、Vercel Storage 尚未建立、或登入授權問題時，才回報卡點。

---

## 0. 專案現況（請依此理解，不要推倒重寫）

現有專案已包含以下頁面：
- `/`
- `/consumer`
- `/courier`
- `/merchant`
- `/admin`
- `/api/site`

現有 `/admin` 只能編輯首頁少數欄位，且目前資料寫入 `data/site.json`。
這種方式只適合本地與暫時開發，不適合作為 Vercel 正式環境的持久 CMS。

本次任務目標是：
1. 保留現有網站設計風格與既有頁面路由
2. 把資料來源升級成正式可用的 CMS
3. 後台統一編輯全站內容與圖片
4. 儲存後前台立即更新
5. 不做無關的大改版

---

## 1. 最終成果要求

完成後必須達到以下狀態：

### 後台能力
`/admin` 必須能編輯以下頁面的內容：

#### 首頁 `/`
- 品牌名稱
- Hero 標題
- Hero 副標
- 首頁特色 features
- Hero 主圖或品牌圖
- `#download-cards` 三張卡：
  - 角色名稱
  - 小標
  - 標題
  - 描述
  - 亮點 tags
  - 圖片
  - iOS 連結
  - Android 連結
- `#launch-flow` 流程步驟：
  - 步驟標題
  - 步驟描述

#### 消費者頁 `/consumer`
- Hero badge
- Hero title
- Hero description
- 主按鈕文字 / 連結
- 次按鈕文字 / 連結
- stats 區塊
- 內容區塊標題、描述、卡片文案
- 頁面主視覺圖片（若該頁使用圖片）

#### 外送員頁 `/courier`
- Hero badge
- Hero title
- Hero description
- 主按鈕文字 / 連結
- 次按鈕文字 / 連結
- stats 區塊
- 各內容區塊標題、描述、卡片文案
- 頁面主視覺圖片（若該頁使用圖片）

#### 商家頁 `/merchant`
- Hero badge
- Hero title
- Hero description
- 主按鈕文字 / 連結
- 次按鈕文字 / 連結
- stats 區塊
- zero fee 區塊文案
- merchant tools 區塊文案
- 頁面主視覺圖片（若該頁使用圖片）

### 圖片能力
- 後台可上傳圖片
- 上傳後得到正式可用圖片 URL
- 前台頁面改用該圖片 URL
- 可替換既有圖片
- 若圖片未上傳，保留原本圖片，不要把畫面弄壞

### 儲存與同步
- 後台按 Save 後：
  - CMS 資料被正式保存
  - 前台資料同步更新
  - `/`
  - `/consumer`
  - `/courier`
  - `/merchant`
  - `/admin`
  都要被 revalidate / refresh
- 儲存成功後顯示成功訊息
- 重新整理頁面後內容不能消失

---

## 2. 技術實作策略（必須照此方向）

### 儲存層
將目前的 `data/site.json` 本地寫檔式 CMS，升級為「正式可部署儲存層」。

採用以下方案：

1. 使用 `@vercel/blob`
2. 圖片上傳到 Blob
3. CMS 結構化資料也存成單一 JSON 檔，例如：
   - `cms/site-content.json`
4. 前台與後台都從同一份 CMS JSON 讀資料
5. 如果 Blob 中尚未存在 CMS JSON，請以目前專案既有內容作為 seed/default data 自動建立初始版本

### 前台更新
- 儲存成功後，必須使用 `revalidatePath`
- 至少 revalidate：
  - `/`
  - `/consumer`
  - `/courier`
  - `/merchant`
  - `/admin`

### 圖片上傳
- 採 server upload 方案即可
- 若檔案過大，回傳明確錯誤訊息
- 圖片儲存路徑請有結構，例如：
  - `cms/home/...`
  - `cms/consumer/...`
  - `cms/courier/...`
  - `cms/merchant/...`
  - `cms/shared/...`

### 安全性
- `/admin` 需要基本保護
- 若存在 `CMS_ADMIN_PASSWORD` 環境變數：
  - 啟用簡易登入或 Basic Auth 保護
- 若本地開發環境未設定密碼：
  - 允許進入，但要顯示 warning
- 不要把敏感 token 顯示在前端

---

## 3. 檔案結構改造要求

請新增或重構成以下結構（名稱可微調，但職責要清楚）：

- `lib/cms-schema.ts`
  - 定義整站 CMS TypeScript 型別與 schema
- `lib/cms-defaults.ts`
  - 由目前既有頁面內容建立預設資料
- `lib/cms-store.ts`
  - 負責讀取 / 寫入 Blob 中的 CMS JSON
  - 提供 `getCmsData()`、`saveCmsData()`、`seedCmsDataIfMissing()`
- `app/api/cms/route.ts`
  - `GET`：取整份 CMS 資料
  - `POST` 或 `PUT`：更新整份 CMS 資料
- `app/api/cms/upload/route.ts`
  - 處理圖片上傳到 Blob
  - 回傳圖片 URL
- `components/admin-dashboard.tsx`
  - 新的後台主介面
- `components/admin-image-upload.tsx`
  - 圖片上傳元件
- `components/admin-section-editor.tsx`
  - 各區塊欄位編輯元件
- `components/admin-array-editor.tsx`
  - 編輯 cards / steps / stats / highlights 等陣列
- `components/admin-save-bar.tsx`
  - 固定儲存列，顯示儲存狀態
- `app/admin/page.tsx`
  - 改成完整 CMS Dashboard
- `app/page.tsx`
- `app/consumer/page.tsx`
- `app/courier/page.tsx`
- `app/merchant/page.tsx`
  - 全部改為讀 CMS 資料渲染

若需要其他檔案，可自行新增，但不要做雜亂無章的臨時寫法。

---

## 4. CMS 資料結構要求

請建立一份統一的 CMS JSON 結構，至少包含：

```ts
type CmsData = {
  site: {
    siteName: string;
    logoUrl: string;
  };
  home: {
    hero: {
      badge?: string;
      title: string;
      subtitle: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      heroImageUrl?: string;
    };
    features: string[];
    downloadCards: Array<{
      key: "consumer" | "courier" | "merchant";
      eyebrow: string;
      title: string;
      description: string;
      audience: string;
      imageUrl: string;
      imageAlt: string;
      iosUrl: string;
      androidUrl: string;
      highlights: string[];
    }>;
    launchFlow: Array<{
      index: string;
      title: string;
      description: string;
    }>;
  };
  consumer: {
    hero: {
      badge: string;
      title: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      asideTitle: string;
      stats: Array<{ label: string; value: string }>;
      heroImageUrl?: string;
    };
    sections: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      items: Array<{
        eyebrow?: string;
        title: string;
        description: string;
        icon?: string;
      }>;
    }>;
  };
  courier: {
    hero: {
      badge: string;
      title: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      asideTitle: string;
      stats: Array<{ label: string; value: string }>;
      heroImageUrl?: string;
    };
    sections: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      items: Array<{
        eyebrow?: string;
        title: string;
        description: string;
        icon?: string;
      }>;
    }>;
  };
  merchant: {
    hero: {
      badge: string;
      title: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      asideTitle: string;
      stats: Array<{ label: string; value: string }>;
      heroImageUrl?: string;
    };
    sections: Array<{
      id: string;
      badge: string;
      title: string;
      description: string;
      items: Array<{
        eyebrow?: string;
        title: string;
        description: string;
        icon?: string;
      }>;
    }>;
  };
};