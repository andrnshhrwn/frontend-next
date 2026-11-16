import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/components/providers/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAM Tirta Kamuning - Panel Manajemen Pergantian Water Meter",
  description:
    "Sistem Manajemen Inventori, Monitoring & Operasional Pergantian Water Meter PAM Tirta Kamuning Kabupaten Kuningan",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      className={`${jakarta.variable} font-sans h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-pdam-bg text-base-content antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}