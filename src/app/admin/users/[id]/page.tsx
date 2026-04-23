import { AdminUserDetailPage } from "@/components/shared/AdminUserDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserDetailPage userId={id} />;
}
