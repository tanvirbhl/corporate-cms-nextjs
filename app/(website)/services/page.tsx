import ServicesSection from "@/components/website/ServicesSection";
import { getServices } from "@/actions/services.action";

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main className="pt-20">
      <ServicesSection services={services} />
    </main>
  );
}