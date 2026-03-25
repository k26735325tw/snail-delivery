export type Partner = {
  image: {
    src: string;
    alt: string;
  };
  companyName: string;
  contactInfo: string;
  serviceScope: string;
};

export const partnersSection = {
  title: "合作廠商",
  description: "此區預留合作廠商資訊，實際資料將於確認後更新。",
};

export const partners: Partner[] = [];
