import type {
  CmsBlockStyle,
  CmsFontSize,
  CmsFontWeight,
  CmsImageAsset,
  CmsLineHeight,
  CmsObjectFit,
  CmsRadius,
  CmsShadow,
  CmsSpacing,
  CmsTextAlign,
  CmsTextStyle,
} from "@/lib/cms-schema";

export const BRAND_COLOR_OPTIONS = [
  { label: "品牌藍", value: "brand.blue" },
  { label: "品牌深藍", value: "brand.blueDeep" },
  { label: "品牌黃", value: "brand.yellow" },
  { label: "墨黑", value: "brand.ink" },
  { label: "淡藍", value: "brand.sky" },
  { label: "奶白", value: "brand.cream" },
  { label: "白色", value: "brand.white" },
  { label: "透明", value: "transparent" },
] as const;

export const FONT_SIZE_OPTIONS: CmsFontSize[] = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "4xl",
  "6xl",
];

export const FONT_WEIGHT_OPTIONS: CmsFontWeight[] = ["400", "500", "700", "900"];
export const TEXT_ALIGN_OPTIONS: CmsTextAlign[] = ["left", "center", "right"];
export const LINE_HEIGHT_OPTIONS: CmsLineHeight[] = ["tight", "normal", "relaxed"];
export const OBJECT_FIT_OPTIONS: CmsObjectFit[] = ["cover", "contain"];
export const SHADOW_OPTIONS: CmsShadow[] = ["none", "sm", "md", "lg"];
export const RADIUS_OPTIONS: CmsRadius[] = ["none", "md", "lg", "xl", "2xl", "full"];
export const SPACING_OPTIONS: CmsSpacing[] = ["0", "2", "4", "6", "8", "10", "12", "16"];

const brandColorMap: Record<string, string> = {
  "brand.blue": "#1b6fff",
  "brand.blueDeep": "#0b4fd4",
  "brand.yellow": "#ffd84a",
  "brand.ink": "#0e1d38",
  "brand.sky": "#eef5ff",
  "brand.cream": "#fbfcff",
  "brand.white": "#ffffff",
  transparent: "transparent",
};

const fontSizeMap: Record<CmsFontSize, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "4xl": "2.25rem",
  "6xl": "3.75rem",
};

const fontWeightMap: Record<CmsFontWeight, number> = {
  "400": 400,
  "500": 500,
  "700": 700,
  "900": 900,
};

const lineHeightMap: Record<CmsLineHeight, string> = {
  tight: "1.1",
  normal: "1.5",
  relaxed: "1.8",
};

const radiusMap: Record<CmsRadius, string> = {
  none: "0px",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  full: "9999px",
};

const spacingMap: Record<CmsSpacing, string> = {
  "0": "0px",
  "2": "0.5rem",
  "4": "1rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem",
};

const shadowMap: Record<CmsShadow, string> = {
  none: "none",
  sm: "0 10px 24px rgba(14,29,56,0.08)",
  md: "0 20px 50px rgba(14,29,56,0.12)",
  lg: "0 30px 80px rgba(14,29,56,0.18)",
};

export const defaultTextStyle = (
  overrides: Partial<CmsTextStyle> = {},
): CmsTextStyle => ({
  fontSize: "base",
  fontWeight: "500",
  textAlign: "left",
  textColor: "brand.ink",
  lineHeight: "normal",
  ...overrides,
});

export const defaultBlockStyle = (
  overrides: Partial<CmsBlockStyle> = {},
): CmsBlockStyle => ({
  backgroundColor: "brand.white",
  foregroundColor: "brand.ink",
  borderColor: "transparent",
  borderRadius: "xl",
  paddingX: "6",
  paddingY: "6",
  shadow: "sm",
  ...overrides,
});

export const defaultImageAsset = (
  url: string,
  alt: string,
  overrides: Partial<CmsImageAsset> = {},
): CmsImageAsset => ({
  url,
  alt,
  objectFit: "cover",
  focalX: 50,
  focalY: 50,
  desktopHeight: 360,
  mobileHeight: 240,
  ...overrides,
});

export function isValidColorValue(value: string) {
  return value in brandColorMap || /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value);
}

export function resolveColor(value: string, fallback = "#0e1d38") {
  return brandColorMap[value] ?? (isValidColorValue(value) ? value : fallback);
}

export function getTextStyle(style: CmsTextStyle) {
  return {
    fontSize: fontSizeMap[style.fontSize] ?? fontSizeMap.base,
    fontWeight: fontWeightMap[style.fontWeight] ?? fontWeightMap["500"],
    textAlign: (["left", "center", "right"].includes(style.textAlign) ? style.textAlign : "left"),
    color: resolveColor(style.textColor),
    lineHeight: lineHeightMap[style.lineHeight] ?? lineHeightMap.normal,
  } as const;
}

export function getBlockStyle(style: CmsBlockStyle) {
  return {
    backgroundColor: resolveColor(style.backgroundColor, "transparent"),
    color: resolveColor(style.foregroundColor),
    borderColor: resolveColor(style.borderColor, "transparent"),
    borderRadius: radiusMap[style.borderRadius] ?? radiusMap.xl,
    paddingLeft: spacingMap[style.paddingX] ?? spacingMap["6"],
    paddingRight: spacingMap[style.paddingX] ?? spacingMap["6"],
    paddingTop: spacingMap[style.paddingY] ?? spacingMap["6"],
    paddingBottom: spacingMap[style.paddingY] ?? spacingMap["6"],
    boxShadow: shadowMap[style.shadow] ?? shadowMap.sm,
    borderWidth: style.borderColor === "transparent" ? "0px" : "1px",
    borderStyle: "solid",
  } as const;
}

export function getImageStyle(image: CmsImageAsset, mobile = false) {
  return {
    objectFit: image.objectFit === "contain" ? "contain" : "cover",
    objectPosition: `${Number.isFinite(image.focalX) ? image.focalX : 50}% ${Number.isFinite(image.focalY) ? image.focalY : 50}%`,
  } as const;
}

export function getImageHeight(image: CmsImageAsset, mobile = false) {
  const height = mobile ? image.mobileHeight : image.desktopHeight;
  return `${Number.isFinite(height) ? height : mobile ? 240 : 360}px`;
}
