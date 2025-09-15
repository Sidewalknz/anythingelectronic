import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import SectionBreak from "@/components/SectionBreak"
import Capabilities from "@/components/Capabilities";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <SectionBreak height={220} waveHeight={60} topColor="#f8fafc" bottomColor="#fff" />
      <Capabilities />
      <SectionBreak height={220} waveHeight={60} topColor="#fff" bottomColor="#f6f9ff" />
      <ContactCTA />
    </>
  );
}
