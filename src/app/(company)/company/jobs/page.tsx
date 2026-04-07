import { SpecPage } from "@/components/shared/SpecPage";

export default function CompanyJobsPage() {
  return (
    <SpecPage
      title="Company Job Listings"
      route="/company/jobs"
      summary="Management table for company-owned job listings and lifecycle actions."
      bullets={[
        "Search and paginate with useCompanyJobs({ page, limit, search })",
        "Support edit, close, and delete row actions",
        "Link to /company/jobs/new for new listings",
      ]}
    />
  );
}
