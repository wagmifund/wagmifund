import { useAppStore } from "@store/app";
import { tier, TierCards } from "./TierCard";
import {
    Profile,
  PublicationMainFocus,
  PublicationTypes,
  useProfileFeedQuery,
} from "generated";
import { useProfileTierStore } from "@store/profile-tiers";
const TierCardData = ({
  type = "NEW_POST",
  profile,
}: {
  type: string;
  profile: Profile;
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

  const tiers = Tierattributes?.map((tier) => ({
    ...tier.metadata.attributes.reduce(
      (acc, { traitType, value }) => ({
        ...acc,
        [traitType as string]: value,
      }),
      {}
    ),
  })) as Array<tier>;

  return <TierCards tiers={tiers || []} />;
};

export default TierCardData;
