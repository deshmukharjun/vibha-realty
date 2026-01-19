import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyHeader, StickyButtonsDesktop } from "@/components/layout/StickyButtons";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

export const metadata: Metadata = {
  title: "Vibha Realties",
  description: "Expert property consultant in Pune. Find your perfect property - Residential, Investment, and Commercial opportunities.",
  keywords: "property consultant Pune, real estate Pune, residential properties, investment properties",
  authors: [{ name: "Charushila Bhalerao" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vibharealty.com",
    title: "Vibha Realties - Property Consultant",
    description: "Expert property consultant helping you find your perfect property in Pune",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`} suppressHydrationWarning>
        <Header whatsappNumber={WHATSAPP_NUMBER} />
        <main className="pb-24 md:pb-0">
          {children}
        </main>
        <StickyHeader whatsappNumber={WHATSAPP_NUMBER} />
        <StickyButtonsDesktop whatsappNumber={WHATSAPP_NUMBER} />
        <Footer />
      </body>
    </html>
  );
}
