import { SpecPage } from "@/components/shared/SpecPage";

export default async function UserEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SpecPage
      title={`Event Detail: ${id}`}
      route="/events/[id]"
      summary="Async params example for Next.js 16 dynamic routes, ready for event detail + companies + registration."
      bullets={[
        "useEvent(id) for the event header",
        "useEventCompanies(id, { page, limit }) for company cards",
        "useRegisterEvent(id) mutation behind a confirm dialog",
      ]}
    />
  );
}
