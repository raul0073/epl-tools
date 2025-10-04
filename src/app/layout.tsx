import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";
import "./globals.css";
import "./loaderStyle.scss"
import { Providers } from "@/components/SessionProvider";
import { Toaster } from "sonner";


const merriweather = Merriweather_Sans({
  variable: "--merry",
  subsets: ["latin"],
});


export const metadata: Metadata = {
 title: "EPL Predictions 25/26 | Poker Israel",
  description: "Make accurate EPL predictions, track your fantasy league, and see top players' stats for 2025/26.",
  keywords: ["EPL", "predictions", "fantasy football", "soccer stats", "Premier League"],
  openGraph: {
    title: "EPL Predictions Dashboard 2025/26 | Poker Israel",
    description: "Make accurate EPL predictions, track your fantasy league, and see top players' stats for 2025/26.",
    url: "https://yourapp.com",
    siteName: "Poker Israel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EPL Predictions Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EPL Predictions Dashboard 2025/26",
    description: "Track EPL predictions and stats with Poker Israel.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.className}  antialiased`}
      >
         <Providers>
        <Toaster richColors />
        {children}
         </Providers>
      </body>
    </html>
  );
}
