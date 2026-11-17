"use client";

import { useEffect, useState } from "react";
import { Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { toast } from "./Confirm";
import { lineUrl, mailUrl } from "@/lib/share";

// できたリンクを、LINE・メール・コピーで送る
export default function SendLink({ url, text, subject }: { url: string; text: string; subject: string }) {
  const [canShare, setCanShare] = useState(false);
  useEffect(() => { setCanShare(typeof navigator !== "undefined" && "share" in navigator); }, []);
  const msg = `${text}\n${url}`;
  const copy = async () => { try { await navigator.clipboard.writeText(msg); toast("コピーしました。LINEやメールに貼り付けて送ってください"); } catch { toast("コピーできませんでした"); } };
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <a href={lineUrl(msg)} target="_blank" rel="noopener noreferrer" className="btn min-h-[3.4rem] bg-[#06c755] text-white hover:brightness-95"><MessageCircle size={22} />LINEで送る</a>
      <a href={mailUrl(subject, msg)} className="btn btn-sub min-h-[3.4rem]"><Mail size={22} />メールで送る</a>
      <button type="button" onClick={copy} className="btn btn-sub min-h-[3.4rem]"><Copy size={22} />コピーする</button>
      {canShare && <button type="button" onClick={() => navigator.share({ title: subject, text, url }).catch(() => {})} className="btn btn-sub min-h-[3.4rem]"><Share2 size={22} />ほかのアプリで送る</button>}
    </div>
  );
}
