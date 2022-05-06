import Image from "next/image";
import Link from "next/link";
import { IoLogInOutline } from "react-icons/io5";

const Landing = () => {
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
          <Link href="/login">
            <a className="btn btn-ghost gap-2 text-white">
              Masuk <IoLogInOutline size={24} />
            </a>
          </Link>
        </div>
      </div>
      <div className="hero h-80">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Selamat Datang</h1>
            <p className="mb-5">
              Website Dinas Sosial Kota Parepare - Sulawesi Selatan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
