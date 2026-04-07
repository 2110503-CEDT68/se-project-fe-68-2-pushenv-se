import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px_1fr]">
      <Sidebar
        role="admin"
        items={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/accounts", label: "Accounts" },
          { href: "/admin/events", label: "Events" },
          { href: "/admin/companies/demo/jobs", label: "Companies" },
        ]}
      />
      <main>{children}</main>
    </div>
  );
}
