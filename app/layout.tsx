import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMAZING WALLET",
  description: "Commodity tokenization product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
