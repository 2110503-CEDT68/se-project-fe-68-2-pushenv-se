import { SpecPage } from "@/components/shared/SpecPage";

export default function CreateAdminAccountPage() {
  return (
    <SpecPage
      title="Create Account"
      route="/admin/accounts/new"
      summary="Account creation form scaffold for admin users."
      bullets={[
        "Validate required name, email, password, and role",
        "Submit through useCreateAccount()",
        "Return to /admin/accounts after success",
      ]}
    />
  );
}
