import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers";
import React from "react";
import Navbar from "@/components/navbar/Navbar";

const inter = Inter({
  variable: "--font-inter",
    display: "swap",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
    weight: ["400", "700"],
    display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "A comprehensive retail inventory management system for my dev portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      return (
        <html lang="en">
          <body
            className={`${inter.variable} ${mono.variable} antialiased`}
          >
          <AuthProvider>
              <Navbar />
              <main className={`w-10/12 mx-auto`}>
                {children}
              </main>
          </AuthProvider>
          </body>
        </html>
      );
}
