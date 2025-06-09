import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alpha Vantage Dashboard",
  description: "A simple dashboard for Alpha Vantage stock data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="bg-stone-100 grid gap-4 p-4 grid-cols-[220px_1fr] h-screen overflow-hidden">
          <Sidebar />
          <div className="max-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-scroll">{children}</div>
        </main>
      </body>
    </html>
  );
}
