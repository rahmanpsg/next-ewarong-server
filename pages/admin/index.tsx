import { connect } from "react-redux";
import Layout from "@/components/Layout";

import { ReactElement } from "react";
import { FaStore, FaUsers } from "react-icons/fa";

import { wrapper } from "@/store/store";

type HomeProps = {
  total: {
    agen: number;
    user: number;
  };
};

const Home = (props: HomeProps) => {
  return (
    <div className="container grid grid-flow-row auto-rows-max gap-8 sm:justify-items-center">
      <div className="sm:overflow-visible overflow-auto">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaStore size={50} />
            </div>
            <div className="stat-title">Agen</div>
            <div className="stat-value">{props.total.agen}</div>
            <div className="stat-desc">Total</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <FaUsers size={50} />
            </div>
            <div className="stat-title">User</div>
            <div className="stat-value">{props.total.user}</div>
            <div className="stat-desc">Total</div>
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
