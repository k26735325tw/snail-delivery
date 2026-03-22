import type { CmsData } from "@/lib/cms-schema";

export const cmsDefaults: CmsData = {
  site: {
    siteName: "GoGet",
    logoUrl: "/logo.png",
    footerTitle: "同一套內容中樞，管理所有外送入口。",
    footerDescription:
      "CMS 後台更新後，首頁、消費者、騎手、店家頁面會同步刷新，圖片也會直接上傳到 Vercel Blob。",
  },
  home: {
    hero: {
      badge: "Snail Delivery CMS",
      title: "一個後台，同步管理 GoGet 全站前台內容。",
      subtitle:
        "首頁、消費者、騎手、店家頁面共用同一份 CMS 資料，讓營運更新文案、圖片與下載連結時，不必再改程式碼。",
      primaryLabel: "查看下載入口",
      primaryHref: "#download-cards",
      secondaryLabel: "了解上線流程",
      secondaryHref: "#launch-flow",
      heroImageUrl: "/images/user.png",
    },
    features: [
      "同一份內容來源驅動四個前台頁面與管理後台。",
      "圖片可直接上傳到 Vercel Blob，拿到正式 URL 後立即套用。",
      "每次儲存都會觸發 revalidate，前台更新不需手動重佈署。",
    ],
    downloadCards: [
      {
        key: "consumer",
        eyebrow: "Consumer App",
        title: "GoGet 消費者",
        description:
          "提供使用者快速瀏覽餐廳、下單與追蹤配送進度的行動入口。",
        audience: "一般消費者與家庭用戶",
        imageUrl: "/images/user.png",
        imageAlt: "GoGet 消費者 App",
        iosUrl:
          "https://apps.apple.com/tw/app/%E8%9D%B8%E7%89%9B%E5%A4%96%E9%80%81/id6751226746",
        androidUrl:
          "https://play.google.com/store/apps/details?id=plus.H5F0A257F",
        highlights: ["即時追蹤", "優惠活動", "多店家探索"],
      },
      {
        key: "courier",
        eyebrow: "Courier App",
        title: "GoGet Turbo",
        description:
          "讓外送騎手用更清楚的任務節奏與收入資訊，穩定接單與出勤。",
        audience: "兼職與全職騎手",
        imageUrl: "/images/rider.png",
        imageAlt: "GoGet Turbo App",
        iosUrl:
          "https://apps.apple.com/tw/app/%E8%9D%B8%E7%89%9Bturbo/id6751255326",
        androidUrl:
          "https://play.google.com/store/apps/details?id=plus.H5ADE2198",
        highlights: ["彈性排班", "透明收入", "即時任務"],
      },
      {
        key: "merchant",
        eyebrow: "Merchant App",
        title: "GoGet 店家",
        description:
          "協助店家管理訂單、曝光與營運資訊，快速同步菜單與品牌內容。",
        audience: "餐飲與零售合作店家",
        imageUrl: "/images/merchant.png",
        imageAlt: "GoGet 店家 App",
        iosUrl: "https://apps.apple.com/app/id6751261624",
        androidUrl:
          "https://play.google.com/store/apps/details?id=plus.H58A1C9BB",
        highlights: ["零固定費", "營運工具", "品牌曝光"],
      },
    ],
    launchFlow: [
      {
        index: "01",
        title: "選擇角色",
        description: "先確認你要下載消費者、騎手或店家端 App。",
      },
      {
        index: "02",
        title: "前往商店",
        description: "依照裝置類型跳轉至 App Store 或 Google Play。",
      },
      {
        index: "03",
        title: "完成啟用",
        description: "安裝完成後即可登入並開始使用 GoGet 服務。",
      },
    ],
  },
  consumer: {
    hero: {
      badge: "Consumer Experience",
      title: "讓使用者從瀏覽到下單，都維持順暢且可信任的體驗。",
      description:
        "GoGet 消費者端聚焦在探索、下單與配送追蹤，讓每一次打開 App 都是明確且可預期的流程。",
      primaryLabel: "前往首頁",
      primaryHref: "/",
      secondaryLabel: "查看店家方案",
      secondaryHref: "/merchant",
      asideTitle: "Consumer Snapshot",
      stats: [
        { label: "熱門時段", value: "午餐 11:00-14:00" },
        { label: "主打能力", value: "即時追蹤" },
        { label: "內容更新", value: "CMS 即時同步" },
      ],
      heroImageUrl: "/images/user.png",
    },
    sections: [
      {
        id: "consumer-trust",
        badge: "Trusted Moments",
        title: "把每一個下單瞬間，整理成更容易理解的體驗。",
        description: "從餐廳探索、品項判讀到配送更新，資訊都必須清楚。",
        items: [
          {
            eyebrow: "Quality",
            title: "重點資訊先到位",
            description: "以最少阻力呈現品項、價格與配送資訊。",
            icon: "品",
          },
          {
            eyebrow: "Updates",
            title: "狀態變更即時可見",
            description: "訂單進度與配送狀態要能在關鍵時刻被快速理解。",
            icon: "更",
          },
          {
            eyebrow: "Safety",
            title: "建立安心感",
            description: "把平台規則、配送流程與聯繫方式講清楚。",
            icon: "安",
          },
        ],
      },
      {
        id: "consumer-visual",
        badge: "Visual Precision",
        title: "清楚的內容層次，才撐得住高頻消費場景。",
        description: "文案、標題、CTA 與補充資訊都需要穩定節奏。",
        items: [
          {
            eyebrow: "Flow",
            title: "CTA 位置固定",
            description: "降低使用者判斷成本，讓操作路徑更直接。",
            icon: "流",
          },
          {
            eyebrow: "Content",
            title: "頁面語氣一致",
            description: "品牌感受不分頁面斷裂，提升整體信任度。",
            icon: "文",
          },
        ],
      },
    ],
  },
  courier: {
    hero: {
      badge: "Courier Experience",
      title: "讓騎手在高節奏工作中，也能維持清楚決策與穩定收入預期。",
      description:
        "GoGet 騎手端將收入、任務與工作節奏整理成一致介面，降低接單猶豫與資訊噪音。",
      primaryLabel: "返回首頁",
      primaryHref: "/",
      secondaryLabel: "查看消費者頁",
      secondaryHref: "/consumer",
      asideTitle: "Shift Overview",
      stats: [
        { label: "接單節奏", value: "高峰自動放大" },
        { label: "收入資訊", value: "透明可追蹤" },
        { label: "排班方式", value: "彈性上線" },
      ],
      heroImageUrl: "/images/rider.png",
    },
    sections: [
      {
        id: "courier-pillars",
        badge: "Three Pillars",
        title: "收入、彈性、安全，是騎手端最核心的三個承諾。",
        description: "這些內容必須能被營運快速更新，才能反映實際招募策略。",
        items: [
          {
            eyebrow: "Income",
            title: "收入訊息透明",
            description: "把獎勵、單量與任務價值說清楚。",
            icon: "收",
          },
          {
            eyebrow: "Flexibility",
            title: "排班更自由",
            description: "讓兼職與全職騎手都能理解工作節奏。",
            icon: "彈",
          },
          {
            eyebrow: "Safety",
            title: "安全規範清楚",
            description: "出勤規則、支援機制與提醒資訊都應一致。",
            icon: "安",
          },
        ],
      },
      {
        id: "courier-rhythm",
        badge: "Work Rhythm",
        title: "把工作節奏講清楚，比堆更多承諾更重要。",
        description: "營運團隊可以直接調整騎手招募話術與內容重點。",
        items: [
          {
            eyebrow: "Promise",
            title: "工作節奏有感",
            description: "高峰、離峰與獎勵結構以同一語言呈現。",
            icon: "節",
          },
          {
            eyebrow: "Support",
            title: "支援資訊集中",
            description: "避免騎手在關鍵時刻還要四處找答案。",
            icon: "支",
          },
        ],
      },
    ],
  },
  merchant: {
    hero: {
      badge: "Merchant Experience",
      title: "把店家的上架、營運與品牌更新，都收斂到同一個清楚入口。",
      description:
        "GoGet 店家端聚焦在零固定費、營運效率與曝光管理，幫助店家更快理解合作價值。",
      primaryLabel: "返回首頁",
      primaryHref: "/",
      secondaryLabel: "查看消費者頁",
      secondaryHref: "/consumer",
      asideTitle: "Merchant Snapshot",
      stats: [
        { label: "固定費", value: "0 元" },
        { label: "工具面向", value: "品牌 / 營運 / 曝光" },
        { label: "更新機制", value: "CMS 同步" },
      ],
      heroImageUrl: "/images/merchant.png",
    },
    sections: [
      {
        id: "merchant-zero-fee",
        badge: "Zero Fixed Fees",
        title: "先講清楚成本結構，店家才會願意繼續往下看。",
        description: "零固定費與合作門檻是最重要的轉換訊息之一。",
        items: [
          {
            eyebrow: "Fee",
            title: "零固定費",
            description: "降低合作初期的決策壓力。",
            icon: "零",
          },
          {
            eyebrow: "Launch",
            title: "快速開通",
            description: "縮短從接洽到上線的等待時間。",
            icon: "快",
          },
          {
            eyebrow: "Clarity",
            title: "合作條件清楚",
            description: "把費用、流程與支援機制講完整。",
            icon: "明",
          },
        ],
      },
      {
        id: "merchant-tools",
        badge: "Merchant Tools",
        title: "不只上架，還要讓店家看見持續經營的工具價值。",
        description: "曝光、訂單管理與品牌內容都需要可編輯的文案模組。",
        items: [
          {
            eyebrow: "Exposure",
            title: "提高品牌曝光",
            description: "活動主題、推薦位與內容亮點可以隨時調整。",
            icon: "曝",
          },
          {
            eyebrow: "Operations",
            title: "管理更有效率",
            description: "讓店家快速掌握訂單節奏與營運重點。",
            icon: "營",
          },
          {
            eyebrow: "Brand",
            title: "品牌語氣一致",
            description: "把店家招募與前台品牌訊息保持同步。",
            icon: "牌",
          },
        ],
      },
    ],
  },
};

