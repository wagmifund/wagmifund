import MenuItems from "@components/Navbar/Menuitems";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { usePublicationStore } from "@store/publication";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppStore } from "../../store/app";

const NavBar = () => {
  const publications = usePublicationStore((state) => state.publications);
  const publicationIsFetched = usePublicationStore(
    (state) => state.publicationIsFetched
  );
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { username },
  } = useRouter();
  return (
    <div className="navbar h-8 bg-slate-900 text-white flex justify-between">
      <div className="flex justify-evenly">
        <Link href="/" className="ml-10">
          wagmi fund
        </Link>
      </div>
      <div>
        {currentProfile?.handle !== username &&
          currentProfile?.handle &&
          publications?.length < 5 && (
            <Link className="mr-8 flex items-center" href="/onboard">
              Complete your profile{" "}
              <InformationCircleIcon className="h-6 w-6 ml-3" />
            </Link>
          )}
        <MenuItems />
      </div>
    </div>
  );
};

export default NavBar;
