import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import UserService from "@/services/user";
import PesananService from "@/services/pesanan";
import { Users } from "types";
import TableCustom, { HeadersType } from "@/components/TableCustom";

const DetailUser = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<Users>();
	const [listTransaksi, setListTransaksi] = useState<any[]>([]);

	const router = useRouter();
	const { pid } = router.query;

	useEffect(() => {
		if (!pid) {
			router.replace("/admin/user");
			return;
		}

		UserService.get(pid as string).then((user) => {
			setUser(user.data);

			setLoading(false);
		});

		PesananService.getAllTransaksi("user", pid as string).then((transaksis) => {
			setListTransaksi(transaksis.data);
		});
	}, []);

	const formatRupiah = (angka: number) => {
		return Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(angka);
	};

	const listDetail = [
		{
			label: "Nama",
			value: user?.nama,
		},
		{
			label: "Nomor KPM",
			value: user?.kpm,
		},
		// {
		//   label: "NIK",
		//   value: user?.nik,
		// },
		{
			label: "Nomor Telepon",
			value: user?.telpon,
		},
		{
			label: "Alamat",
			value: user?.alamat,
		},
		{
			label: "Saldo",
			value: formatRupiah(user?.saldo!),
		},
	];

	const headers: HeadersType[] = [
		{ name: "no", text: "#" },
		{ name: "updatedAt", text: "Tanggal" },
		{ name: "agen.nama", text: "Agen" },
		{ name: "sembako.nama", text: "Pesanan" },
		{ name: "jumlah", text: "Jumlah" },
		{ name: "total", text: "Total" },
	];

	return (
		<div className="container space-y-4">
			<div className="outline outline-1 outline-gray-300 rounded p-2">
				<label className="font-bold prose my-4">
					<h3>Detail User</h3>
				</label>
				<div className="card card-compact">
					<div className="card-body">
						{loading && (
							<div className="flex items-center space-x-2 animate-pulse">
								<div className="w-8 h-8 bg-primary rounded-full"></div>
								<div className="w-8 h-8 bg-primary rounded-full"></div>
								<div className="w-8 h-8 bg-primary rounded-full"></div>
							</div>
						)}
						{!loading &&
							listDetail.map((detail, i) => (
								<div
									key={i}
									className="grid grid-cols-[150px_minmax(50px,_1fr)_900px]"
								>
									<div>{detail.label}</div>
									<div>:</div>
									<div>{detail.value}</div>
								</div>
							))}
					</div>
				</div>
			</div>

			<div className="outline outline-1 outline-gray-300 rounded p-2">
				<label className="font-bold prose my-4">
					<h3>Transaksi User</h3>
				</label>
				<div className="card card-compact">
					<div className="card-body">
						<TableCustom
							page="Transaksi User"
							headers={headers}
							data={listTransaksi}
						/>
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
