import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery,
} from "generated";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useSignMessage } from "wagmi";

import WalletSelectorButton from "@components/Shared/Auth/WalletSelectorButton";
import onError from "@utils/onError";
import { useAppPersistStore, useAppStore } from "@store/app";

const Login = () => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const profiles = useAppStore((state) => state.profiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: "no-cache",
  });
  const [authenticate] = useAuthenticateMutation();
  const [getProfiles] = useUserProfilesLazyQuery();

  const handleSign = async () => {
    try {
      setLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { address } },
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error("ERROR_MESSAGE");
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text,
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } },
      });
      localStorage.setItem("accessToken", auth.data?.authenticate.accessToken);
      localStorage.setItem(
        "refreshToken",
        auth?.data?.authenticate.refreshToken
      );

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        setHasProfile(false);
      } else {
        const profiles: any = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a: any, b: any) => Number(a.id) - Number(b.id))
          ?.sort((a: any, b: any) =>
            a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
          );
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile?.id);
        console.log("loggged innnnn");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletSelectorButton handleSign={() => handleSign()} signing={loading} />
  );
};

export default Login;
