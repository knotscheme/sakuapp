import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
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
import { LpProvider } from "@/components/LpContext";

export default function Page() {
  return (
    <LpProvider>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Pains />
        <Features />
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
