import { SiteFooter, SiteHeader } from "@/src/components/layout";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
