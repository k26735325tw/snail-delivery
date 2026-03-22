export type CmsStat = {
  label: string;
  value: string;
};

export type CmsContentItem = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: string;
};

export type CmsSection = {
  id: string;
  badge: string;
  title: string;
  description: string;
  items: CmsContentItem[];
};

export type CmsDownloadCard = {
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
};

export type CmsLaunchStep = {
  index: string;
  title: string;
  description: string;
};

export type CmsRoleHero = {
  badge: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  asideTitle: string;
  stats: CmsStat[];
  heroImageUrl?: string;
};

export type CmsRolePage = {
  hero: CmsRoleHero;
  sections: CmsSection[];
};

export type CmsData = {
  site: {
    siteName: string;
    logoUrl: string;
    footerTitle: string;
    footerDescription: string;
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
    downloadCards: CmsDownloadCard[];
    launchFlow: CmsLaunchStep[];
  };
  consumer: CmsRolePage;
  courier: CmsRolePage;
  merchant: CmsRolePage;
};

