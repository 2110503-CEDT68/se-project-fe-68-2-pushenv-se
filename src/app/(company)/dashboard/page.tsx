import { SpecPage } from "@/components/shared/SpecPage";

export default function CompanyDashboardPage() {
  return (
    <SpecPage
      title="Company Dashboard"
      route="/dashboard"
      summary="Company overview page for profile details, recent jobs, and upcoming events."
      bullets={[
        "Use useCompanyProfile(), useCompanyJobs({ limit: 5 }), and useCompanyEvents()",
        "Render stats for active jobs and upcoming events",
        "Fit into the role-specific sidebar shell",
      ]}
    />
  );
}
