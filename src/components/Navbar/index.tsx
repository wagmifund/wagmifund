import MenuItems from "@components/Navbar/Menuitems";
import { usePublicationStore } from "@store/publication";
import Link from "next/link";
import { useAppStore } from "../../store/app";

const NavBar = () => {
  const publications = usePublicationStore((state) => state.publications);
  const currentProfile = useAppStore((state) => state.currentProfile);
  return (
    <div className="navbar h-8 bg-slate-900 text-white flex justify-between">
      <div className="flex justify-evenly">
        <Link href="/" className="ml-10">
          wagmi fund
        </Link>
      </div>
      <div>
        {currentProfile?.handle && publications?.length < 3 && (
          <Link href="/onboard">Complete your profile</Link>
        )}
        <MenuItems />
      </div>
    </div>
  );
};

export default NavBar;
