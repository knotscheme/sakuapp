"use client";

// 管理画面の表示言語（メンバーごとに設定。タイの工場の人はタイ語で表示）
// 本番では next-intl などで言葉を切り替え、言語の設定は Supabase のメンバー情報に保存する
// ※タイ語・英語はサンプルの翻訳です。本番前にネイティブの確認が必要
import { useSyncExternalStore } from "react";
import { useAuth } from "./perm";

export type Lang = "ja" | "th" | "en";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "ja", label: "日本語" },
  { id: "th", label: "ไทย" },
  { id: "en", label: "English" },
];

// 一時的に別の言語で見る（オーナーが工場の人と同じ画面を日本語で見る、など）。人を切り替えると戻る
let override: { who: string; lang: Lang } | null = null;
const subs = new Set<() => void>();
export function setViewLang(who: string, lang: Lang | null) {
  override = lang ? { who, lang } : null;
  subs.forEach((f) => f());
}
const useOverride = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => override, () => null);

// いま表示する言語と、その人の本来の言語
export function useLang() {
  const { me } = useAuth();
  const o = useOverride();
  const home: Lang = me?.lang ?? "ja";
  const lang: Lang = o && o.who === me?.id ? o.lang : home;
  return { lang, home, temp: lang !== home };
}

// 画面の枠（メニューなど）の言葉
export const UI = {
  ja: {
    nav: { dash: "ダッシュボード", deals: "案件ボード", products: "商品管理", analytics: "アナリティクス", factory: "工場の画面", inspect: "国内検品", members: "メンバーと権限", portal: "お客様の画面（例）", manual: "使い方マニュアル" },
    noAccess: "この画面を見る権限がありません", noAccessB: "必要な場合は、オーナーに権限の追加を頼んでください。",
    viewing: "表示中（デモ：人を切り替え）", authNote: "ログインは Supabase Auth（スタッフ・工場・検品で権限を分ける）",
    reset: "デモをリセット", resetQ: "デモを最初の状態に戻しますか？", resetB: "案件・商品・メンバーと権限の変更がすべて消えます。", resetOk: "戻す",
    back: "LPに戻る", menu: "メニュー", prod: "※本番では：",
    footer: "※ポートフォリオ用のデモです。データはすべて架空で、操作した内容はこのブラウザにだけ保存されます。",
    lang: "表示する言語", langNote: "メンバーごとの言語は「メンバーと権限」で設定", sample: "",
    ok: "実行する", cancel: "キャンセル",
    more: "その他", tab: { dash: "ホーム", deals: "案件", products: "商品", analytics: "分析", factory: "工場", inspect: "検品", members: "メンバー", portal: "お客様", manual: "マニュアル" }, deal: "案件", goTo: "使える画面へ", loading: "読み込み中…", docNo: "この書類を見る権限がありません",
  },
  th: {
    nav: { dash: "แดชบอร์ด", deals: "บอร์ดงาน", products: "จัดการสินค้า", analytics: "สถิติ", factory: "หน้าจอโรงงาน", inspect: "ตรวจสินค้าที่ญี่ปุ่น", members: "สมาชิกและสิทธิ์", portal: "หน้าจอลูกค้า (ตัวอย่าง)", manual: "คู่มือการใช้งาน" },
    noAccess: "คุณไม่มีสิทธิ์ดูหน้านี้", noAccessB: "หากต้องการใช้งาน กรุณาขอสิทธิ์จากเจ้าของ",
    viewing: "กำลังแสดง (เดโม: สลับผู้ใช้)", authNote: "เข้าสู่ระบบด้วย Supabase Auth (แยกสิทธิ์พนักงาน / โรงงาน / ผู้ตรวจ)",
    reset: "รีเซ็ตเดโม", resetQ: "รีเซ็ตเดโมกลับเป็นค่าเริ่มต้น?", resetB: "การเปลี่ยนแปลงงาน สินค้า และสิทธิ์ทั้งหมดจะถูกลบ", resetOk: "รีเซ็ต",
    back: "กลับไปหน้า LP", menu: "เมนู", prod: "※ในระบบจริง: ",
    footer: "※นี่คือเดโมสำหรับพอร์ตโฟลิโอ ข้อมูลทั้งหมดเป็นข้อมูลสมมติ และบันทึกไว้ในเบราว์เซอร์นี้เท่านั้น",
    lang: "ภาษา", langNote: "", sample: "※คำแปลภาษาไทยเป็นตัวอย่าง",
    ok: "ยืนยัน", cancel: "ยกเลิก",
    more: "เพิ่มเติม", tab: { dash: "หน้าหลัก", deals: "งาน", products: "สินค้า", analytics: "สถิติ", factory: "โรงงาน", inspect: "ตรวจสินค้า", members: "สมาชิก", portal: "ลูกค้า", manual: "คู่มือ" }, deal: "รายละเอียดงาน", goTo: "ไปยังหน้าที่ใช้งานได้", loading: "กำลังโหลด…", docNo: "คุณไม่มีสิทธิ์ดูเอกสารนี้",
  },
  en: {
    nav: { dash: "Dashboard", deals: "Deals", products: "Products", analytics: "Analytics", factory: "Factory", inspect: "Inspection (Japan)", members: "Members & roles", portal: "Customer view (sample)", manual: "User guide" },
    noAccess: "You don't have access to this page", noAccessB: "Ask the owner if you need access.",
    viewing: "Viewing as (demo: switch user)", authNote: "Login uses Supabase Auth (separate roles for staff, factory and inspection)",
    reset: "Reset demo", resetQ: "Reset the demo?", resetB: "All changes to deals, products and permissions will be cleared.", resetOk: "Reset",
    back: "Back to LP", menu: "Menu", prod: "※In production: ",
    footer: "※Portfolio demo. All data is fictional and only saved in this browser.",
    lang: "Language", langNote: "", sample: "※English text is a sample translation",
    ok: "OK", cancel: "Cancel",
    more: "More", tab: { dash: "Home", deals: "Deals", products: "Products", analytics: "Analytics", factory: "Factory", inspect: "Inspect", members: "Members", portal: "Customer", manual: "Guide" }, deal: "Deal", goTo: "Go to your pages", loading: "Loading…", docNo: "You don't have access to this document",
  },
} as const;
export const useUI = () => UI[useLang().lang];

// 各画面の見出し（日本語で書かれたもの）を、表示中の言語に置き換える
export function trTitle(title: string, lang: Lang) {
  if (lang === "ja") return title;
  const ja = UI.ja;
  if (title === ja.deal) return UI[lang].deal;
  const key = (Object.keys(ja.nav) as (keyof typeof ja.nav)[]).find((k) => ja.nav[k] === title);
  return key ? UI[lang].nav[key] : title;
}
