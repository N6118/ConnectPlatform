import { Profile as SharedProfile } from "../shared/Profile";
import { StudentLayout } from "@/components/layouts/StudentLayout";

export default function StudentProfile() {
  return (
    <StudentLayout>
      <SharedProfile />
    </StudentLayout>
  );
}
