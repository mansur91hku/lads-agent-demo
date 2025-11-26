import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course Analytics Demo",
  description: "A demo of a Course Analytics platform.",
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
