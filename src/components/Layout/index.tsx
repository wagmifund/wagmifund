import getIsAuthTokensAvailable from "@utils/getIsAuthTokensAvailable";
import resetAuthData from "@utils/resetAuthData";
import {
  Profile,
  PublicationTypes,
  useProfileFeedQuery,
  useUserProfilesQuery,
} from "generated";
import Head from "next/head";
import type { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import getToastOptions from "@utils/getToastOptions";
import { useEffect } from "react";
import { ProfileContext, useAppPersistStore, useAppStore } from "@store/app";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import Navbar from "@components/Navbar";
import { POLYGON_CHAIN_ID } from "@utils/constants";
import useIsMounted from "@utils/useIsMounted";
import PageLoader from "@components/PageLoader";
import { useRouter } from "next/router";
import { usePublicationStore } from "@store/publication";
import { tier } from "@components/MockTierCard";
import Confetti from "react-confetti";
import useWindow from "@utils/hooks/useWindow";
import Analytics from "@utils/analytics";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setConfetti = useAppStore((state) => state.setConfetti);
  const confetti = useAppStore((state) => state.confetti);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
  };
  useEffect(() => {
    Analytics.trackerInit();
  }, []);

  // Fetch current profiles and sig nonce owned by the wallet address
  const { loading } = useUserProfilesQuery({
    variables: { ownedBy: address },
    skip: !profileId,
    onCompleted: (data) => {
      const profiles = data?.profiles?.items
        ?.slice()
        ?.sort((a, b) => Number(a.id) - Number(b.id))
        ?.sort((a, b) =>
          a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
        );

      if (!profiles?.length) {
        return resetAuthState();
      }

      const selectedUser = profiles.find((profile) => profile.id === profileId);

      setProfiles(profiles as Profile[]);
      setCurrentProfile(selectedUser as Profile);
      setProfileId(selectedUser?.id);
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);
    },
    onError: () => {
      setProfileId(null);
    },
  });

  const type = "NEW_POST";
  const publicationTypes =
    type === "NEW_POST"
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === "MEDIA"
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata = null;
  const setPublications = usePublicationStore((state) => state.setPublications);
  const setPublicationIsFetched = usePublicationStore(
    (state) => state.setPublicationIsFetched
  );

  const { height, width } = useWindow();

  const request = {
    publicationTypes,
    metadata,
    profileId: currentProfile?.id,
    sources: ["wagmifund"],
    limit: 5,
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const {
    query: { username },
  } = useRouter();
  const { refetch } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !profileId || username === currentProfile?.handle,
    onCompleted: (data) => {
      const Tierattributes = data?.publications.items;
      const tiers = Tierattributes?.map((tier) => ({
        ...tier.metadata.attributes.reduce(
          (acc, { traitType, value }) => ({
            ...acc,
            [traitType as string]: value,
            id: tier.id,
          }),
          {}
        ),
      })) as Array<tier>;
      setPublications(tiers);
      setPublicationIsFetched(true);
    },
  });

  const validateAuthentication = () => {
    const currentProfileAddress = currentProfile?.ownedBy;
    const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID;

    const isSwitchedAccount =
      currentProfileAddress !== undefined && currentProfileAddress !== address;
    const shouldLogout =
      !getIsAuthTokensAvailable() ||
      isWrongNetworkChain ||
      isDisconnected ||
      isSwitchedAccount;

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      resetAuthState();
      resetAuthData();
      disconnect?.();
    }
  };
  const { mounted } = useIsMounted();

  useEffect(() => {
    validateAuthentication();
  }, [address, chain, disconnect, profileId]);

  if (loading || !mounted)
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  return (
    <>
      <Head>
        <meta name="theme-color" />
      </Head>
      <Toaster position="bottom-right" toastOptions={getToastOptions()} />
      {confetti && (
        <Confetti
          numberOfPieces={300}
          recycle={false}
          onConfettiComplete={(confetti) => {
            setConfetti(false);
            confetti?.reset();
          }}
          width={width}
          height={height}
        />
      )}
      <div className="flex flex-col min-h-screen">
        <ProfileContext.Provider value={{ refetch }}>
          <Navbar />
          {children}
        </ProfileContext.Provider>
      </div>
    </>
  );
};

export default Layout;
