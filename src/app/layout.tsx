import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stoxian",
  description: "A responsive stock portfolio dashboard providing real-time market insights",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="no-scrollbar">
      <head>
        <link rel="icon" href="/assets/LogoBrand.png" type="image/png" />
      </head>
      <body className={`${inter.className} bg-black text-gray-100 no-scrollbar`}>
        {children}
      </body>
    </html>
  );
}
