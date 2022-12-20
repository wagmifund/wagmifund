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
const TierCardData = ({
  type = "NEW_POST",
  isStacked = true,
  profile,
  isEditMode = false,
}: {
  type: string;
  isStacked: boolean;
  profile: Profile;
  isEditMode: boolean;
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const mediaFeedFilters = useProfileTierStore(
    (state) => state.mediaTierFilters
  );

  const getMediaFilters = () => {
    let filters: PublicationMainFocus[] = [];
    if (mediaFeedFilters.images) {
      filters.push(PublicationMainFocus.Image);
    }
    if (mediaFeedFilters.video) {
      filters.push(PublicationMainFocus.Video);
    }
    if (mediaFeedFilters.audio) {
      filters.push(PublicationMainFocus.Audio);
    }
    return filters;
  };

  const publicationTypes =
    type === "NEW_POST"
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === "MEDIA"
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata =
    type === "MEDIA"
      ? {
          mainContentFocus: getMediaFilters(),
        }
      : null;

  const setPublications = usePublicationStore((state) => state.setPublications);

  const request = {
    publicationTypes,
    metadata,
    profileId: profile?.id,
    limit: 10,
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const {
    query: { username },
  } = useRouter();
  const { data, refetch } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: false,
    onCompleted: (data) => {
      if (currentProfile?.handle !== username) {
        const Tierattributes = data?.publications.items;

        const filterTierItems = Tierattributes?.filter(
          (tier) => tier.appId === "wagmifund"
        );
        setPublications(filterTierItems);
      }
    },
  });

  const Tierattributes = data?.publications.items;

  const filterTierItems = Tierattributes?.filter(
    (tier) => tier.appId === "wagmifund"
  );
  const { address } = useAccount();
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const onCompleted = () => {
    toast.success("Transaction submitted successfully!");
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
      } catch {}
    },
    onError,
  });
  const createCollect = (publicationId: number) => {
    console.log("publicationId", publicationId);
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          publicationId: publicationId,
        },
      },
    });
  };

  const tiers = filterTierItems?.map((tier) => ({
    ...tier.metadata.attributes.reduce(
      (acc, { traitType, value }) => ({
        ...acc,
        [traitType as string]: value,
        id: tier.id,
      }),
      {}
    ),
  })) as Array<tier>;
  if (isStacked) {
    return (
      <StackedTierCard
        tiers={tiers || []}
        handle={profile?.handle}
        createCollect={createCollect}
      />
    );
  }

  return (
    <TierCards
      onMetaClick={refetch}
      tiers={tiers || []}
      isEditMode={isEditMode}
      createCollect={createCollect}
    />
  );
};

export default TierCardData;
