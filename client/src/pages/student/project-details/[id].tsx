import { ProjectDetails as SharedProjectDetails } from "../../shared/ProjectDetails";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { useParams } from "wouter";

export default function StudentProjectDetails() {
  const { id } = useParams();
  
  return (
    <StudentLayout>
      <SharedProjectDetails id={id} />
    </StudentLayout>
  );
}
