import AboutHero from "@/components/about/AboutHero";
import WhoWeAre from "@/components/about/WhoWeAre";
import AboutStats from "@/components/about/AboutStats";
import MissionVisionValues from "@/components/about/MissionVisionValues";
import FounderMessage from "@/components/about/FounderMessage";
import Timeline from "@/components/about/Timeline";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import OfficeSection from "@/components/about/OfficeSection";
import AboutCTA from "@/components/about/AboutCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Destates",
  description: "Learn about Destates — pioneering fractional real estate investment in India through transparency, technology, and trust.",
};

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <AboutStats />
      <MissionVisionValues />
      <FounderMessage />
      <Timeline />
      <LeadershipTeam />
      <OfficeSection />
      <AboutCTA />
    </div>
  );
}
