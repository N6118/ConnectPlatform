import { MyProfile } from "@/components/MyProfile";
import { EditProfileModal } from "@/components/EditProfileModal";
import { UserSettings } from "@/components/UserSettings";
import { SkillDevelopment } from "@/components/SkillDevelopment";

export default function Profile() {
  return (
    <div className="space-y-6">
      <MyProfile />
      <div className="grid gap-6 md:grid-cols-2">
        <SkillDevelopment />
        <UserSettings />
      </div>
    </div>
  );
}
