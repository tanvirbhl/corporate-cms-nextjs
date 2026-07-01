import AboutSection from "@/components/website/AboutSection";
import { getAboutData } from "@/actions/about.action";

export default async function AboutPage() {
  const aboutData = await getAboutData();
  
  return (
    <main>
      <AboutSection data={aboutData} />
    </main>
  );
}