import type { FC } from "react";
import { useAppStore } from "src/store/app";
import Delete from "@modules/Settings/Delete";
import { NotFoundPage } from "@modules/Error/NotFoundPage";

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  if (!currentProfile) {
    return <NotFoundPage />;
  }

  return <Delete />;
};

export default DispatcherSettings;
