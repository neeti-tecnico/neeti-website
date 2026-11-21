import SpaceNavigation from "@/components/space-navigation";
import SpaceHero from "@/components/space-hero";
import DescentJourney from "@/components/descent-journey";
import WhatWeDo from "@/components/what-we-do";
import NewsSection from "@/components/news-section";
import JoinBand from "@/components/join-band";
import Footer from "@/components/footer";
import ShootingStars from "@/components/shooting-stars";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SpaceNavigation />
      <SpaceHero />
      <DescentJourney />
      <ShootingStars />
      <WhatWeDo />
      <NewsSection />
      <JoinBand />
      <Footer />
    </div>
  );
}
