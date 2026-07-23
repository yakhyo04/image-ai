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
import { createClient } from "@/lib/supabase/server";

export default async function Landing() {
  // When the visitor is already signed in, the nav shows a "Dashboard" link
  // instead of Log in / Get Started.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t-1)" }}>
      <Nav authed={!!user} />
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
