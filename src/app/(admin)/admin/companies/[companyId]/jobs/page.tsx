import { SpecPage } from "@/components/shared/SpecPage";

export default async function AdminCompanyJobsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  return (
    <SpecPage
      title={`Company Jobs: ${companyId}`}
      route="/admin/companies/[companyId]/jobs"
      summary="Admin job table scaffold for listings under a single company."
      bullets={[
        "Load via useAdminJobs({ companyId, page, limit, isClosed })",
        "Allow add, edit, close, and delete flows",
        "Use filter tabs for open versus closed listings",
      ]}
    />
  );
}
