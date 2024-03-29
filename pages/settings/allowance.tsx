import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { DEFAULT_COLLECT_TOKEN } from "@utils/constants";
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
} from "generated";
import type { NextPage } from "next";
import { useAppStore } from "src/store/app";

import Sidebar from "@modules/Settings/Sidebar";
import Modules from "@modules/Settings/Modules";
import PageLoader from "@components/PageLoader";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import { ServerError } from "@modules/Error/ServerError";
import MetaTags from "@components/MetaTags";
import { useEffect } from "react";
import Analytics from "@utils/analytics";

const getAllowancePayload = (currency: string) => {
  const {
    LimitedFeeCollectModule,
    FeeCollectModule,
    LimitedTimedFeeCollectModule,
    TimedFeeCollectModule,
    FreeCollectModule,
    RevertCollectModule,
  } = CollectModules;
  return {
    currencies: [currency],
    collectModules: [
      LimitedFeeCollectModule,
      FeeCollectModule,
      LimitedTimedFeeCollectModule,
      TimedFeeCollectModule,
      FreeCollectModule,
      RevertCollectModule,
    ],
    followModules: [FollowModules.FeeFollowModule],
    referenceModules: [ReferenceModules.FollowerOnlyReferenceModule],
  };
};

const AllowanceSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { loading, error } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: getAllowancePayload(DEFAULT_COLLECT_TOKEN),
    },
    skip: !currentProfile?.id,
  });

  useEffect(() => {
    Analytics.track("allowance loaded");
  }, []);

  if (error) {
    return <ServerError />;
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!currentProfile) {
    return <NotFoundPage />;
  }

  return (
    <>
      <MetaTags title={`Allowance settings • Wagmi Fund`} />
      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight>
          <Card className="bg-wagmi-black border-wagmi-gray space-y-2 linkify p-5">
            <Modules />
          </Card>
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default AllowanceSettings;
