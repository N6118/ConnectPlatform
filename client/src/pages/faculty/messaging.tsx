import { MessagingPage as SharedMessaging } from "../shared/MessagingPage";
import { FacultyLayout } from "@/components/layouts/FacultyLayout";

export default function FacultyMessaging() {
  return (
    <FacultyLayout>
      <SharedMessaging />
    </FacultyLayout>
  );
}
