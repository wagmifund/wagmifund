import MenuItems from "@components/Navbar/Menuitems";
import { usePublicationStore } from "@store/publication";
import Link from "next/link";

const NavBar = () => {
  const publications = usePublicationStore((state) => state.publications);
  return (
    <div className="navbar h-8 bg-slate-900 text-white flex justify-between">
      <div className="flex justify-evenly">
        <div className="ml-10">wagmi fund</div>
      </div>
      <div>
        {publications?.length < 3 && (
          <Link href="/onboard">Complete your profile</Link>
        )}
        <MenuItems />
      </div>
    </div>
  );
};

export default NavBar;
