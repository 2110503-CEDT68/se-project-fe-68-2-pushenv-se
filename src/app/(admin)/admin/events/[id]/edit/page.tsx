import { SpecPage } from "@/components/shared/SpecPage";

export default async function EditAdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SpecPage
      title={`Edit Event: ${id}`}
      route="/admin/events/[id]/edit"
      summary="Admin event edit scaffold for details plus company assignment."
      bullets={[
        "Prefill using useEvent(id)",
        "Persist changes with useUpdateEvent()",
        "Support companyIds replacement for event-company links",
      ]}
    />
  );
}
