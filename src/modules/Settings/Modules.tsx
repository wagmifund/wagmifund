import { Button } from "@components/Button";
import { Loader } from "@components/Loader";
import { useAppStore } from "@store/app";
import type { ApprovedAllowanceAmount, Erc20 } from "generated";
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
  useGenerateModuleCurrencyApprovalDataLazyQuery,
} from "generated";
import React, { useState } from "react";
import toast from "react-hot-toast";
// import type { CustomErrorWithData } from "utils";
import { WMATIC_TOKEN_ADDRESS } from "@utils/constants";
import { getCollectModuleConfig } from "@modules/Settings/getCollectModuleConfig";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

const collectModules = ["FeeCollectModule"];

const ModulePermissions = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currency, setCurrency] = useState(WMATIC_TOKEN_ADDRESS);
  const [loadingModule, setLoadingModule] = useState("");

  const { data: txData, sendTransaction } = useSendTransaction({
    request: {},
    mode: "recklesslyUnprepared",
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
      setLoadingModule("");
    },
  });

  const {
    data,
    refetch,
    loading: gettingSettings,
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: [currency],
        followModules: [FollowModules.FeeFollowModule],
        collectModules: [
          CollectModules.FreeCollectModule,
          CollectModules.FeeCollectModule,
          CollectModules.LimitedFeeCollectModule,
          CollectModules.LimitedTimedFeeCollectModule,
          CollectModules.TimedFeeCollectModule,
          CollectModules.RevertCollectModule,
        ],
        referenceModules: [ReferenceModules.FollowerOnlyReferenceModule],
      },
    },
    skip: !currentProfile?.id,
  });
  useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success("Permission updated");
      setLoadingModule("");
      refetch();
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
      setLoadingModule("");
    },
  });

  const [generateAllowanceQuery] =
    useGenerateModuleCurrencyApprovalDataLazyQuery();

  const handleClick = async (isAllow: boolean, selectedModule: string) => {
    try {
      setLoadingModule(selectedModule);
      const { data } = await generateAllowanceQuery({
        variables: {
          request: {
            currency,
            value: isAllow ? Number.MAX_SAFE_INTEGER.toString() : "0",
            [getCollectModuleConfig(selectedModule).type]: selectedModule,
          },
        },
      });
      const generated = data?.generateModuleCurrencyApprovalData;
      sendTransaction?.({
        recklesslySetUnpreparedRequest: {
          from: generated?.from,
          to: generated?.to,
          data: generated?.data,
        },
      });
    } catch {
      setLoadingModule("");
    }
  };

  return (
    <div className="pt-6">
      <div>
        <h1 className="mb-1 text-xl font-semibold">Access permissions</h1>
        <p className="opacity-80">
          These are the collect modules which you allowed / need to allow to use
          collect feature. You can allow and revoke access anytime.
        </p>
      </div>
      <div>
        {!gettingSettings && data && (
          <div className="flex justify-end pt-3 pb-4 md:pt-0">
            <select
              placeholder="More about your stream"
              autoComplete="off"
              className="bg-white text-black text-sm p-2 rounded-xl border border-gray-300 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {data?.enabledModuleCurrencies?.map((currency: Erc20) => (
                <option key={currency.address} value={currency.address}>
                  {currency.symbol}
                </option>
              ))}
            </select>
          </div>
        )}
        {gettingSettings && (
          <div className="grid h-24 place-items-center">
            <Loader />
          </div>
        )}
        {!gettingSettings &&
          data?.approvedModuleAllowanceAmount?.map(
            (moduleItem: ApprovedAllowanceAmount) =>
              collectModules.includes(moduleItem.module) && (
                <div
                  key={moduleItem.contractAddress}
                  className="flex items-center pb-4 rounded-md"
                >
                  <div className="flex-1">
                    <h6 className="text-base">Allow {moduleItem.module}</h6>
                    <p className="text-sm opacity-70">
                      {getCollectModuleConfig(moduleItem.module).description}
                    </p>
                  </div>
                  <div className="flex items-center flex-none ml-2 space-x-2">
                    {moduleItem?.allowance === "0x00" ? (
                      <Button
                        disabled={loadingModule === moduleItem.module}
                        // loading={loadingModule === moduleItem.module}
                        onClick={() => handleClick(true, moduleItem.module)}
                      >
                        Allow
                      </Button>
                    ) : (
                      <Button
                        disabled={loadingModule === moduleItem.module}
                        onClick={() => handleClick(false, moduleItem.module)}
                        variant="accent"
                        // loading={loadingModule === moduleItem.module}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default ModulePermissions;
