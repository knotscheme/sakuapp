import type { Metadata } from "next";

export const metadata: Metadata = { title: "CRAFT CMS（デモ）", robots: { index: false } };

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
