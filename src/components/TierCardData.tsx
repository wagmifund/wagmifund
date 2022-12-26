import { useAppStore } from "@store/app";
import { StackedTierCard, tier, TierCards } from "./TierCard";
import {
  Profile,
  PublicationMainFocus,
  PublicationTypes,
  useCreateCollectTypedDataMutation,
  useProfileFeedQuery,
} from "generated";
import { useProfileTierStore } from "@store/profile-tiers";
import toast from "react-hot-toast";
import { RELAY_ON, SIGN_WALLET } from "@utils/constants";
import { useAccount, useContractWrite, useSignTypedData } from "wagmi";
import onError from "@utils/onError";
import getSignature from "@utils/getSignature";
import splitSignature from "@utils/splitSignature";
import { TESTNET_LENSHUB_PROXY } from "@utils/contracts";
import { LensHubProxy } from "@abis/LensHubProxy";
import useBroadcast from "@utils/useBroadcast";
import { usePublicationStore } from "@store/publication";
import { useRouter } from "next/router";
import { useState } from "react";
const TierCardData = ({
  onMetaClick,
  type = "NEW_POST",
  tiers,
  isStacked = true,
  profile,
  isEditMode = false,
}: {
  onMetaClick: () => void;
  type: string;
  tiers: Array<tier>;
  isStacked: boolean;
  profile: Profile;
  isEditMode: boolean;
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { address } = useAccount();
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(null);

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const onCompleted = () => {
    toast.success("Transaction submitted successfully!");
    setLoading(false);
    setIndex(null);
  };

  const { write } = useContractWrite({
    address: TESTNET_LENSHUB_PROXY,
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

  if (isStacked) {
    return (
      <StackedTierCard
        tiers={tiers || []}
        handle={profile?.handle}
        createCollect={createCollect}
        loading={loading}
      />
    );
  }

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
};

export default TierCardData;
