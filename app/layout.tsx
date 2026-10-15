import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PDAM Tirta - Panel Admin Manajemen Water Meter",
  description: "Sistem Manajemen & Monitoring Penggantian Water Meter PDAM Tirta",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-pdam-bg text-base-content antialiased">
        {children}
      </body>
    </html>
  );
}
