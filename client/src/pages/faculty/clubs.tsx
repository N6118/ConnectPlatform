import { Clubs as SharedClubs } from "../shared/Clubs";
import { FacultyLayout } from "@/components/layouts/FacultyLayout";

export default function FacultyClubs() {
  return (
    <FacultyLayout>
      <SharedClubs />
    </FacultyLayout>
  );
}
