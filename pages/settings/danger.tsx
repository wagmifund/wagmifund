import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { APP_NAME } from "@utils/constants";
import type { FC } from "react";
import { useAppStore } from "src/store/app";
import Sidebar from "@modules/Settings/Sidebar";
import Delete from "@modules/Settings/Delete";

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <p>404</p>;
  }

  return <Delete />;
};

export default DispatcherSettings;
