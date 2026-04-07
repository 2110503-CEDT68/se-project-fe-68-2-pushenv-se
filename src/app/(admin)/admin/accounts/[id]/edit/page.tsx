import { SpecPage } from "@/components/shared/SpecPage";

export default async function EditAdminAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SpecPage
      title={`Edit Account: ${id}`}
      route="/admin/accounts/[id]/edit"
      summary="Admin edit form scaffold for any account."
      bullets={[
        "All fields optional, including password reset",
        "Submit via useUpdateAccount()",
        "Keep current password if the field is blank",
      ]}
    />
  );
}
