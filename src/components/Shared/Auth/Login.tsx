import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useUserProfilesLazyQuery,
} from "generated";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useSignMessage } from "wagmi";

import WalletSelectorButton from "@components/Shared/Auth/WalletSelectorButton";
import onError from "@utils/onError";
import { useAppPersistStore, useAppStore } from "@store/app";
import { ERROR_MESSAGE } from "@utils/constants";
import Modal from "@components/Modal";
import Analytics from "@utils/analytics";

const Login = () => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);
  const [showClaimHandleModal, setShowClaimHandleModal] = useState(true);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage({ onError });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: "no-cache",
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery();

  useEffect(() => {
    if (
      errorAuthenticate?.message ||
      errorChallenge?.message ||
      errorProfiles?.message
    )
      toast.error(
        errorAuthenticate?.message ||
          errorChallenge?.message ||
          errorProfiles?.message ||
          ERROR_MESSAGE
      );
  }, [errorAuthenticate, errorChallenge, errorProfiles]);
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
        if (profiles?.[0]) {
          const currentProfile = profiles[0];
          setProfiles(profiles);
          setCurrentProfile(currentProfile);
          setProfileId(currentProfile?.id);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign in failed");
    } finally {
      Analytics.track("sign in");
      setLoading(false);
    }
  };

  return (
    <>
      {hasProfile || !showClaimHandleModal ? (
        <WalletSelectorButton handleSign={handleSign} signing={loading} />
      ) : (
        <Modal
          title="Claim Handle"
          onClose={() => setShowClaimHandleModal(false)}
          show={showClaimHandleModal}
        >
          <img
            className="w-16 h-16 rounded-full mb-2"
            height={64}
            width={64}
            src={`https://assets.lenster.xyz/images/brands/lens.png`}
            alt="Logo"
          />
          <div className="text-xl font-bold text-white">
            Claim your Lens profile 🌿
          </div>
          <div className="space-y-1">
            <div className="linkify">
              Visit{" "}
              <a
                className="font-bold"
                href="https://claim.lens.xyz"
                target="_blank"
                rel="noreferrer noopener"
              >
                claiming site
              </a>{" "}
              to claim your profile now 🏃‍♂️
            </div>
            <div className="text-sm text-white">
              Make sure to check back here when done!
            </div>
          </div>
        </Modal>
      )}
      {/* <WalletSelectorButton handleSign={() => handleSign()} signing={loading} /> */}
    </>
  );
};

export default Login;
