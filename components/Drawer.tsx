import React from "react";
import { withRouter, NextRouter } from "next/router";

import Link from "next/link";
import { FaHome, FaUserTie, FaUsers, FaShoppingBasket } from "react-icons/fa";

interface WithRouterProps {
  router: NextRouter;
}

interface MyComponentProps extends WithRouterProps {}

type MenuType = {
  path: string;
  text: string;
  icon: any;
};

class Drawer extends React.Component<MyComponentProps> {
  state = {
    menuActive: "/admin",
  };

  componentDidMount() {
    this.handleChange(this.props.router.asPath);
  }

  handleChange = (path: string) => {
    this.setState({ menuActive: path });
  };

  render() {
    const listMenu: MenuType[] = [
      {
        text: "Home",
        path: "/admin",
        icon: <FaHome />,
      },
      {
        text: "Data Agen",
        path: "/admin/agen",
        icon: <FaUserTie />,
      },
      {
        text: "Data User",
        path: "/admin/user",
        icon: <FaUsers />,
      },
      {
        text: "Data Transaksi",
        path: "/admin/transaksi",
        icon: <FaShoppingBasket />,
      },
    ];

    return (
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto lg:w-72 w-80 bg-secondary text-white">
          {listMenu.map((menu: MenuType, index) => (
            <li key={index}>
              <Link href={menu.path}>
                <a
                  className={
                    this.state.menuActive == menu.path ? "bg-primary" : ""
                  }
                  onClick={() => {
                    this.handleChange(menu.path);
                  }}
                >
                  {menu.icon}
                  {menu.text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(Drawer);
