import { MySpace as SharedMySpace } from "../shared/MySpace";
import { StudentLayout } from "@/components/layouts/StudentLayout";

export default function StudentMySpace() {
  return (
    <StudentLayout>
      <SharedMySpace />
    </StudentLayout>
  );
}
