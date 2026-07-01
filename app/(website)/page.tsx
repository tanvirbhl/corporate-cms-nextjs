import Hero from "@/features/hero/Hero";
import { getHeroBanner } from "@/actions/hero.action";

export default async function HomePage() {
  const heroData = await getHeroBanner();

  return (
    <div>
      <Hero data={heroData} />
    </div>
  );
}