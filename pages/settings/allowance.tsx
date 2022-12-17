import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { Spinner } from "@components/Spinner";
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from "@utils/constants";
import type { Erc20 } from "generated";
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
} from "generated";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAppStore } from "src/store/app";

import Sidebar from "@modules/Settings/Sidebar";
import Allowance from "@modules/Settings/Allowance";
import Modules from "@modules/Settings/Modules";

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    collectModules: [
      CollectModules.LimitedFeeCollectModule,
      CollectModules.FeeCollectModule,
      CollectModules.LimitedTimedFeeCollectModule,
      CollectModules.TimedFeeCollectModule,
      CollectModules.FreeCollectModule,
      CollectModules.RevertCollectModule,
    ],
    followModules: [FollowModules.FeeFollowModule],
    referenceModules: [ReferenceModules.FollowerOnlyReferenceModule],
  };
};

const AllowanceSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);
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
