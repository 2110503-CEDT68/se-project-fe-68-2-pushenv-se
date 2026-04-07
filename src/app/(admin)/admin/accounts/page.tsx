import { SpecPage } from "@/components/shared/SpecPage";

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const { page, search, role } = await searchParams;

  return (
    <SpecPage
      title="Admin Accounts"
      route="/admin/accounts"
      summary={`Admin account table scaffold with Next.js 16 async searchParams support (page=${page ?? "1"}, search=${search ?? "-"}, role=${role ?? "all"}).`}
      bullets={[
        "Query via useAccounts({ page, limit, search, role })",
        "Create and delete actions are part of the shared admin flow",
        "Use status badges for role display",
      ]}
    />
  );
}
