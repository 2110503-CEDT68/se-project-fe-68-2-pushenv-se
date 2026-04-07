import { SpecPage } from "@/components/shared/SpecPage";

export default async function EditAdminJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SpecPage
      title={`Edit Job: ${id}`}
      route="/admin/jobs/[id]/edit"
      summary="Admin edit form scaffold for any job listing."
      bullets={["Prefill with useJob(id)", "Update with useUpdateJob()", "Expose attachment and close-state controls"]}
    />
  );
}
