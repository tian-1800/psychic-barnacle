import Account from "./account";
import NavLinks from "./nav-links";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between">
      <div className="overflow-y-scroll sticky top-4  ">
        <Account />
        <NavLinks />
      </div>
    </div>
  );
};

export default Sidebar;
