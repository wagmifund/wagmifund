import MetaTags from "@components/MetaTags";
import PageLoader from "@components/PageLoader";
import TierForm from "@components/TierForm";
import { useAppStore } from "@store/app";
import { usePublicationStore } from "@store/publication";
import { useRouter } from "next/router";

const Onboard = () => {
  const publications = usePublicationStore((state) => state.publications);
  const publicationFetched = usePublicationStore(
    (state) => state.publicationIsFetched
  );
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (publications.length === 5) {
    router.push(`/u/${currentProfile?.handle}`);
  }
  if (!currentProfile) {
    router.push("/");
  }
  if (!publicationFetched) {
    return <PageLoader />;
  }
  return (
    <>
      <MetaTags title={`Onboard • Wagmi Fund`} />
      <div className="flex flex-grow">
        <div className="flex justify-center items-center flex-col flex-grow">
          <TierForm />
        </div>
      </div>
    </>
  );
};

export default Onboard;
