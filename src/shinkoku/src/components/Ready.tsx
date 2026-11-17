"use client";

import { useMounted } from "@/lib/store";

// ブラウザに保存したデータを読みこんでから表示する
export default function Ready({ children }: { children: React.ReactNode }) {
  return useMounted() ? <>{children}</> : <p className="py-16 text-center text-[1.1rem] text-sub">読みこんでいます…</p>;
}
