import { Profile as SharedProfile } from "../shared/Profile";
import { FacultyLayout } from "@/components/layouts/FacultyLayout";

export default function FacultyProfile() {
  return (
    <FacultyLayout>
      <SharedProfile />
    </FacultyLayout>
  );
}
