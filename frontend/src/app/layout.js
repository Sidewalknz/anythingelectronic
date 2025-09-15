import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Anything Electronic",
  description: "Sales, service & repairs in Nelson, NZ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
