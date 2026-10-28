import type { Metadata } from "next";
import { Hind_Siliguri, Poppins } from "next/font/google";
import "./globals.css";

import ToastProvider from "../components/turf/ToastProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Bangla text (turf Bangla mode). Poppins has no Bengali glyphs, so the browser falls back to
// Hind Siliguri — made to pair with Poppins.
const bangla = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Turf Booking Management — Book Football Turf & Sports Ground",
  description:
    "Check live availability of our 7-a-side football turf, pick your slot and lock it with an advance payment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${bangla.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
