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
import { useProfileSettingsQuery } from "generated";
import TierCardData from "@components/TierCardData";

const EditTiers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

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
            here you can add or delete any of your tier
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
