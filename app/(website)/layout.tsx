import { Suspense } from "react";
import Navbar from "@/features/navbar/Navbar";
import NavbarSkeleton from "@/components/ui/NavbarSkeleton";
import { getActiveNavbarLinks } from "@/actions/navbar.action";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbarLinks = await getActiveNavbarLinks();

  return (
    <>
      {/* Suspense ensures the skeleton shows if the DB fetch is slow */}
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar links={navbarLinks} />
      </Suspense>
      <main className="flex-grow pt-20">
        {children}
      </main>
    </>
  );
}