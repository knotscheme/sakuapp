import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Opening from "@/components/Opening";
import Statement from "@/components/Statement";
import Pains from "@/components/Pains";
import Features from "@/components/Features";
import Craft from "@/components/Craft";
import Models from "@/components/Models";
import Simulator from "@/components/Simulator";
import Options from "@/components/Options";
import FlowFaq from "@/components/FlowFaq";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import { LpProvider } from "@/components/LpContext";

export default function Page() {
  return (
    <LpProvider>
      <Opening />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Pains />
        <Features />
        <Craft />
        <Models />
        <Simulator />
        <Options />
        <FlowFaq />
        <ContactForm />
      </main>
      <Footer />
      <Reveal />
    </LpProvider>
  );
}
