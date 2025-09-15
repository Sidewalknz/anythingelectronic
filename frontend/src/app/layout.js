import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Anything Electronic",
  description: "Sales, service & repairs in Nelson, NZ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
