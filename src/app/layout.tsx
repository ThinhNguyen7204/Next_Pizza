import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "La Pizzaia - Artisan Pizzeria & Italian Fine Dining",
    template: "%s | La Pizzaia",
  },
  description: "Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples tại La Pizzaia.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "La Pizzaia - Artisan Pizzeria & Italian Fine Dining",
    description: "Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples tại La Pizzaia.",
    url: "/",
    siteName: "La Pizzaia",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Pizzaia - Artisan Pizzeria & Italian Fine Dining",
    description: "Trải nghiệm tinh hoa ẩm thực Ý với những chiếc bánh Pizza nướng củi thủ công chuẩn vị truyền thống Naples tại La Pizzaia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            {children}
          </AppProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
