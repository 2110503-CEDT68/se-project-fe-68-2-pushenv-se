import { SpecPage } from "@/components/shared/SpecPage";

export default function CompanyProfilePage() {
  return (
    <SpecPage
      title="Company Profile"
      route="/company/profile"
      summary="View page for logo, contact fields, website, and description."
      bullets={[
        "Backed by useCompanyProfile()",
        "Expose an Edit Profile action",
        "Use status and empty-state helpers from shared components",
      ]}
    />
  );
}
