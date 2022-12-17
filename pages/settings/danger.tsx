import type { FC } from "react";
import { useAppStore } from "src/store/app";
import Delete from "@modules/Settings/Delete";

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <p>404</p>;
  }

  return <Delete />;
};

export default DispatcherSettings;
