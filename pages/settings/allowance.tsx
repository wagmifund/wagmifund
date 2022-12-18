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
  const { data, loading, error, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      variables: {
        request: getAllowancePayload(DEFAULT_COLLECT_TOKEN),
      },
      skip: !currentProfile?.id,
    });

  if (error) {
    return <p>500 page</p>;
  }

  if (loading) {
    return <p>page loader</p>;
  }

  if (!currentProfile) {
    return <p>404 page</p>;
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="space-y-2 linkify p-5">
          <Modules />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default AllowanceSettings;
