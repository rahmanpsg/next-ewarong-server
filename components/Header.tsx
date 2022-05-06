import AuthService from "@/services/auth";
import Router from "next/router";
import { IoMenu, IoExitOutline } from "react-icons/io5";

const Header = () => {
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log(error);
    }
    Router.replace("/");
  };

  return (
    <div className="navbar bg-secondary text-white">
      <div className="flex-none">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost drawer-button swap swap-rotate"
        >
          <input type="checkbox" />

          <IoMenu size={24} />
        </label>
      </div>
      <div className="flex-1">
        <a className="normal-case text-xl">E-Warong</a>
      </div>
      <div className="flex-none">
        <a className="btn btn-ghost gap-2" onClick={logout}>
          Keluar
          <IoExitOutline size={24} />
        </a>
      </div>
    </div>
  );
};

export default Header;
