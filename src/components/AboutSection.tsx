import { useAppStore } from "@store/app";
import { useRouter } from "next/router";
import Editor from "./Editor";
import { useProfileUIStore } from "@store/profile";
const AboutSection = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileUIData = useProfileUIStore((state) => state.profileUIData);

  const {
    query: { username },
  } = useRouter();
  return (
    profileUIData?.about && (
      <Editor isEditable={username === currentProfile?.handle} />
    )
  );
};

export default AboutSection;
