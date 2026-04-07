import { SpecPage } from "@/components/shared/SpecPage";

export default function CreateCompanyJobPage() {
  return (
    <SpecPage
      title="Create Job Listing"
      route="/company/jobs/new"
      summary="Job creation form scaffold for company users, including optional file attachment support."
      bullets={[
        "Submit via useCreateJob()",
        "Validate title, type, location, and description",
        "Redirect to /company/jobs after success",
      ]}
    />
  );
}
