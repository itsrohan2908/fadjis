import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ScrollVideoSection from "@/components/ScrollVideoSection";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import { ScrollSnapContainer, StackedSectionWrapper } from "@/components/StackingWrappers";

export default function Home() {
  return (
    <main className="w-full relative">
      <ScrollSnapContainer>
        
        {/* Layer 1 */}
        <StackedSectionWrapper zIndex={10}>
          <Hero />
        </StackedSectionWrapper>

        {/* Layer 2 */}
        <StackedSectionWrapper zIndex={20}>
          <Philosophy />
        </StackedSectionWrapper>

        {/* Scroll Video Frame Animation Layer */}
        <StackedSectionWrapper zIndex={25}>
          <ScrollVideoSection />
        </StackedSectionWrapper>

        {/* Layer 3 */}
        <StackedSectionWrapper zIndex={30}>
          <Projects />
        </StackedSectionWrapper>

        {/* Layer 4 */}
        <StackedSectionWrapper zIndex={40}>
          <Footer />
        </StackedSectionWrapper>

      </ScrollSnapContainer>
    </main>
  );
}