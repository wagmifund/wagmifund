import clsx from "clsx";
import { useState } from "react";
import { Card } from "./Card";
import {
  GiftIcon,
  StarIcon,
  SparklesIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import Button from "@components/Button";
import { useHidePublicationMutation } from "generated";
import { useRouter } from "next/router";
import Modal from "@components/Modal";
interface TierProps {
  tiers: Array<tier>;
  handle: string;
  activeTier?: number;
  viewOnly?: boolean;
  publications?: any;
  profile?: any;
  party?: boolean;
  setParty?: any;
}

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  currency: string;
  emoji: string;
  isRecommended: string;
  id: string;
  setClickedOnContinue?: any;
};

export const StackedTierCard = ({
  handle,
  activeTier = 0,
  tiers,
  publications,
  setParty,
  profile,
  party = false,
  viewOnly = false,
}: TierProps) => {
  const [currentTier, setCurrentTier] = useState(activeTier);

  return (
    <Card
      className={clsx(`flex flex-col items-center lg:w-2/5 mx-3 p-2 sm:p-8`, {
        " text-white bg-gray-900/50 ring-1": viewOnly,
        "border border-theme": !viewOnly,
      })}
    >
      <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center">
        Collect tier to support {profile?.handle} in{" "}
        {tiers[currentTier]?.currency}
      </h2>
      <p className="h-auto min-h-12 py-2 flex-grow-0">
        {tiers[currentTier]?.comment || "sample comment"}
      </p>
      <Card className="border border-theme w-full flex items-center bg-theme p-4">
        <div className="flex justify-center items-center">
          <div className="text-[50px]">{tiers[currentTier]?.emoji}</div>
          <div className="ml-3 text-theme">
            <XIcon className="w-7 h-7 outline-1 dark:text-white text-theme" />
          </div>
          <div className="flex flex-wrap">
            {tiers.map(({ amount }, _index) => (
              <button
                onClick={() => {
                  !viewOnly && setCurrentTier(_index);
                }}
                className={clsx(
                  _index === currentTier
                    ? "bg-theme-darker text-white"
                    : "border border-theme bg-white text-gray-800",
                  "m-1 sm:m-2 h-10 w-10 rounded-full flex justify-center items-center"
                )}
                key={"tier" + _index}
              >
                <span>{amount}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Button
        className="capitalize w-full button-primary border-theme"
        onClick={() => {
          console.log(currentTier);
        }}
      >
        Gift {tiers[currentTier]?.amount}
      </Button>
    </Card>
  );
};

export const TierCards = ({
  tiers,
  isEditMode,
  onMetaClick,
}: {
  tiers: Array<tier> | [];
  isEditMode: boolean;
}) => {
  const { pathname, push } = useRouter();
  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      pathname === "/posts/[id]" ? push("/") : location.reload();
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <>
      {tiers.map(
        ({ amount, comment, currency, emoji, id, isRecommended = false }) => (
          <Card
            className="border p-4 border-primary w-[30%] flex flex-col items-center relative"
            key={amount}
          >
            <div className="absolute -right-4 -top-4 bg-slate-900 h-10 w-10 border border-theme rounded-3xl flex justify-center items-center">
              {isEditMode && (
                <TrashIcon
                  className="h-8 w-8 text-red-600 cursor-pointer"
                  onClick={() => setShowDeleteModal(true)}
                />
              )}
              <Modal
                title="Delete tier"
                onClose={() => setShowDeleteModal(false)}
                show={isEditMode && showDeleteModal}
              >
                <div className="flex flex-col m-4">
                  <div className="mb-1">
                    are you sure you want to delete this tier?
                  </div>
                  <Button
                    onClick={() =>
                      hidePost({
                        variables: {
                          request: { publicationId: id },
                        },
                      })
                    }
                  >
                    confirm
                  </Button>
                </div>
              </Modal>
              {isRecommended && (
                <StarIcon
                  className="h-6 w-6 text-theme"
                  onClick={onMetaClick}
                />
              )}
            </div>
            <div className="bg-theme border border-theme rounded-3xl text-4xl h-12 w-12 flex justify-center items-center">
              {emoji}
            </div>
            <div className="my-4">{comment}</div>
            <div className="my-4 text-lg font-semibold">
              {amount} {currency}
            </div>
            <Button
              className="capitalize w-full button-primary border-theme p-1 min-h-[2] !h-2"
              onClick={() => {
                console.log(amount);
              }}
              disabled={isEditMode}
            >
              Gift
            </Button>
          </Card>
        )
      )}
    </>
  );
};
