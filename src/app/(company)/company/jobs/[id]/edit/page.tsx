import { SpecPage } from "@/components/shared/SpecPage";

export default async function EditCompanyJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SpecPage
      title={`Edit Company Job: ${id}`}
      route="/company/jobs/[id]/edit"
      summary="Prefilled company job form for updating an existing listing."
      bullets={["Load initial data with useJob(id)", "Persist changes with useUpdateJob()", "Allow attachment replacement"]}
    />
  );
}
