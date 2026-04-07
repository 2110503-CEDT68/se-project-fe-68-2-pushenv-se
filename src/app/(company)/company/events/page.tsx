import { SpecPage } from "@/components/shared/SpecPage";

export default function CompanyEventsPage() {
  return (
    <SpecPage
      title="Company Events"
      route="/company/events"
      summary="Paginated list of events joined by the authenticated company."
      bullets={[
        "Load via useCompanyEvents({ page, limit })",
        "Render empty state when the company has no assigned events",
        "Show published status alongside location and date range",
      ]}
    />
  );
}
