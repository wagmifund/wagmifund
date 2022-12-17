import getIsAuthTokensAvailable from "@utils/getIsAuthTokensAvailable";
import resetAuthData from "@utils/resetAuthData";
import type { Profile } from "generated";
import { useUserProfilesQuery } from "generated";
import Head from "next/head";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useAppPersistStore, useAppStore } from "@store/app";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import Navbar from "@components/Navbar";
import { POLYGON_CHAIN_ID } from "@utils/constants";
import useIsMounted from "@utils/useIsMounted";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
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

  // Fetch current profiles and sig nonce owned by the wallet address
  const { data, loading } = useUserProfilesQuery({
    variables: { ownedBy: address },
    skip: !profileId,
    onCompleted: (data) => {
      const profiles = data?.profiles?.items
        ?.slice()
        ?.sort((a, b) => Number(a.id) - Number(b.id))
        ?.sort((a, b) =>
          a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
        );

      if (!profiles.length) {
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

  console.log("loading", loading, data);

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

  if (loading || !mounted) return <p>page loader</p>;
  return (
    <>
      <Head>
        <meta name="theme-color" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
