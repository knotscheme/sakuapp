import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Opening from "@/components/Opening";
import Craft from "@/components/Craft";
import StampExperience from "@/components/StampExperience";
import Pains from "@/components/Pains";
import Features from "@/components/Features";
import OneStop from "@/components/OneStop";
import Results from "@/components/Results";
import Plans from "@/components/Plans";
import CfSimulator from "@/components/CfSimulator";
import Models from "@/components/Models";
import Simulator from "@/components/Simulator";
import Options from "@/components/Options";
import FlowFaq from "@/components/FlowFaq";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingCta from "@/components/FloatingCta";
import ThemeColor from "@/components/ThemeColor";
import { LpProvider } from "@/components/LpContext";

// 構成：悩み → ひとつの窓口で解決 → 実績 → 理由 → 料金 → クラファン収支 → つくれるもの → 流れ・ルール・FAQ → 相談
export default function Page() {
  return (
    <LpProvider>
      <ThemeColor />
      <Opening />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Pains />
        <OneStop />
        <Results />
        <Features />
        <Plans />
        <CfSimulator />
        {/* つくれるもの：製造の裏側・刻印体験・ベースモデル・ロゴ加工・1個あたりの利益 */}
        <Craft />
        <StampExperience />
        <Models />
        <Options />
        <Simulator />
        <FlowFaq />
        <ContactForm />
      </main>
      <Footer />
      <FloatingCta />
      <Reveal />
    </LpProvider>
  );
}
