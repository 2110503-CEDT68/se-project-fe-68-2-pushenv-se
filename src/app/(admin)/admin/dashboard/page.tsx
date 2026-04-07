import { SpecPage } from "@/components/shared/SpecPage";

export default function AdminDashboardPage() {
  return (
    <SpecPage
      title="Admin Dashboard"
      route="/admin/dashboard"
      summary="Overview scaffold for totals, recent accounts, and upcoming events."
      bullets={[
        "Intended to summarize accounts, companies, events, and jobs",
        "Fits the dedicated admin sidebar shell",
        "Shared tables and badges are already scaffolded under components/shared",
      ]}
    />
  );
}
