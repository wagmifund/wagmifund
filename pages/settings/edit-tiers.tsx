import { Card } from "@components/Card";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
} from "@components/GridLayout";
import { FC, useContext, useEffect } from "react";
import { ProfileContext, useAppStore } from "src/store/app";
import Sidebar from "@modules/Settings/Sidebar";
import { useProfileSettingsQuery } from "generated";
import TierCardData from "@components/TierCardData";
import { usePublicationStore } from "@store/publication";
import { useRouter } from "next/router";
import { Button } from "@components/Button";
import MetaTags from "@components/MetaTags";
import Analytics from "@utils/analytics";

const EditTiers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

  const publications = usePublicationStore((state) => state.publications);

  const profile = data?.profile;

  const { refetch } = useContext(ProfileContext);
  const router = useRouter();
  useEffect(() => {
    Analytics.track("edit tiers loaded", { handle: profile?.handle });
  }, [profile?.handle]);

  return (
    <>
      <MetaTags title={`Edit Tiers • Wagmi Fund`} />

      <GridLayout>
        <GridItemFour>
          <Sidebar />
        </GridItemFour>
        <GridItemEight>
          <Card className="bg-wagmi-black border-wagmi-gray space-y-2 linkify p-5">
            <div className="flex items-center space-x-2 justify-between">
              <div className="text-lg font-bold">Edit Tiers</div>
              {publications?.length < 5 && (
                <Button onClick={() => router.push("/onboard")}>
                  Create Tiers
                </Button>
              )}
            </div>
            <div className="pb-2">
              {publications?.length > 0
                ? "Here you can add or delete any of your tier"
                : "Seems like you dont have any tiers? Would you like to create some?"}
            </div>
            <div className="flex flex-wrap gap-1">
              <TierCardData
                onMetaClick={refetch}
                profile={profile}
                isEditMode
                layout="default"
                tiers={publications}
              />
            </div>
          </Card>
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default EditTiers;
