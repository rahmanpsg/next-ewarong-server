import Router from "next/router";
import Image from "next/image";

const Landing = () => {
  const login = async () => {
    Router.replace("/login");
  };

  return (
    <div>
      <div className="navbar bg-primary">
        <div className="flex-none">
          <label className="btn btn-ghost drawer-button swap swap-rotate">
            <Image src="/images/logo.png" width="50" height="50"></Image>
          </label>
        </div>
        <div className="flex-1">
          <a className="normal-case text-xl text-white">
            Dinas Sosial Kota Parepare - Sulawesi Selatan
          </a>
        </div>
        <div className="flex-none">
          <button className="btn btn-ghost gap-2 text-white" onClick={login}>
            Masuk
          </button>
        </div>
      </div>
      <div className="mb-auto">
        <div className="p-4">
          <div className="flex justify-center items-center space-x-2">
            Selamat Datang di Website Dinas Sosial Kota Parepare - Sulawesi
            Selatan
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
