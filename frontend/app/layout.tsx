import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Appbar } from "./components/Appbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoEx - Professional Cryptocurrency Exchange",
  description: "Trade cryptocurrencies with professional-grade tools, real-time data, and lightning-fast execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Appbar/>
        {children}
      </body>
    </html>
  );
}
