import Account from "./account";
import NavLinks from "./nav-links";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between sticky top-4">
      <div className="overflow-y-scroll ">
        <Account />
        <NavLinks />
      </div>
    </div>
  );
};

export default Sidebar;
