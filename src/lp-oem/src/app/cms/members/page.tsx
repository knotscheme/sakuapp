"use client";

import { useState } from "react";
import { Check, Lock, Trash2, UserPlus } from "lucide-react";
import { PERMS, addMember, removeMember, setMemberRole, togglePerm, useAuth, usePermState } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, NoAccess, Shell } from "@/components/cms/ui";

export default function Members() {
  const { roles, members, me } = usePermState();
  const { can } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("sales");

  if (!can("members.manage")) return <Shell title="メンバーと権限"><NoAccess /></Shell>;
  const field = "rounded-lg border border-line px-3 py-2 text-[13px] outline-none focus:border-ink";

  return (
    <Shell title="メンバーと権限" note="ログインは Supabase Auth。招待するとメールが届き、権限はデータベースの行レベルの権限（RLS）でも守る">
      <div className="space-y-5">
        <Card>
          <CardHead>メンバー</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {members.map((m) => {
              const r = roles.find((x) => x.id === m.role);
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f0] text-[13px] font-medium">{m.name.slice(0, 1)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{m.name}{m.id === me && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10.5px] text-white">あなた</span>}</p>
                    <p className="text-[11.5px] break-all text-mute">{m.email}</p>
                  </div>
                  {m.id !== "u1" ? (
                    <button type="button" aria-label="削除" onClick={async () => { if (await askConfirm({ title: `${m.name}さんを外しますか？`, body: "この人はログインできなくなります。", ok: "外す", danger: true })) removeMember(m.id); }} className="rounded-md p-2 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={15} /></button>
                  ) : <span className="w-[31px]" />}
                  <select value={m.role} disabled={m.id === "u1"} onChange={(e) => setMemberRole(m.id, e.target.value)} className={`${field} order-last ml-12 w-[calc(100%-3rem)] disabled:bg-[#fafafa] sm:order-none sm:ml-0 sm:w-36`} aria-label={`${m.name}の役割`}>
                    {roles.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                  <p className="order-last -mt-1 w-full pl-12 text-[11.5px] text-mute sm:hidden">{r?.desc}</p>
                </li>
              );
            })}
          </ul>
          <form className="flex flex-wrap gap-2 border-t border-line p-5" onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return; addMember(name.trim(), email.trim(), role); setName(""); setEmail(""); }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" className={`${field} w-full sm:w-32`} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" type="email" className={`${field} min-w-0 flex-1`} />
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`${field} w-full sm:w-36`}>
              {roles.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <button className="cms-btn inline-flex w-full items-center justify-center gap-1.5 bg-ink px-4 py-2 text-[13px] text-white sm:w-auto"><UserPlus size={15} />招待する</button>
          </form>
        </Card>

        <Card>
          <CardHead note="チェックを変えると、その役割の人の画面とボタンがすぐに変わる">役割ごとにできること</CardHead>
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[640px] text-[12.5px]">
              <thead>
                <tr className="bg-[#fafafa] text-left">
                  <th className="px-5 py-3 font-normal text-mute">できること</th>
                  {roles.map((r) => <th key={r.id} className="px-3 py-3 text-center font-medium whitespace-nowrap">{r.name}{r.locked && <Lock size={11} className="ml-1 inline text-mute" />}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PERMS.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">{p.ja}</td>
                    {roles.map((r) => {
                      const on = r.perms.includes(p.id);
                      return (
                        <td key={r.id} className="px-3 py-2 text-center">
                          <button type="button" disabled={r.locked} onClick={() => togglePerm(r.id, p.id)} aria-pressed={on} aria-label={`${r.name}：${p.ja}`}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition ${on ? "border-ink bg-ink text-white" : "border-line bg-white text-transparent hover:border-mute"} ${r.locked ? "opacity-60" : ""}`}>
                            <Check size={14} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-5 py-3 text-[11.5px] text-mute">オーナーは常にすべての操作ができます。左下の「表示中」で人を切り替えると、その人の見え方を試せます。</p>
        </Card>
      </div>
    </Shell>
  );
}
