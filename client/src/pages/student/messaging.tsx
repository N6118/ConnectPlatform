import { MessagingPage as SharedMessaging } from "../shared/MessagingPage";
import { StudentLayout } from "@/components/layouts/StudentLayout";

export default function StudentMessaging() {
  return (
    <StudentLayout>
      <SharedMessaging />
    </StudentLayout>
  );
}
