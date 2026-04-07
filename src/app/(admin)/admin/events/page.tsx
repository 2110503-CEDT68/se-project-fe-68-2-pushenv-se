import { SpecPage } from "@/components/shared/SpecPage";

export default function AdminEventsPage() {
  return (
    <SpecPage
      title="Admin Events"
      route="/admin/events"
      summary="Event management table scaffold for create, edit, publish, and delete flows."
      bullets={[
        "Load via useAdminEvents({ page, limit, search, isPublished })",
        "Support inline publish toggle through usePublishEvent()",
        "Expose edit and delete actions for each event",
      ]}
    />
  );
}
