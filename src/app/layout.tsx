import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/lib/providers/ReduxProvider";
import { Footer, Navbar } from "@/components/shared";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travla BD - Explore Bangladesh",
  description: "Discover Cox's Bazar, Paharpur, Bandarban, and Sylhet with Travla BD",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
