import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Opening from "@/components/Opening";
import Statement from "@/components/Statement";
import Craft from "@/components/Craft";
import StampExperience from "@/components/StampExperience";
import ActBreak from "@/components/ActBreak";
import Pains from "@/components/Pains";
import Features from "@/components/Features";
import Models from "@/components/Models";
import Simulator from "@/components/Simulator";
import Options from "@/components/Options";
import FlowFaq from "@/components/FlowFaq";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingCta from "@/components/FloatingCta";
import { LpProvider } from "@/components/LpContext";

// 前半は「ブランドの物語」、後半は「はじめ方のご案内」の2幕構成
export default function Page() {
  return (
    <LpProvider>
      <Opening />
      <ScrollProgress />
      <Header />
      <main>
        {/* 第1幕：物語 */}
        <Hero />
        <Statement />
        <Craft />
        <StampExperience />
        {/* 第2幕：ご案内 */}
        <ActBreak />
        <Pains />
        <Features />
        <Models />
        <Simulator />
        <Options />
        <FlowFaq />
        <ContactForm />
      </main>
      <Footer />
      <FloatingCta />
      <Reveal />
    </LpProvider>
  );
}
