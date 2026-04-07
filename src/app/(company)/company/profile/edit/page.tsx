import { SpecPage } from "@/components/shared/SpecPage";

export default function EditCompanyProfilePage() {
  return (
    <SpecPage
      title="Edit Company Profile"
      route="/company/profile/edit"
      summary="Multipart company profile form scaffold with logo upload and website validation."
      bullets={[
        "Update name, phone, description, website, and logo",
        "Wire to useUpdateCompanyProfile()",
        "Return to /company/profile on success",
      ]}
    />
  );
}
