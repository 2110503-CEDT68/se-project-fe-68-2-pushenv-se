import { SpecPage } from "@/components/shared/SpecPage";

export default function UserEventsPage() {
  return (
    <SpecPage
      title="Published Events"
      route="/events"
      summary="User-facing event browser with search, pagination, and event cards."
      bullets={[
        "Backed by useEvents({ page, limit, search })",
        "Sync URL query params with useSearchParams",
        "Render empty state when no published events are available",
      ]}
    />
  );
}
