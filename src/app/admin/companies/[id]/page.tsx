import { AdminCompanyDetailPage } from "@/components/shared/AdminCompanyDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminCompanyDetailPage companyId={id} />;
}
