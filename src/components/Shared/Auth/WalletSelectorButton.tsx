import { Button } from "@components/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import toast from "react-hot-toast";
import { POLYGON_CHAIN_ID } from "@utils/constants";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useAppPersistStore } from "@store/app";
import UserMenu from "@components/UserMenu";

type Props = {
  handleSign?: () => void;
  signing?: boolean;
};

const WalletSelectorButton = ({ handleSign, signing }: Props) => {
  const { connector, isConnected } = useAccount();
  const profileId = useAppPersistStore((state) => state.profileId);

  const { switchNetwork } = useSwitchNetwork({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
    },
  });
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  return connector?.id && isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      profileId ? (
        <p>akshnfkasdfkjasd</p>
      ) : (
        <Button onClick={handleSign} disabled={signing}>
          Sign In
          <span className="hidden ml-1 md:inline-block">with Lens</span>
        </Button>
      )
    ) : (
      <Button
        onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        variant="secondary"
      >
        <span className="text-white">Switch network</span>
      </Button>
    )
  ) : (
    <>
      {openConnectModal && (
        <Button onClick={openConnectModal}>
          Connect
          <span className="hidden ml-1 md:inline-block">Wallet</span>
        </Button>
      )}
    </>
  );
};

export default WalletSelectorButton;
