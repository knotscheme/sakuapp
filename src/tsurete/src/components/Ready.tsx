"use client";

import { useMounted } from "@/lib/store";

export default function Ready({ children }: { children: React.ReactNode }) {
  return useMounted() ? <>{children}</> : <p className="py-20 text-center text-sub">読みこんでいます…</p>;
}
