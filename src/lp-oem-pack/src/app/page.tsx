import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Opening from "@/components/Opening";
import StampExperience from "@/components/StampExperience";
import Features from "@/components/Features";
import Story from "@/components/Story";
import Compare from "@/components/Compare";
import Band from "@/components/Band";
import Maker from "@/components/Maker";
import PhotoStrip from "@/components/PhotoStrip";
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

// 構成：合言葉「「アイデア」を、「売れた」に。」を軸に、物語・違い・数字で記憶に残す
export default function Page() {
  return (
    <LpProvider>
      <ThemeColor />
      <Opening />
      <ScrollProgress />
      <Header />
      <main>
        {/* 合言葉「「アイデア」を、「売れた」に。」と1億円 → 売れるまでの物語 → 違い → 20年 → 理由・実績 → 料金 → 収支 → 50個から → つくり手 → つくれるもの → 流れ・FAQ → 相談 */}
        <Hero />
        <Story />
        <Compare />
        <PhotoStrip />
        <Band big="20" unit="年" label="革製品をつくり続けてきた時間。革の選び方も、縫い方も、売れる見せ方も、この中で身につけてきました。" img="/images/studio-brown.webp" />
        <Features />
        <Results />
        <Plans />
        <CfSimulator />
        <Band big="50" unit="個から" label="最初から大量に作らない。支援が集まった分だけ、追加で生産すれば大丈夫です。" img="/images/work-pouches.webp" />
        <Maker />
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
