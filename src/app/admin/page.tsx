import { requireAdmin } from "@/lib/admin";
import { getAdminOverview } from "@/lib/adminData";
import AdminView from "@/components/admin/AdminView";

// Always render fresh — admin data must never be cached.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const overview = await getAdminOverview();
  return <AdminView overview={overview} adminEmail={admin.email ?? ""} />;
}
