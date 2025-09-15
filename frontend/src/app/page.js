import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import SectionBreak from "@/components/SectionBreak"

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <SectionBreak height={220} waveHeight={60} topColor="#f8fafc" bottomColor="#fff" />

    </>
  );
}
