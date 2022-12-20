import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { APP_NAME } from "@utils/constants";
import type { FC } from "react";
import { useAppStore } from "src/store/app";
import Sidebar from "@modules/Settings/Sidebar";
import { PublicationSortCriteria, useProfileSettingsQuery } from "generated";
import TierCardData from "@components/TierCardData";
import { usePublicationStore } from "@store/publication";

const EditTiers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

  const publications = usePublicationStore((state) => state.publications);

  const profile = data?.profile;

  if (!currentProfile) {
    return <p>404</p>;
  }

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
            <TierCardData profile={profile} isEditMode isStacked={false} />
          </div>
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default EditTiers;
