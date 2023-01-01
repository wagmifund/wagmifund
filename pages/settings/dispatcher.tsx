import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { APP_NAME } from "@utils/constants";
import { FC, useEffect } from "react";
import { useAppStore } from "src/store/app";
import Sidebar from "@modules/Settings/Sidebar";
import ToggleDispatcher from "@modules/Settings/ToggleDispatcher";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import MetaTags from "@components/MetaTags";
import Analytics from "@utils/analytics";

const DispatcherSettings: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  useEffect(() =>  {
    Analytics.track('Dispatcher loaded')
  },[])
  if (!currentProfile) {
    return <NotFoundPage />;
  }

  return (
    <>
      <MetaTags title={`Dispatcher • Wagmi Fund`} />
      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight>
          <Card className="bg-wagmi-black border-wagmi-gray space-y-2 linkify p-5">
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
    </>
  );
};

export default DispatcherSettings;
