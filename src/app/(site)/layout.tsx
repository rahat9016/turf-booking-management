import {
  MobileBottomNav,
  SiteFooter,
  SiteHeader,
} from "@/src/components/layout";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Phones: room at the bottom so the tab bar never covers the footer.
    <div className="relative pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <SiteHeader />
      {children}
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
