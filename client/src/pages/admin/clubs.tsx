import { Clubs as SharedClubs } from "../shared/Clubs";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export default function AdminClubs() {
  return (
    <AdminLayout>
      <SharedClubs />
    </AdminLayout>
  );
}
