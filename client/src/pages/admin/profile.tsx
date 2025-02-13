import { Profile as SharedProfile } from "../shared/Profile";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export default function AdminProfile() {
  return (
    <AdminLayout>
      <SharedProfile />
    </AdminLayout>
  );
}
