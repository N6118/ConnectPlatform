import { Projects as SharedProjects } from "../shared/Projects";
import { StudentLayout } from "@/components/layouts/StudentLayout";

export default function StudentProjects() {
  return (
    <StudentLayout>
      <SharedProjects />
    </StudentLayout>
  );
}
