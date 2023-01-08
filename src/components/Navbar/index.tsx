import MenuItems from "@components/Navbar/Menuitems";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { usePublicationStore } from "@store/publication";
import { IS_MAINNET } from "@utils/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppStore } from "../../store/app";

const NavBar = () => {
  const publications = usePublicationStore((state) => state.publications);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const {
    query: { username },
  } = useRouter();
  return (
    <div className="navbar h-8 bg-[#111] border-b border-[#333] text-white flex justify-between sm:px-8">
      <div className="flex justify-evenly">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <img src="/logo.svg" alt="logo of wagmi" className="h-8 w-8" />
          <p className=" hidden sm:block">wagmi fund</p>
          {!IS_MAINNET && <span className="badge badge-xs">testnet</span>}
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
