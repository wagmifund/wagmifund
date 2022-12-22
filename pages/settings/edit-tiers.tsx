import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { APP_NAME } from "@utils/constants";
import { FC, useContext } from "react";
import { ProfileContext, useAppStore } from "src/store/app";
import Sidebar from "@modules/Settings/Sidebar";
import {
  PublicationSortCriteria,
  PublicationTypes,
  useProfileFeedQuery,
  useProfileSettingsQuery,
} from "generated";
import TierCardData from "@components/TierCardData";
import { usePublicationStore } from "@store/publication";
import { useRouter } from "next/router";
import { tier } from "@components/MockTierCard";

const EditTiers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

  const publications = usePublicationStore((state) => state.publications);

  const profile = data?.profile;

  const type = "NEW_POST";
  const publicationTypes =
    type === "NEW_POST"
      ? [PublicationTypes.Post, PublicationTypes.Mirror]
      : type === "MEDIA"
      ? [PublicationTypes.Post, PublicationTypes.Comment]
      : [PublicationTypes.Comment];
  const metadata = null;
  const setPublications = usePublicationStore((state) => state.setPublications);
  const request = {
    publicationTypes,
    metadata,
    profileId: currentProfile?.id,
    limit: 10,
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;
  const {
    query: { username },
  } = useRouter();

  const { refetch } = useContext(ProfileContext);

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="space-y-2 linkify p-5">
          <div className="flex items-center space-x-2">
            <div className="text-lg font-bold">Edit Tiers</div>
          </div>
          <div className="pb-2">
            {publications.length > 0
              ? "here you can add or delete any of your tier"
              : "Seems like you dont have any tiers? Would you like to create some?"}
          </div>
          <div className="flex flex-wrap gap-1">
            <TierCardData
              onMetaClick={refetch}
              profile={profile}
              isEditMode
              isStacked={false}
              tiers={publications}
            />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default EditTiers;
