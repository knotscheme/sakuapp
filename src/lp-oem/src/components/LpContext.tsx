"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PRICE_DEFAULT, type Lot, type ModelId } from "@/lib/models";

// ベースモデル一覧・シミュレーター・問い合わせフォームの間で選択内容を受け渡す
type Prefill = { model: ModelId; lot: Lot; price: number; stamp: number; note?: string } | null;

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
