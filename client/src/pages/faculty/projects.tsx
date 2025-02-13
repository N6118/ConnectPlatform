import { Projects as SharedProjects } from "../shared/Projects";
import { FacultyLayout } from "@/components/layouts/FacultyLayout";

export default function FacultyProjects() {
  return (
    <FacultyLayout>
      <SharedProjects />
    </FacultyLayout>
  );
}
