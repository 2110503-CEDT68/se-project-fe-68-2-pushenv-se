import { SpecPage } from "@/components/shared/SpecPage";

export default function CreateAdminEventPage() {
  return (
    <SpecPage
      title="Create Event"
      route="/admin/events/new"
      summary="Admin event form scaffold with date validation and optional banner upload."
      bullets={[
        "Submit multipart/form-data via useCreateEvent()",
        "Navigate to /admin/events/[id]/edit after creation",
        "Prepare company assignment in the follow-up screen",
      ]}
    />
  );
}
