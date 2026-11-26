"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ALL_MODELS, PRICE_DEFAULT, type Lot, type ModelId } from "@/lib/models";
import { loadCatalog } from "./cms/catalog";

// ベースモデル一覧・シミュレーター・問い合わせフォームの間で選択内容を受け渡す
type Prefill = { model: ModelId; lot: Lot; price: number; stamp: number; note?: string; keepModel?: boolean } | null;

type Ctx = {
  model: ModelId;
  lot: Lot;
  price: number;
  setModel: (m: ModelId) => void;
  setLot: (l: Lot) => void;
  setPrice: (p: number) => void;
  prefill: Prefill;
  chooseModelAndScroll: (m: ModelId) => void;
  sendToContact: () => void;
  sendBrandToContact: (note: string) => void;
};

const LpCtx = createContext<Ctx | null>(null);

export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function LpProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<ModelId>("long");
  const [lot, setLot] = useState<Lot>(50);
  const [price, setPrice] = useState(PRICE_DEFAULT);
  const [prefill, setPrefill] = useState<Prefill>(null);

  // 製品一覧ページから「?model=…#simulator」「?model=…#contact」で来たときは、そのモデルを選んだ状態にする
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const id = q.get("model");
    const color = q.get("color"); // 製品一覧で選んだカラー
    const withColor = (name: string) => (color ? `【ご希望モデル】${name}（カラー：${color}）` : `【ご希望モデル】${name}`);
    const m = ALL_MODELS.find((x) => x.id === id);
    if (!m) {
      // 管理画面で追加した商品：名前だけ相談内容に入れる
      const extra = id ? loadCatalog().products.find((x) => x.id === id) : undefined;
      if (extra && location.hash === "#contact") {
        /* eslint-disable-next-line react-hooks/set-state-in-effect -- URLの指定を最初に反映するため */
        setPrefill({ model: "long", lot: 50, price: PRICE_DEFAULT, stamp: Date.now(), note: withColor(extra.name) });
        setTimeout(() => scrollToId("contact"), 500);
      }
      return;
    }
    /* eslint-disable react-hooks/set-state-in-effect -- URLの指定を最初に反映するため */
    setModel(m.id);
    if (location.hash === "#contact") setPrefill({ model: m.id, lot: 50, price: PRICE_DEFAULT, stamp: Date.now(), note: withColor(m.name), keepModel: true });
    /* eslint-enable react-hooks/set-state-in-effect */
    setTimeout(() => {
      if (location.hash === "#contact") {
        // 選んだ製品が画面の真ん中に来るように
        const row = document.querySelector("input[name=cf-model]:checked")?.closest("label");
        if (row) { row.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      }
      if (location.hash) scrollToId(location.hash.slice(1));
    }, 500);
  }, []);

  const chooseModelAndScroll = useCallback((m: ModelId) => {
    setModel(m);
    scrollToId("simulator");
  }, []);

  const sendToContact = useCallback(() => {
    setPrefill({ model, lot, price, stamp: Date.now() });
    scrollToId("contact");
  }, [model, lot, price]);

  const sendBrandToContact = useCallback((note: string) => {
    setPrefill({ model, lot, price, stamp: Date.now(), note });
    scrollToId("contact");
  }, [model, lot, price]);

  return (
    <LpCtx.Provider value={{ model, lot, price, setModel, setLot, setPrice, prefill, chooseModelAndScroll, sendToContact, sendBrandToContact }}>{children}</LpCtx.Provider>
  );
}

export function useLp() {
  const v = useContext(LpCtx);
  if (!v) throw new Error("LpProvider の中で使ってください");
  return v;
}
