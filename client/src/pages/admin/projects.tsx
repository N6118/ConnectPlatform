import { Projects as SharedProjects } from "../shared/Projects";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export default function AdminProjects() {
  return (
    <AdminLayout>
      <SharedProjects />
    </AdminLayout>
  );
}
