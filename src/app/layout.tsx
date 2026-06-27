import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/dashboard.css";

export const metadata: Metadata = {
  title: "IV Hub · Sales Dashboard",
  description: "Consolidated sales & expense tracker for IV Wellness Lounge Dubai",
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
