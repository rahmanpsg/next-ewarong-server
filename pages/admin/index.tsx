import { connect } from "react-redux";
import Layout from "@/components/Layout";

import { ReactElement } from "react";
import { IoStorefront, IoPeople, IoBagHandle } from "react-icons/io5";

import Image from "next/image";

import { wrapper } from "@/store/store";

type HomeProps = {
  total: {
    agen: number;
    user: number;
    transaksi: number;
  };
};

const Home = (props: HomeProps) => {
  return (
    <div className="container grid grid-flow-row auto-rows-max gap-8 sm:justify-items-center">
      <div className="sm:overflow-visible overflow-auto ">
        <div className="stats shadow">
          <div className="stat bg-secondary text-white">
            <div className="stat-figure text-white">
              <IoStorefront size={50} />
            </div>
            <div className="stat-title">Agen</div>
            <div className="stat-value">{props.total.agen}</div>
            <div className="stat-desc">Total</div>
          </div>

          <div className="stat bg-secondary text-white">
            <div className="stat-figure text-white">
              <IoPeople size={50} />
            </div>
            <div className="stat-title">User</div>
            <div className="stat-value">{props.total.user}</div>
            <div className="stat-desc">Total</div>
          </div>

          <div className="stat bg-secondary text-white">
            <div className="stat-figure text-white">
              <IoBagHandle size={50} />
            </div>
            <div className="stat-title">Transaksi</div>
            <div className="stat-value">{props.total.transaksi}</div>
            <div className="stat-desc">Total</div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Image src="/images/logo.png" width="200" height="200"></Image>
      </div>
      <div className="card bg-secondary">
        <div className="card-body ">
          <div className="prose text-center">
            <h2 className="text-white">Selamat Datang Website Dinas Sosial</h2>
            <h2 className="text-white">
              Aplikasi Transaksi Keluarga Penerima Manfaat (KPM) Program Sembako
              Kota Parepare
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  // @ts-ignore
  (store) => async () => {
    const END_POINT = process.env.baseURL + "api/total/";
    const res = await fetch(END_POINT);

    const json = await res.json();

    return {
      props: {
        total: json.total,
      },
    };
  }
);

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(null, null)(Home);
