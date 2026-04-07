import { SpecPage } from "@/components/shared/SpecPage";

export default function EditUserProfilePage() {
  return (
    <SpecPage
      title="Edit User Profile"
      route="/profile/edit"
      summary="Profile form scaffold with file upload support for avatar replacement."
      bullets={[
        "Prefill from useMe()",
        "Submit multipart/form-data via useUpdateProfile",
        "Navigate back to /profile after success",
      ]}
    />
  );
}
