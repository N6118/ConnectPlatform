import { Clubs as SharedClubs } from "../shared/Clubs";
import { StudentLayout } from "@/components/layouts/StudentLayout";

export default function StudentClubs() {
  return (
    <StudentLayout>
      <SharedClubs />
    </StudentLayout>
  );
}
