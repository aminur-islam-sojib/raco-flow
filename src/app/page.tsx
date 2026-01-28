import { HeroSection } from "@/components/site/Hero/HeroSection";
import { ThemeToggle } from "@/components/site/Shared/ThemeToggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <HeroSection />
    </>
  );
}
