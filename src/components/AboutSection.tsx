import { useAppStore } from "@store/app";
import { useRouter } from "next/router";
import Editor from "./Editor";
const AboutSection = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { username },
  } = useRouter();
  return <Editor isEditable={username === currentProfile?.handle} />;
};

export default AboutSection;
