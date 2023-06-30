import clsx from "clsx";
import { useState } from "react";
import { Card } from "./Card";
import {
  ChevronDownIcon,
  StarIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Button } from "@components/Button";
import { useHidePublicationMutation } from "generated";
import { useRouter } from "next/router";
import Modal from "@components/Modal";
import { SUPPORTED_CURRENCIES } from "@utils/constants";
import { Loader } from "./Loader";
import { useProfileUIStore } from "@store/profile";
import { useAppStore } from "@store/app";
import Analytics from "@utils/analytics";
interface TierProps {
  tiers: Array<tier>;
  handle: string;
  activeTier?: number;
  viewOnly?: boolean;
  profile?: any;
  createCollect?: any;
  loading?: boolean;
}

export type tier = {
  isLoading?: boolean;
  amount: number;
  comment: string;
  title: string;
  currency: string;
  emoji: string;
  buttonText: string;
  recommendedTier: string;
  id: string;
  setClickedOnContinue?: any;
};

export const StackedTierCard = ({
  activeTier = 0,
  tiers,
  handle,
  viewOnly = false,
  createCollect,
  loading = false,
}: TierProps) => {
  const [currentTier, setCurrentTier] = useState(activeTier);

  const about = useProfileUIStore((state) => state.profileUIData.about);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { username },
    push,
  } = useRouter();

  if (tiers.length === 0) {
    return (
      <Card
        className={clsx(
          `flex flex-col items-center p-2 sm:p-8 text-center h-fit`,
          about || username === currentProfile?.handle ? "lg:w-2/5" : "w-full",
          {
            " text-white bg-gray-900/50 ring-1": viewOnly,
            "border border-theme": !viewOnly,
          }
        )}
      >
        oops seems like there are no tiers created yet
        {username === currentProfile?.handle && (
          <Button
            className="mt-4"
            onClick={() => {
              push("/onboard");
            }}
          >
            Create Tiers
          </Button>
        )}
      </Card>
    );
  }
  return (
    <Card
      className={clsx(
        `flex flex-col items-center p-2 sm:p-8 h-fit`,
        about || username === currentProfile?.handle || viewOnly
          ? "lg:w-2/5"
          : "w-full",
        {
          " text-white bg-gray-900/50 ring-1": viewOnly,
          "border border-theme": !viewOnly,
        }
      )}
    >
      {!viewOnly ? (
        <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center w-full overflow-hidden text-ellipsis">
          {tiers[currentTier]?.title?.length
            ? tiers[currentTier]?.title
            : `Collect tier to support ${handle}`}
        </h2>
      ) : (
        <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center w-full overflow-hidden text-ellipsis">
          {tiers[currentTier]?.title?.length
            ? tiers[currentTier]?.title
            : `Collect tier to support ${handle}`}
        </h2>
      )}

      <p className="h-auto min-h-12 py-2 flex-grow-0">
        {tiers[currentTier]?.comment || "Thanks for gifting me"}
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
                <span>{amount || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Button
        className={clsx(
          "capitalize w-full !text-white button-primary border-theme",
          viewOnly ? "btn-disabled cursor-not-allowed" : null
        )}
        disabled={loading}
        onClick={() => createCollect(tiers[currentTier]?.id)}
      >
        <span className="mr-1">{loading && <Loader size="sm" />}</span>
        {tiers[currentTier]?.buttonText
          ? tiers[currentTier]?.buttonText
          : "Gift"}{" "}
        {tiers[currentTier]?.amount}{" "}
        {!viewOnly
          ? tiers[currentTier]?.currency
          : SUPPORTED_CURRENCIES?.filter(
              ({ address }) => address === tiers[currentTier]?.currency
            )?.[0].symbol}
      </Button>
    </Card>
  );
};

export const TierCards = ({
  tiers,
  isEditMode,
  onMetaClick,
  createCollect,
  loading,
  setIndex,
  index,
}: {
  tiers: Array<tier> | [];
  isEditMode: boolean;
  createCollect: any;
  onMetaClick: () => void;
  loading: boolean;
  index: number | null;
  setIndex: any;
}) => {
  const [hidePost] = useHidePublicationMutation({
    onCompleted: onMetaClick,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");

  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    push,
    query: { username },
  } = useRouter();
  if (tiers.length === 0) {
    return (
      <Card className="flex flex-col items-center p-2 sm:p-8 w-full text-center h-fit text-white bg-gray-900/50 ring-1">
        oops seems like there are no tiers created yet
        {username === currentProfile?.handle && (
          <Button
            className="mt-4"
            onClick={() => {
              push("/onboard");
            }}
          >
            Create Tiers
          </Button>
        )}
      </Card>
    );
  }
  return (
    <>
      {tiers.map(
        (
          {
            amount,
            title,
            comment,
            currency,
            emoji,
            id,
            recommendedTier = "false",
          },
          idx
        ) => (
          <Card
            className="border p-4 border-primary w-full sm:w-[45%] lg:w-[30%] flex flex-col items-center relative"
            key={amount}
          >
            {isEditMode && (
              <div className="absolute -right-4 -top-4 bg-slate-900 h-10 w-10 border border-theme rounded-3xl flex justify-center items-center">
                <TrashIcon
                  className="h-8 w-8 text-red-600 cursor-pointer"
                  onClick={() => {
                    setDeleteItemId(id);
                    setShowDeleteModal(true);
                  }}
                />
              </div>
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
                <div className="flex justify-center mt-2">
                  <Button
                    onClick={() => {
                      Analytics.track("Delete Tier", {
                        handle: currentProfile?.handle,
                      });
                      hidePost({
                        variables: {
                          request: { publicationId: deleteItemId },
                        },
                      });

                      setShowDeleteModal(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                  >
                    No
                  </Button>
                </div>
              </div>
            </Modal>
            {recommendedTier === "true" && !isEditMode && (
              <div className="absolute -right-4 -top-4 bg-slate-900 h-10 w-10 border border-theme rounded-3xl flex justify-center items-center">
                <StarIcon
                  className="h-6 w-6 text-theme"
                  onClick={onMetaClick}
                />
              </div>
            )}
            <div className="bg-theme border border-theme rounded-3xl text-4xl h-12 w-12 flex justify-center items-center">
              {emoji}
            </div>
            <h2 className="h-auto font-bold text-xl flex-grow-0 sm:text-2xl text-center w-full overflow-hidden text-ellipsis">
              {title}
            </h2>
            <p className="h-auto py-2 flex-grow-0 text-center">{comment}</p>
            <div className="my-4 text-lg font-semibold">
              {amount} {currency}
            </div>
            <Button
              className="capitalize w-full button-primary border-theme p-1 !text-white min-h-[2] !h-2"
              onClick={() => {
                createCollect(id);
                setIndex(idx);
              }}
              disabled={isEditMode || index === idx}
            >
              {index === idx ? (
                <span className="mr-1">{loading && <Loader size="sm" />}</span>
              ) : null}
              Gift
            </Button>
          </Card>
        )
      )}
    </>
  );
};

export const TierCardsCollection = ({
  tiers,
  isEditMode,
  onMetaClick,
  createCollect,
  loading,
  setIndex,
  index,
}: {
  tiers: Array<tier> | [];
  handle: string;
  isEditMode: boolean;
  createCollect: any;
  onMetaClick: () => void;
  loading: boolean;
  index: number | null;
  setIndex: any;
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="mt-10 w-full md:w-[80%] flex sm:justify-between mx-auto flex-wrap">
        <TierCards
          onMetaClick={onMetaClick}
          tiers={!showMore ? tiers.slice(0, 3) : tiers}
          isEditMode={isEditMode}
          createCollect={createCollect}
          loading={loading}
          setIndex={setIndex}
          index={index}
        />
      </div>
      {!showMore && tiers.length > 3 && (
        <div className="flex justify-center flex-grow">
          <Button
            className="flex mt-2"
            onClick={() => {
              setShowMore(true);
            }}
          >
            <p> Show More</p> <ChevronDownIcon className="ml-2 h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
};
