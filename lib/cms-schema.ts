export type CmsFontSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "4xl" | "6xl";
export type CmsFontWeight = "400" | "500" | "700" | "900";
export type CmsTextAlign = "left" | "center" | "right";
export type CmsLineHeight = "tight" | "normal" | "relaxed";
export type CmsObjectFit = "cover" | "contain";
export type CmsShadow = "none" | "sm" | "md" | "lg";
export type CmsRadius = "none" | "md" | "lg" | "xl" | "2xl" | "full";
export type CmsSpacing = "0" | "2" | "4" | "6" | "8" | "10" | "12" | "16";

export type CmsTextStyle = {
  fontSize: CmsFontSize;
  fontWeight: CmsFontWeight;
  textAlign: CmsTextAlign;
  textColor: string;
  lineHeight: CmsLineHeight;
};

export type CmsBlockStyle = {
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  borderRadius: CmsRadius;
  paddingX: CmsSpacing;
  paddingY: CmsSpacing;
  shadow: CmsShadow;
};

export type CmsImageAsset = {
  url: string;
  alt: string;
  objectFit: CmsObjectFit;
  focalX: number;
  focalY: number;
  desktopHeight: number;
  mobileHeight: number;
};

export type CmsLinkItem = {
  label: string;
  href: string;
};

export type CmsLinkGroup = {
  id?: string;
  title: string;
  links: CmsLinkItem[];
};

export type CmsStat = {
  label: string;
  value: string;
};

export type CmsContentItem = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  icon?: string;
  eyebrowStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  blockStyle: CmsBlockStyle;
};

export type CmsSection = {
  id: string;
  badge: string;
  title: string;
  description: string;
  badgeStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  blockStyle: CmsBlockStyle;
  items: CmsContentItem[];
};

export type CmsDownloadCard = {
  id?: string;
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  image: CmsImageAsset;
  iosUrl: string;
  androidUrl: string;
  highlights: string[];
  eyebrowStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  audienceStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  blockStyle: CmsBlockStyle;
};

export type CmsHomeFeatureCard = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  eyebrowStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  blockStyle: CmsBlockStyle;
};

export type CmsLaunchStep = {
  id?: string;
  index: string;
  title: string;
  description: string;
  indexStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  blockStyle: CmsBlockStyle;
};

export type CmsPartnerItem = {
  id?: string;
  image: CmsImageAsset;
  name: string;
  nameUrl: string;
  contactInfo: string;
  contactUrl: string;
  serviceScope: string;
};

export type CmsFlexBlock = {
  id?: string;
  type: "text" | "image" | "video";
  heading: string;
  body: string;
  mediaUrl: string;
  mediaAlt: string;
  caption: string;
  linkUrl: string;
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
  heroImage: CmsImageAsset;
  badgeStyle: CmsTextStyle;
  titleStyle: CmsTextStyle;
  descriptionStyle: CmsTextStyle;
  asideTitleStyle: CmsTextStyle;
  sectionStyle: CmsBlockStyle;
};

export type CmsSeo = {
  pageTitle: string;
  metaDescription: string;
  canonicalPath: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

export type CmsRolePage = {
  hero: CmsRoleHero;
  sections: CmsSection[];
  seo: CmsSeo;
};

export type CmsAboutPage = {
  title: string;
  description: string;
  intro: string;
  videoTitle: string;
  videoDescription: string;
  videoHint: string;
  aboutVideoUrl: string;
  aboutVideoPoster: string;
  flexSection: {
    title: string;
    description: string;
    blocks: CmsFlexBlock[];
  };
};

export type CmsData = {
  site: {
    siteName: string;
    siteUrl: string;
    logo: CmsImageAsset;
    organizationName: string;
    footerTitle: string;
    footerDescription: string;
    footerTitleStyle: CmsTextStyle;
    footerDescriptionStyle: CmsTextStyle;
    footerLinkGroups: CmsLinkGroup[];
    footerStyle: CmsBlockStyle;
    defaultSeoImageUrl: string;
  };
  home: {
    header: {
      subtitle: string;
      subtitleStyle: CmsTextStyle;
      navItems: CmsLinkItem[];
      aboutLink: CmsLinkItem;
      cta: CmsLinkItem;
      blockStyle: CmsBlockStyle;
    };
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
      deviceBadge: string;
      secondaryBadge: string;
      heroImage: CmsImageAsset;
      badgeStyle: CmsTextStyle;
      titleStyle: CmsTextStyle;
      subtitleStyle: CmsTextStyle;
      deviceBadgeStyle: CmsTextStyle;
      secondaryBadgeStyle: CmsTextStyle;
      sectionStyle: CmsBlockStyle;
    };
    features: {
      cards: CmsHomeFeatureCard[];
      sectionStyle: CmsBlockStyle;
    };
    downloadCards: CmsDownloadCard[];
    launchFlow: {
      eyebrow: string;
      title: string;
      description: string;
      eyebrowStyle: CmsTextStyle;
      titleStyle: CmsTextStyle;
      descriptionStyle: CmsTextStyle;
      leftBlockStyle: CmsBlockStyle;
      rightBlockStyle: CmsBlockStyle;
      steps: CmsLaunchStep[];
    };
    flexSection: {
      title: string;
      description: string;
      blocks: CmsFlexBlock[];
    };
    partnersSection: {
      title: string;
      description: string;
      items: CmsPartnerItem[];
    };
    seo: CmsSeo;
  };
  about: CmsAboutPage;
  consumer: CmsRolePage;
  courier: CmsRolePage;
  merchant: CmsRolePage;
};
