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
import ToggleDispatcher from "@modules/Settings/ToggleDispatcher";

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <p>404</p>;
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="space-y-2 linkify p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">
              {currentProfile?.dispatcher?.canUseRelay ? "Disable" : "Enable"}{" "}
              dispatcher
            </div>
          </div>
          <div className="pb-2">
            We suggest you to enable dispatcher so you dont need to sign all
            your transactions in {APP_NAME}.
          </div>
          <ToggleDispatcher />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default DispatcherSettings;
