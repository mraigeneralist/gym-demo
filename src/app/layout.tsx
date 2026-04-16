import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JERAI FITNESS | Premium Gym & Training",
  description:
    "Transform your body and mind at JERAI FITNESS. Premium gym facilities, expert trainers, and a supportive community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", geistSans.variable, geistMono.variable)}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
