import PageLoader from "@components/PageLoader";
import TierForm from "@components/TierForm";
import { NotFoundPage } from "@modules/Error/NotFoundPage";
import { ServerError } from "@modules/Error/ServerError";
import { useAppStore } from "@store/app";
import { useProfileSettingsQuery } from "generated";

const Onboard = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
  });

  if (error) {
    return <ServerError />;
  }

  if (loading) {
    return <PageLoader />;
  }

  if (!currentProfile) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-grow ">
      <div className="flex justify-center items-center flex-col flex-grow">
        <TierForm />
      </div>
    </div>
  );
};

export default Onboard;
