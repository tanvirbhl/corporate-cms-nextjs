import Hero from "@/features/hero/Hero";
import { getHeroBanner } from "@/actions/hero.action";
import { HomeSlider } from "@/components/sections/home/HomeSlider";
import { TrustedClients } from "@/components/sections/home/TrustedClients";
import { NoticeBoard } from "@/components/sections/home/NoticeBoard";
import { AchievementsGallery } from "@/components/sections/home/AchievementsGallery";

export default async function HomePage() {
  const heroData = await getHeroBanner();

  return (
    <div>
      <HomeSlider />
      <Hero data={heroData} />
      <TrustedClients/>
      <AchievementsGallery/>
      <NoticeBoard/>
    </div>
  );
}