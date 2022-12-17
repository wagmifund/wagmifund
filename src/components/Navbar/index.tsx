import MenuItems from "@components/Navbar/Menuitems";

const NavBar = () => (
  <div className="navbar h-8 bg-slate-900 text-white flex justify-between">
    <div className="flex justify-evenly">
      <div className="ml-10">wagmi fund</div>
    </div>
    <MenuItems />
  </div>
);

export default NavBar;
