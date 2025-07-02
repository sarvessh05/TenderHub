import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Toaster } from "sonner";

// Load Geist Sans and Mono fonts with CSS variable support
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata for the app
export const metadata: Metadata = {
  title: "TenderHub | B2B Tender Platform",
  description:
    "Connect businesses with tender opportunities and manage proposals effortlessly.",
};

// Root layout wrapping the entire app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden`}
      >
        {/* Toast notifications using Sonner */}
        <Toaster richColors position="top-center" />

        {/* Sidebar navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}