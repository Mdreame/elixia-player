import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elixia Player - AI-Powered Music Player",
  description: "A modern music player featuring AI-powered lyrics analysis and language learning tools. Unified access to music from Netease, Tencent, Kugou, and more.",
  keywords: ["music player", "lyrics", "AI analysis", "language learning", "Netease", "Tencent", "Kugou"],
  authors: [{ name: "Elixia Player" }],
  openGraph: {
    title: "Elixia Player - AI-Powered Music Player",
    description: "A modern music player featuring AI-powered lyrics analysis and language learning tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
