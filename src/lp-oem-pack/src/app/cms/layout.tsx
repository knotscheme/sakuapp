import type { Metadata } from "next";
import ToMainCms from "./to-main";

export const metadata: Metadata = { title: "CRAFT CMS（デモ）", robots: { index: false } };

// 管理画面はロゴ入れOEM（/works/lp-oem/）と同じものを使う（OEM・ODMの案件をひとつの画面で管理）。
// データはブラウザの同じ保存場所なので、このLPから届いた問い合わせもそこに入る
export default function CmsLayout() {
  return <ToMainCms />;
}
