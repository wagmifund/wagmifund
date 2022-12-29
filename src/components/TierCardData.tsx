import { useAppStore } from "@store/app";
import {
  StackedTierCard,
  tier,
  TierCards,
  TierCardsCollection,
} from "./TierCard";
import { Profile, useCreateCollectTypedDataMutation } from "generated";
import toast from "react-hot-toast";
import { RELAY_ON, SIGN_WALLET } from "@utils/constants";
import { useAccount, useContractWrite, useSignTypedData } from "wagmi";
import onError from "@utils/onError";
import getSignature from "@utils/getSignature";
import splitSignature from "@utils/splitSignature";
import { LENSHUB_PROXY } from "@utils/constants";
import { LensHubProxy } from "@abis/LensHubProxy";
import useBroadcast from "@utils/useBroadcast";
import { useRouter } from "next/router";
import { useState } from "react";
import { Card } from "./Card";
import Button from "./Button";
import clsx from "clsx";
import { useProfileUIStore } from "@store/profile";
const TierCardData = ({
  onMetaClick,
  tiers,
  layout = "stack",
  profile,
  isEditMode = false,
  loadingTiers,
}: {
  onMetaClick: () => void;
  type?: string;
  tiers: Array<tier>;
  loadingTiers?: boolean;
  layout: "stack" | "collection" | "default";
  profile: Profile;
  isEditMode?: boolean;
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(null);
  const about = useProfileUIStore((state) => state.profileUIData.about);

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const onCompleted = () => {
    toast.success("Transaction submitted successfully!");
    setLoading(false);
    setIndex(null);
  };

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: "collectWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const { broadcast } = useBroadcast({ onCompleted });

  const [createCollectTypedData] = useCreateCollectTypedDataMutation({
    onCompleted: async ({ createCollectTypedData }) => {
      try {
        const { id, typedData } = createCollectTypedData;
        const {
          profileId,
          pubId,
          data: collectData,
          deadline,
        } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          collector: address,
          profileId,
          pubId,
          data: collectData,
          sig,
        };

        setUserSigNonce(userSigNonce + 1);
        if (!RELAY_ON) {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }

        const {
          data: { broadcast: result },
        } = await broadcast({ request: { id, signature } });

        if ("reason" in result) {
          write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      } catch {
        setIndex(null);
        setLoading(false);
      }
    },
    onError,
  });
  const createCollect = (publicationId: number) => {
    console.log("publicationId", publicationId);
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    setLoading(true);

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          publicationId: publicationId,
        },
      },
    });
  };
  const {
    query: { username },
  } = useRouter();
  if (loadingTiers) {
    return layout === "stack" ? (
      <div
        className={clsx(
          "m-2 w-full tier-card card shadow-lg shadow-slate-900/5  flex flex-col justify-center items-center border border-theme",
          about || username === currentProfile?.handle ? "lg:w-2/5" : "w-full"
        )}
      >
        <div className="card-body sm:p-8 w-full">
          <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center bg-gray-800 animate-pulse">
            <p className="opacity-0"> loading</p>
          </h2>
          <p className="h-auto min-h-12 flex-grow-0"></p>
          <div className="card animate-pulse  shadow-lg shadow-slate-900/5 rounded-md border border-theme w-full flex items-center bg-theme">
            <div className="card-body p-2 sm:p-8 w-full">
              <div className="flex justify-center items-center">
                <div className="text-[50px]">🌸</div>
                <div className="ml-3 text-theme">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-7 h-7 outline-1 dark:text-white text-theme"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-wrap">
                  <button className="bg-theme-darker text-primary-content m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                    <span></span>
                  </button>
                  <button className="border border-theme bg-white text-gray-800 m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                    <span></span>
                  </button>
                  <button className="border border-theme bg-white text-gray-800 m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center">
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn bg-primary hover:bg-primary border-1 capitalize w-full button-primary border-theme animate-pulse"></button>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="mt-10 w-full md:w-[80%] flex sm:justify-between mx-auto flex-wrap">
          {[1, 2, 4].map((i) => (
            <Card
              className="border p-4 border-primary w-full sm:w-[45%] lg:w-[30%] flex flex-col items-center relative"
              key={`dummy-${i}`}
            >
              <div className="bg-theme border border-theme rounded-3xl text-4xl h-12 w-12 flex justify-center items-center animate-pulse"></div>
              <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center w-full overflow-hidden text-ellipsis opacity-0">
                dummy data
              </h2>
              <p className="h-auto py-2 flex-grow-0 opacity-0">
                as soon as possible
              </p>
              <div className="my-4 text-lg font-semibold opacity-0">amount</div>
              <Button
                className="capitalize w-full button-primary border-theme p-1 !text-white min-h-[2] !h-2 animate-pulse"
                disabled={false}
              ></Button>
            </Card>
          ))}
        </div>
        <div className="flex justify-center flex-grow">
          <Button className="flex mt-2 animate-pulse">
            <p className="opacity-0"> Show More</p>
          </Button>
        </div>
      </>
    );
  }

  if (layout === "stack") {
    return (
      <StackedTierCard
        tiers={tiers || []}
        handle={profile?.handle}
        createCollect={createCollect}
        loading={loading}
      />
    );
  } else if (layout === "collection") {
    return (
      <TierCardsCollection
        onMetaClick={onMetaClick}
        tiers={tiers || []}
        isEditMode={isEditMode}
        createCollect={createCollect}
        loading={loading}
        setIndex={setIndex}
        index={index}
        handle={profile?.handle}
      />
    );
  } else {
    return (
      <TierCards
        onMetaClick={onMetaClick}
        tiers={tiers || []}
        isEditMode={isEditMode}
        createCollect={createCollect}
        loading={loading}
        setIndex={setIndex}
        index={index}
      />
    );
  }
};

export default TierCardData;
