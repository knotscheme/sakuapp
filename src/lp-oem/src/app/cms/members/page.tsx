"use client";

import { useState } from "react";
import { Check, ChevronRight, Lock, Minus, Plus, SlidersHorizontal, Trash2, UserPlus, X } from "lucide-react";
import { PERMS, addMemberWithLang, addRole, setMemberLang, clearMemberOverrides, cycleMemberPerm, deleteRole, effective, removeMember, setMemberRole, togglePerm, useAuth, usePermState, type Member } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { LANGS, type Lang } from "@/components/cms/i18n";
import { Card, CardHead, NoAccess, Shell, TechNote } from "@/components/cms/ui";

export default function Members() {
  const { roles, members, me, logs } = usePermState();
  const { can, isOwner } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("sales");
  const [lang, setLang] = useState<Lang>("ja");
  const [edit, setEdit] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleFrom, setRoleFrom] = useState("viewer");

  if (!can("members.manage")) return <Shell title="メンバーと権限"><NoAccess /></Shell>;
  const field = "rounded-lg border border-line px-3 py-2 text-[13px] outline-none focus:border-ink";
  const editing = members.find((m) => m.id === edit);

  return (
    <Shell title="メンバーと権限" note="ログインは Supabase Auth。権限の変更はオーナーだけができ、データベースの行レベルの権限（RLS）でも守る">
      {!isOwner && (
        <div className="cms-card mb-5 flex items-center gap-3 px-5 py-4 text-[13px]"><Lock size={16} className="shrink-0 text-mute" />権限の付与・変更はオーナーだけができます。あなたはメンバーの確認だけできます。</div>
      )}
      <div className="space-y-5">
        <Card>
          <CardHead note="「個別設定」で、その人だけに権限を足したり外したりできる。言語は、その人がログインしたときの画面の言葉（メンバー情報に保存）">メンバー</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {members.map((m) => {
              const r = roles.find((x) => x.id === m.role);
              const n = (m.extra?.length ?? 0) + (m.deny?.length ?? 0);
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f0] text-[13px] font-medium">{m.name.slice(0, 1)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{m.name}{m.id === me && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10.5px] text-white">あなた</span>}{n > 0 && <span className="ml-2 rounded-full bg-[#fbf3e2] px-2 py-0.5 text-[10.5px] text-[#8a650c]">個別設定 {n}</span>}</p>
                    <p className="text-[11.5px] break-all text-mute">{m.email}</p>
                  </div>
                  {isOwner && m.id !== "u1" && (
                    <>
                      <button type="button" onClick={() => setEdit(m.id)} className="flex items-center gap-1 rounded-md px-2 py-2 text-[12px] text-mute hover:bg-[#f1f1f0] hover:text-ink"><SlidersHorizontal size={14} /><span className="hidden sm:inline">個別設定</span></button>
                      <button type="button" aria-label="削除" onClick={async () => { if (await askConfirm({ title: `${m.name}さんを外しますか？`, body: "この人はログインできなくなります。", ok: "外す", danger: true })) removeMember(m.id); }} className="rounded-md p-2 text-mute hover:bg-[#f1f1f0] hover:text-red-600"><Trash2 size={15} /></button>
                    </>
                  )}
                  <div className="order-last ml-12 flex w-[calc(100%-3rem)] gap-2 sm:order-none sm:ml-0 sm:w-auto">
                  <select value={m.lang ?? "ja"} disabled={!isOwner} onChange={(e) => setMemberLang(m.id, e.target.value as Lang)} className={`${field} w-28 shrink-0 disabled:bg-[#fafafa] disabled:text-ink`} aria-label={`${m.name}の表示言語`}>
                    {LANGS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                  <select value={m.role} disabled={!isOwner || m.id === "u1"} onChange={async (e) => {
                    const v = e.target.value;
                    if (v === "owner" && !(await askConfirm({ title: `${m.name}さんをオーナーにしますか？`, body: "オーナーはすべての操作と、権限の変更ができるようになります。", ok: "オーナーにする", danger: true }))) return;
                    setMemberRole(m.id, v);
                  }} className={`${field} min-w-0 flex-1 disabled:bg-[#fafafa] disabled:text-ink sm:w-40 sm:flex-none`} aria-label={`${m.name}の役割`}>
                    {roles.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                  </div>
                  <p className="order-last -mt-1 w-full pl-12 text-[11.5px] text-mute sm:hidden">{r?.desc}</p>
                </li>
              );
            })}
          </ul>
          {isOwner && (
            <form className="flex flex-wrap gap-2 border-t border-line p-5" onSubmit={(e) => { e.preventDefault(); if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return; addMemberWithLang(name.trim(), email.trim(), role, lang); setName(""); setEmail(""); setLang("ja"); }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" className={`${field} w-full sm:w-32`} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレス" type="email" className={`${field} min-w-0 flex-1`} />
              <select value={role} onChange={(e) => setRole(e.target.value)} className={`${field} w-full sm:w-40`}>
                {roles.filter((x) => x.id !== "owner").map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label="表示する言語" className={`${field} w-full sm:w-28`}>
                {LANGS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <button className="cms-btn inline-flex w-full items-center justify-center gap-1.5 bg-ink px-4 py-2 text-[13px] text-white sm:w-auto"><UserPlus size={15} />招待する</button>
            </form>
          )}
        </Card>

        <Card>
          <CardHead note={isOwner ? "チェックを変えると、その役割の人の画面とボタンがすぐに変わる" : "オーナーだけが変更できます"}>役割ごとにできること</CardHead>
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[680px] text-[12.5px]">
              <thead>
                <tr className="bg-[#fafafa] text-left">
                  <th className="px-5 py-3 font-normal text-mute">できること</th>
                  {roles.map((r) => (
                    <th key={r.id} className="px-3 py-3 text-center font-medium whitespace-nowrap">
                      {r.name}{r.locked && <Lock size={11} className="ml-1 inline text-mute" />}
                      {isOwner && !r.locked && !["sales", "factory", "inspector", "viewer"].includes(r.id) && (
                        <button type="button" aria-label={`役割「${r.name}」を削除`} onClick={async () => { if (!(await askConfirm({ title: `役割「${r.name}」を削除しますか？`, ok: "削除する", danger: true }))) return; if (!deleteRole(r.id)) alert("この役割の人がいるため削除できません。先に別の役割に変えてください。"); }} className="ml-1 inline-flex align-middle text-mute hover:text-red-600"><X size={12} /></button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PERMS.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">{p.ja}</td>
                    {roles.map((r) => {
                      const on = r.perms.includes(p.id);
                      const off = r.locked || !isOwner;
                      return (
                        <td key={r.id} className="px-3 py-2 text-center">
                          <button type="button" disabled={off} onClick={() => togglePerm(r.id, p.id)} aria-pressed={on} aria-label={`${r.name}：${p.ja}`}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition ${on ? "border-ink bg-ink text-white" : "border-line bg-white text-transparent hover:border-mute"} ${off ? "cursor-default opacity-60" : ""}`}>
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
          {isOwner && (
            <form className="flex flex-wrap items-end gap-2 border-t border-line p-5" onSubmit={(e) => { e.preventDefault(); if (!roleName.trim()) return; addRole(roleName.trim(), "オーナーが作った役割", roleFrom); setRoleName(""); }}>
              <label className="flex w-full flex-col gap-1.5 text-[12px] sm:w-auto"><span className="text-mute">新しい役割の名前</span><input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="例：経理、外注デザイナー" className={field} /></label>
              <label className="flex w-full flex-col gap-1.5 text-[12px] sm:w-auto"><span className="text-mute">最初の権限</span>
                <select value={roleFrom} onChange={(e) => setRoleFrom(e.target.value)} className={field}>
                  <option value="">なし（あとで選ぶ）</option>
                  {roles.filter((r) => !r.locked).map((r) => <option key={r.id} value={r.id}>「{r.name}」と同じ</option>)}
                </select>
              </label>
              <button className="cms-btn inline-flex w-full items-center justify-center gap-1.5 border border-ink px-4 py-2 text-[13px] sm:w-auto"><Plus size={15} />役割を作る</button>
            </form>
          )}
        </Card>

        <Card>
          <CardHead note="権限の変更はすべて記録（audit_logs テーブル）">権限の変更履歴</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {logs.map((l, i) => (
              <li key={i} className="flex items-start gap-3 px-5 py-3 text-[12.5px]"><ChevronRight size={14} className="mt-0.5 shrink-0 text-mute" /><span className="flex-1">{l.text}</span><span className="shrink-0 text-[11px] text-mute">{l.at}・{l.by}</span></li>
            ))}
            {!logs.length && <li className="px-5 py-5 text-[12.5px] text-mute">まだ変更はありません。</li>}
          </ul>
        </Card>
      </div>

      {editing && <MemberPanel m={editing} onClose={() => setEdit(null)} />}
    </Shell>
  );
}

// 人ごとの個別設定（役割どおり → 個別に許可 → 個別に禁止、を押して切り替え）
function MemberPanel({ m, onClose }: { m: Member; onClose: () => void }) {
  const { roles } = usePermState();
  const r = roles.find((x) => x.id === m.role);
  const eff = effective(m, roles);
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="text-[15px] font-semibold">{m.name}さんの権限</p>
            <p className="text-[12px] text-mute">役割：{r?.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-md p-1.5 hover:bg-[#f1f1f0]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-[12.5px] leading-relaxed text-mute">役割の権限に加えて、この人だけ許可・禁止できます。押すたびに切り替わります。</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {PERMS.map((p) => {
              const inRole = !!r?.perms.includes(p.id);
              const extra = m.extra?.includes(p.id);
              const deny = m.deny?.includes(p.id);
              const on = eff.includes(p.id);
              const tag = extra ? "個別に許可" : deny ? "個別に禁止" : inRole ? "役割で許可" : "役割で禁止";
              return (
                <li key={p.id}>
                  <button type="button" onClick={() => cycleMemberPerm(m.id, p.id)} className="flex w-full items-center gap-3 py-3 text-left text-[13px]">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${on ? "border-ink bg-ink text-white" : "border-line text-mute"}`}>{on ? <Check size={14} /> : <Minus size={14} />}</span>
                    <span className="flex-1">{p.ja}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] ${extra ? "bg-[#e6f4ea] text-[#1e6b34]" : deny ? "bg-red-50 text-red-600" : "bg-[#f1f1f0] text-mute"}`}>{tag}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <TechNote className="mt-3">個別の設定は member_permissions テーブルに保存。ログイン中の画面にもすぐ反映</TechNote>
        </div>
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <button type="button" onClick={() => clearMemberOverrides(m.id)} className="text-[12.5px] text-mute underline underline-offset-4 hover:text-ink">役割どおりに戻す</button>
          <button type="button" onClick={onClose} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white">完了</button>
        </div>
      </div>
    </div>
  );
}
