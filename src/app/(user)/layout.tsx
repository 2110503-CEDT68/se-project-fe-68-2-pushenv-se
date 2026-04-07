import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function UserLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar role="user" />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
