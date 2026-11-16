"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { LayoutGrid, KanbanSquare, Factory, ClipboardCheck, UserRound, ArrowLeft, RotateCcw, Menu, Cpu, Package, BarChart3, ShieldCheck, Lock, BookOpen } from "lucide-react";
import { resetPerm, switchUser, useAuth, usePermState, type Perm } from "./perm";
import { STAGES, daysLeft, stageIndex, type StageId } from "@/lib/cms";
import { resetDemo, unreadOf, useDeals } from "./store";
import { resetCatalog } from "./catalog";
import { ConfirmHost, askConfirm } from "./Confirm";
import { LANGS, setViewLang, trTitle, useLang, useUI, UI } from "./i18n";

// URLの ?id= などを読む（静的に書き出すため、表示後に読む）
export function useQuery(name: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URLは表示後にしか読めないため
    setV(new URLSearchParams(location.search).get(name));
  }, [name]);
  return v;
}

type NavKey = keyof (typeof UI)["ja"]["nav"];
const NAV: { href: string; label: NavKey; icon: typeof LayoutGrid; perm?: Perm }[] = [
  { href: "/cms/", label: "dash", icon: LayoutGrid, perm: "deals.view" },
  { href: "/cms/deals/", label: "deals", icon: KanbanSquare, perm: "deals.view" },
  { href: "/cms/products/", label: "products", icon: Package, perm: "products.edit" },
  { href: "/cms/analytics/", label: "analytics", icon: BarChart3, perm: "analytics.view" },
  { href: "/cms/factory/", label: "factory", icon: Factory, perm: "factory.use" },
  { href: "/cms/inspect/", label: "inspect", icon: ClipboardCheck, perm: "inspect.use" },
  { href: "/cms/members/", label: "members", icon: ShieldCheck, perm: "members.manage" },
  { href: "/cms/portal/?id=C-1027", label: "portal", icon: UserRound, perm: "deals.view" },
  { href: "/cms/manual/", label: "manual", icon: BookOpen },
];

// 権限が無いときの表示
export function NoAccess() {
  const t = useUI();
  const { can } = useAuth();
  const first = NAV.find((n) => n.perm && can(n.perm)) ?? NAV[NAV.length - 1];
  return (
    <div className="cms-card flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f1f0]"><Lock size={18} /></span>
      <p className="mt-4 text-[15px] font-semibold">{t.noAccess}</p>
      <p className="mt-1.5 text-[13px] text-mute">{t.noAccessB}</p>
      <Link href={first.href} className="cms-btn mt-6 inline-flex items-center gap-1.5 bg-ink px-4 py-2.5 text-[13px] text-white">{t.goTo}：{t.nav[first.label]}</Link>
    </div>
  );
}

// 表示する言語を一時的に切り替える（その人の本来の言語は「メンバーと権限」で設定）
function LangSwitch() {
  const { me } = useAuth();
  const { lang, home } = useLang();
  const t = useUI();
  if (!me) return null;
  return (
    <div className="mx-3 mb-2">
      <p className="mb-1 px-0.5 text-[10.5px] text-mute">{t.lang}</p>
      <div className="flex overflow-hidden rounded-lg border border-line bg-white/70 text-[11.5px]">
        {LANGS.map((l) => <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setViewLang(me.id, l.id === home ? null : l.id)} className={`flex-1 py-1.5 ${lang === l.id ? "bg-ink text-white" : "text-mute hover:text-ink"}`}>{l.label}</button>)}
      </div>
      {t.langNote && <p className="mt-1 px-0.5 text-[10px] leading-snug text-mute"><Ph>{t.langNote}</Ph></p>}
    </div>
  );
}

// デモ用：誰として見るかを切り替える
function UserSwitch() {
  const { members, roles, me } = usePermState();
  const cur = members.find((m) => m.id === me);
  const t = useUI();
  if (!cur) return null;
  return (
    <label className="mx-3 mb-2 block rounded-lg bg-white/70 px-3 py-2.5">
      <span className="block text-[10.5px] text-mute">{t.viewing}</span>
      <select value={me} onChange={(e) => { setViewLang("", null); switchUser(e.target.value); }} className="mt-1 w-full bg-transparent text-[13px] font-medium outline-none">
        {members.map((m) => <option key={m.id} value={m.id}>{m.name}（{roles.find((r) => r.id === m.role)?.name}）</option>)}
      </select>
    </label>
  );
}

// 下のメニューが隠れているか（案件の画面の「次にやること」ボタンも、これに合わせて動く）
let navHiddenNow = false;
const navSubs = new Set<() => void>();
function setNavHidden(v: boolean) { if (v !== navHiddenNow) { navHiddenNow = v; navSubs.forEach((f) => f()); } }
export function useNavHidden() {
  return useSyncExternalStore((f) => { navSubs.add(f); return () => navSubs.delete(f); }, () => navHiddenNow, () => false);
}

export function Shell({ title, children, actions, note, bottomPad }: { title: string; children: ReactNode; actions?: ReactNode; note?: ReactNode; bottomPad?: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { can } = useAuth();
  const t = useUI();
  const { lang } = useLang();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const navHidden = useNavHidden();
  useEffect(() => {
    let last = scrollY;
    setNavHidden(false);
    const on = () => {
      const y = scrollY;
      const atEnd = innerHeight + y >= document.documentElement.scrollHeight - 40;
      if (atEnd) setNavHidden(false);
      else if (Math.abs(y - last) > 8) { setNavHidden(y > last && y > 80); last = y; }
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [path]);
  const items = NAV.filter((n) => !n.perm || can(n.perm));
  // 工場からの未読の連絡（日本側の人だけ）、工場の人には日本からの未読の返信
  const allDeals = useDeals();
  const badge: Partial<Record<NavKey, number>> = can("deals.view")
    ? { dash: allDeals.reduce((s, d) => s + unreadOf(d, "factory"), 0) }
    : { factory: allDeals.reduce((s, d) => s + unreadOf(d, "japan"), 0) };
  const Badge = ({ k, dot }: { k: NavKey; dot?: boolean }) => (badge[k] ?? 0) > 0 ? <span className={dot ? "absolute -top-1 left-1/2 ml-1.5 min-w-4 rounded-full bg-red-600 px-1 text-[9.5px] leading-4 text-white" : "ml-auto rounded-full bg-red-600 px-1.5 text-[10.5px] leading-5 text-white"}>{badge[k]}</span> : null;
  const isOn = (href: string) => (href === "/cms/" ? path === "/cms/" || path === "/cms" : path.startsWith(href.split("?")[0].replace(/\/$/, "")));
  // スマホ下のタブ：よく使う画面を4つまで（残りは「その他」からメニューで）
  const TAB_ORDER: NavKey[] = ["dash", "deals", "products", "analytics", "factory", "inspect", "members", "manual"];
  const tabs = TAB_ORDER.map((k) => items.find((n) => n.label === k)).filter((n): n is (typeof NAV)[number] => !!n).slice(0, 4);
  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto">
      <Link href="/cms/" className="px-6 pt-7 pb-7 font-display text-[15px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></Link>
      <ul className="flex-1 space-y-1 px-3">
        {items.map(({ href, label: key, icon: Icon }) => {
          const label = t.nav[key];
          const on = isOn(href);
          return (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition lg:py-2 lg:text-[13.5px] ${on ? "bg-white font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,.08)]" : "text-ink/65 hover:bg-white/60 hover:text-ink"}`}>
                <Icon size={16} strokeWidth={1.7} /> {label}<Badge k={key} />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 px-3 py-4 text-[12px]">
        <UserSwitch />
        <LangSwitch />
        <TechNote className="mx-3 mb-3">{t.authNote}</TechNote>
        <button type="button" onClick={async () => { if (await askConfirm({ title: t.resetQ, body: t.resetB, ok: t.resetOk, danger: true })) { setViewLang("", null); resetDemo(); resetCatalog(); resetPerm(); } }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-mute hover:bg-white/60 hover:text-ink"><RotateCcw size={14} /> {t.reset}</button>
        <a href="/sakuapp/works/lp-oem/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-mute hover:bg-white/60 hover:text-ink"><ArrowLeft size={14} /> {t.back}</a>
      </div>
    </nav>
  );
  return (
    <div className="cms-bg min-h-[100svh] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-[#ebebea] lg:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#ebebea] transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{nav}</aside>
      <div className="lg:pl-60">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-[#f1f1f0]/90 px-5 backdrop-blur lg:hidden">
          <button type="button" className="-ml-2.5 p-2.5" onClick={() => setOpen(true)} aria-label={t.menu}><Menu size={20} /></button>
          <span className="font-display text-[13px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></span>
        </div>
        <main className={`mx-auto max-w-[1180px] px-5 py-6 md:px-10 md:py-10 ${bottomPad ? "pb-[calc(9rem+env(safe-area-inset-bottom))] md:pb-[calc(6rem+env(safe-area-inset-bottom))]" : "pb-[calc(6rem+env(safe-area-inset-bottom))]"} lg:pb-10`}>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold tracking-[0.02em]"><Ph>{trTitle(title, lang)}</Ph></h1>
              {note && <TechNote className="mt-1.5">{note}</TechNote>}
            </div>
            {actions}
          </div>
          {children}
          <ConfirmHost />
          <p className="mt-10 text-[11px] text-mute">{t.footer}{t.sample && <span className="block">{t.sample}</span>}</p>
        </main>
        {/* スマホ・タブレット：下に浮かぶ小さなメニュー（アイコンだけ。下へスクロールすると隠れる） */}
        <nav aria-label={t.menu} className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 transition-[translate,opacity] duration-300 lg:hidden ${navHidden ? "pointer-events-none translate-y-[160%] opacity-0" : "translate-y-0 opacity-100"}`}>
          <ul className="flex items-center gap-1 rounded-full border border-black/5 bg-white/80 p-1.5 shadow-[0_6px_24px_rgba(0,0,0,.12)] backdrop-blur-xl backdrop-saturate-150">
            {tabs.map(({ href, label, icon: Icon }) => {
              const on = isOn(href);
              return (
                <li key={href}>
                  <Link href={href} aria-current={on ? "page" : undefined} aria-label={t.nav[label]} title={t.nav[label]} className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${on ? "bg-ink text-white" : "text-ink/55 active:bg-black/5"}`}>
                    <Icon size={19} strokeWidth={on ? 1.9 : 1.6} />
                    {(badge[label] ?? 0) > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" aria-label={`未読 ${badge[label]}`} />}
                  </Link>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={() => setOpen(true)} aria-label={t.more} className="flex h-11 w-11 items-center justify-center rounded-full text-ink/55 active:bg-black/5"><Menu size={19} strokeWidth={1.6} /></button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

// 仕組みの説明（本番ではここで何を使うか）を小さく添える
export function TechNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  const t = useUI();
  const [open, setOpen] = useState(false);
  // スマホでは1行だけ見せ、押すと全文を開く（画面を広く使うため）
  return (
    <p onClick={() => setOpen(!open)} className={`flex cursor-pointer items-start gap-1.5 text-[11px] leading-relaxed text-[#8a8a86] lg:cursor-auto ${className}`}>
      <Cpu size={12} strokeWidth={1.6} className="mt-[2px] shrink-0" />
      <span className={open ? "" : "max-lg:line-clamp-1"}>{t.prod}{typeof children === "string" ? <Ph tail={4}>{children}</Ph> : children}</span>
    </p>
  );
}

export function StageBadge({ stage }: { stage: StageId }) {
  const i = stageIndex(stage);
  const tone = stage === "done" ? "bg-ink/5 text-mute" : i >= 4 ? "bg-[#eef4ff] text-[#2a4f9e]" : i >= 2 ? "bg-[#fbf3e2] text-[#8a650c]" : "bg-[#f1f1ef] text-ink";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] whitespace-nowrap ${tone}`}><Ph>{STAGES[i].ja}</Ph></span>;
}

export function DueBadge({ due, stage }: { due: string; stage: StageId }) {
  if (stage === "done") return null;
  const n = daysLeft(due);
  const cls = n < 0 ? "text-red-600" : n <= 2 ? "text-[#b8860b]" : "text-mute";
  return <span className={`text-[11px] whitespace-nowrap ${cls}`}>{n < 0 ? `${-n}日遅れ` : n === 0 ? "今日まで" : `あと${n}日`}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`cms-card overflow-hidden ${className}`}>{children}</section>;
}
export function CardHead({ children, right, note }: { children: ReactNode; right?: ReactNode; note?: ReactNode }) {
  return (
    <div className="px-5 pt-5 pb-3">
      <div className="flex items-center justify-between gap-3"><h2 className="text-[14px] font-semibold">{typeof children === "string" ? <Ph>{children}</Ph> : children}</h2>{right}</div>
      {note && <TechNote className="mt-1">{note}</TechNote>}
    </div>
  );
}
