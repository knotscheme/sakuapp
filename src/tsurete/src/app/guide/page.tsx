"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";

// 使い方ガイドは「学ぶ・使い方」にまとめた。古いリンクから来た人は、そちらへ移す
export default function Page() {
  const router = useRouter();
  useEffect(() => { router.replace("/manabu/#use"); }, [router]);
  return <Shell><p className="text-sub">「学ぶ・使い方」へ移動しています…</p></Shell>;
}
