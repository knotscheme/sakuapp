import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCta from "@/components/FloatingCta";
import ThemeColor from "@/components/ThemeColor";
import ProductList from "@/components/ProductList";

export const metadata: Metadata = {
  title: "製品一覧｜CRAFT OEM（デモ版）",
  description: "ロゴ入れOEMで選べるベースモデルの一覧です。※デモ版です。",
  robots: { index: false },
};

export default function Products() {
  return (
    <>
      <ThemeColor />
      <Header />
      <main className="bg-white pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="fade-up mb-14 md:mb-20">
            <p className="font-display text-[12px] tracking-[0.4em] text-mute">PRODUCTS</p>
            <h1 className="mt-4 text-[30px] font-medium tracking-[0.06em] md:text-[40px]">製品一覧</h1>
            <p className="mt-5 max-w-xl text-[14px] leading-loose text-mute">
              <span className="inline-block">定番の型に、</span><span className="inline-block">あなたのロゴを入れてお届けします。</span>
            </p>
          </div>
          <ProductList />
        </div>
      </main>
      <Footer />
      <FloatingCta href="/sakuapp/works/lp-oem-pack/#contact" />
    </>
  );
}
