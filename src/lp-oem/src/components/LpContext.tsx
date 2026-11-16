"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ALL_MODELS, PRICE_DEFAULT, type Lot, type ModelId } from "@/lib/models";

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
    const id = new URLSearchParams(location.search).get("model");
    const m = ALL_MODELS.find((x) => x.id === id);
    if (!m) return;
    /* eslint-disable react-hooks/set-state-in-effect -- URLの指定を最初に反映するため */
    setModel(m.id);
    if (location.hash === "#contact") setPrefill({ model: m.id, lot: 50, price: PRICE_DEFAULT, stamp: Date.now(), note: `【ご希望モデル】${m.name}`, keepModel: true });
    /* eslint-enable react-hooks/set-state-in-effect */
    setTimeout(() => location.hash && scrollToId(location.hash.slice(1)), 400);
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
