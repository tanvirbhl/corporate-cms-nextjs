import Hero from "@/features/hero/Hero";
import { getHeroBanner } from "@/actions/hero.action";
import { HomeSlider } from "@/components/sections/home/HomeSlider";
import { TrustedClients } from "@/components/sections/home/TrustedClients";

export default async function HomePage() {
  const heroData = await getHeroBanner();

  return (
    <div>
      <HomeSlider />
      <Hero data={heroData} />
      <TrustedClients/>
    </div>
  );
}