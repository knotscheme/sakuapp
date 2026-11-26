"use client";

import { useEffect } from "react";

const MAIN = "/sakuapp/works/lp-oem";
const HERE = "/sakuapp/works/lp-oem-pack";

export default function ToMainCms() {
  useEffect(() => {
    location.replace(MAIN + location.pathname.replace(HERE, "") + location.search + location.hash);
  }, []);
  return <p className="p-10 text-center text-[13px] text-mute">管理画面へ移動しています…</p>;
}
