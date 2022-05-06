import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import UserService from "@/services/user";
import { Users } from "types";

const DetailUser = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Users>();

  const router = useRouter();
  const { pid } = router.query;

  useEffect(() => {
    UserService.get(pid as string).then((user) => {
      setUser(user.data);

      setLoading(false);
    });
  }, []);

  const listDetail = [
    {
      label: "Nama",
      value: user?.nama,
    },
    {
      label: "Nomor KTM",
      value: user?.ktm,
    },
    {
      label: "NIK",
      value: user?.nik,
    },
    {
      label: "Nomor Telepon",
      value: user?.telpon,
    },
    {
      label: "Alamat",
      value: user?.alamat,
    },
  ];

  return (
    <div className="container outline outline-1 outline-gray-300 rounded p-2">
      <label className="font-bold my-4">Detail User</label>
      <div className="card card-compact lg:w-96 bg-base-100 shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-3 gap-6">
            {listDetail.map((detail) => (
              <>
                <div>{detail.label}</div>
                <div>:</div>
                <div>{detail.value}</div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

DetailUser.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(null, null)(DetailUser);
