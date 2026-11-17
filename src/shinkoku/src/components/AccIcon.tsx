import { Banknote, BookOpen, Briefcase, Building2, CircleDollarSign, Coffee, CreditCard, Gift, Handshake, Home, Landmark, Laptop, Lightbulb, Megaphone, MonitorSmartphone, Package, PenLine, Receipt, Smartphone, Sprout, Train, TrendingDown, Wallet, type LucideIcon } from "lucide-react";

// 勘定科目ごとのアイコン（線のアイコンで統一）
const MAP: Record<string, LucideIcon> = {
  cash: Banknote, bank: Landmark, receivable: Receipt, equipment: Laptop, card: CreditCard, ownerOut: Home, ownerIn: Wallet, capital: Sprout,
  sales: CircleDollarSign, misc_income: Briefcase, travel: Train, comm: Smartphone, supplies: PenLine, meeting: Coffee, entertain: Gift,
  rent: Building2, utility: Lightbulb, books: BookOpen, fee: Receipt, ads: Megaphone, outsource: Handshake, software: MonitorSmartphone,
  depreciation: TrendingDown, taxes: Landmark, misc: Package,
};

export default function AccIcon({ id, size = 22, className = "" }: { id: string; size?: number; className?: string }) {
  const I = MAP[id] ?? Package;
  return <I size={size} strokeWidth={1.8} aria-hidden className={`shrink-0 text-ok ${className}`} />;
}
