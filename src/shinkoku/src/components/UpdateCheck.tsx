"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 新しい版を公開したら、開いたままのページも自動で新しくする
// （アプリに戻ってきたとき・ページを移動したときだけ確かめる。入力の途中では読み込み直さない）
const BUILD = Number(process.env.NEXT_PUBLIC_BUILD ?? 0);
async function check() {
  try {
    const r = await fetch(`/sakuapp/works/shinkoku/version.txt?t=${Date.now()}`, { cache: "no-store" });
    const v = Number((await r.text()).trim());
    if (!(v > BUILD)) return;
    // 同じ版のために読み込み直すのは1回だけ（配信の仕組みで古いページが少し残っても、何度も読み込み直さない）
    let tried = "";
    try { tried = sessionStorage.getItem("jbs-reloaded-for") ?? ""; } catch {}
    if (tried === String(v)) return;
    try { sessionStorage.setItem("jbs-reloaded-for", String(v)); } catch {}
    location.reload();
  } catch {}
}

export default function UpdateCheck() {
  const path = usePathname();
  useEffect(() => { check(); }, [path]);
  useEffect(() => {
    const on = () => { if (document.visibilityState === "visible") check(); };
    // Safari の「戻る」は前のページをそのまま復元するので、そのときも確かめる
    const show = (e: PageTransitionEvent) => { if (e.persisted) check(); };
    document.addEventListener("visibilitychange", on);
    addEventListener("pageshow", show);
    return () => { document.removeEventListener("visibilitychange", on); removeEventListener("pageshow", show); };
  }, []);
  return null;
}
