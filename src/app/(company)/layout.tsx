import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function CompanyLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px_1fr]">
      <Sidebar
        role="company"
        items={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/company/profile", label: "Profile" },
          { href: "/company/events", label: "Events" },
          { href: "/company/jobs", label: "Jobs" },
        ]}
      />
      <main>{children}</main>
    </div>
  );
}
