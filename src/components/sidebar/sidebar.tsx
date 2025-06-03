import Account from "./account";
import Plan from "./plan";
import NavLinks from "./nav-links";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-between">
      <div className="overflow-y-scroll sticky top-4  ">
        <Account />
        <NavLinks />
      </div>
      <Plan />
    </div>
  );
};

export default Sidebar;
