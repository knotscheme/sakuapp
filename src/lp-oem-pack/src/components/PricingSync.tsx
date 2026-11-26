"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { loadPricing, subscribePricing } from "@/lib/pricing";

// 価格と割引の設定が変わったら、ページ全体を新しい値で描き直す
// （最初は初期値で表示し、保存された設定が初期値と違うときだけ切り替える）
export default function PricingSync({ children }: { children: ReactNode }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const off = subscribePricing(() => setV((x) => x + 1));
    loadPricing();
    return off;
  }, []);
  return <Fragment key={v}>{children}</Fragment>;
}
