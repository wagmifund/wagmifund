import { useAppStore } from "@store/app";
import { StackedTierCard, tier, TierCards } from "./TierCard";
import {
  Profile,
  PublicationMainFocus,
  PublicationTypes,
  useProfileFeedQuery,
} from "generated";
import { useProfileTierStore } from "@store/profile-tiers";
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

  const { data, loading, error, fetchMore } = useProfileFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: false,
  });

  const Tierattributes = data?.publications.items;

  const filterTierItems = Tierattributes?.filter(
    (tier) => tier.appId === "cryptster"
  );
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
    return <StackedTierCard tiers={tiers || []} handle={profile.handle} />;
  }

  return <TierCards tiers={tiers || []} isEditMode={isEditMode} />;
};

export default TierCardData;
