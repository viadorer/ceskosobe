export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateFormatted: string;
  category: string;
  categoryName: string;
  readTime: number;
  image: string;
  imageAlt: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  featured?: boolean;
}

export const CATEGORIES = [
  { key: "all", label: "Vše" },
  { key: "guide", label: "Průvodce" },
  { key: "market", label: "Trh a finance" },
  { key: "tips", label: "Tipy" },
  { key: "investment", label: "Investice" },
  { key: "legal", label: "Právní záležitosti" },
] as const;
