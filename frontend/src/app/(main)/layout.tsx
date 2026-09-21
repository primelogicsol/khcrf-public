import { GlobalHeader } from "@/components/layout/GlobalHeader";
import Footer from "@/components/Footer";
import { headers } from "next/headers";
import { HeroOverlayProvider } from "@/components/layout/HeroOverlayProvider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Exclude site chrome for fullscreen reader routes
  const isChromeless = pathname.includes("/issues/") && pathname.endsWith("/read");

  if (isChromeless) {
    return <div className="flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <HeroOverlayProvider>
      <div className="flex flex-col min-h-screen">
        <GlobalHeader />
        {children}
        <Footer />
      </div>
    </HeroOverlayProvider>
  );
}
