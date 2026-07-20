import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Gallery from "@/components/landing/Gallery";
import TryItLive from "@/components/landing/TryItLive";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import Faq from "@/components/landing/Faq";
import CtaBand from "@/components/landing/CtaBand";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t-1)" }}>
      <Nav />
      <main>
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <Gallery />
        <TryItLive />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
