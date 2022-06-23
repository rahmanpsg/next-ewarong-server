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
	const [loadingTransaksi, setLoadingTransaksi] = useState(true);
	const [user, setUser] = useState<Users>();
	const [listTransaksi, setListTransaksi] = useState<any[]>([]);
	const [pendapatan, setPendapatan] = useState(0);
	const [tahun, setTahun] = useState<number>(new Date().getFullYear());
	const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);

	const router = useRouter();
	const { pid } = router.query;

	useEffect(() => {
		if (!pid) {
			router.replace("/admin/agen");
			return;
		}

		UserService.get(pid as string).then((user) => {
			setUser(user.data);

			setLoading(false);
		});

		getListTransaksi(tahun, bulan);
	}, []);

	const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		let _tahun: number = tahun;
		let _bulan: number = bulan;

		if (name === "tahun") {
			setTahun(Number(value));
			_tahun = Number(value);
		} else if (name === "bulan") {
			setBulan(Number(value));
			_bulan = Number(value);
		}

		getListTransaksi(_tahun, _bulan);
	};

	const getListTransaksi = async (tahun: number, bulan: number) => {
		setListTransaksi([]);

		setLoadingTransaksi(true);

		const transaksis = await PesananService.getAllTransaksi(
			"agen",
			pid as string,
			tahun,
			bulan
		);

		setListTransaksi(transaksis.data.transaksi);
		setPendapatan(transaksis.data.pendapatan);
		setLoadingTransaksi(false);
	};

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
	];

	const headers: HeadersType[] = [
		{ name: "no", text: "#" },
		{ name: "updatedAt", text: "Tanggal" },
		{ name: "user.nama", text: "User" },
		{ name: "sembako.nama", text: "Pesanan" },
		{ name: "jumlah", text: "Jumlah" },
		{ name: "total", text: "Total" },
	];

	// generate list tahun
	const listTahun = () => {
		const tahun = new Date().getFullYear();
		const list = [];
		for (let i = tahun; i >= 2020; i--) {
			list.push(i);
		}
		return list;
	};

	// generate list bulan
	const listBulan = [
		{ label: "Januari", value: 1 },
		{ label: "Februari", value: 2 },
		{ label: "Maret", value: 3 },
		{ label: "April", value: 4 },
		{ label: "Mei", value: 5 },
		{ label: "Juni", value: 6 },
		{ label: "Juli", value: 7 },
		{ label: "Agustus", value: 8 },
		{ label: "September", value: 9 },
		{ label: "Oktober", value: 0 },
		{ label: "November", value: 1 },
		{ label: "Desember", value: 2 },
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
				<div className="flex md:flex-row flex-col gap-2 justify-between">
					<label className="basis-1/9 font-bold prose">
						<h3>Daftar Transaksi</h3>
					</label>
					<div className="basis-1/3">
						{loadingTransaksi && (
							<div className="flex items-center space-x-2 space-y-2 animate-pulse">
								<div></div>
								<div className="w-4 h-4 bg-primary rounded-full"></div>
								<div className="w-4 h-4 bg-primary rounded-full"></div>
								<div className="w-4 h-4 bg-primary rounded-full"></div>
							</div>
						)}
					</div>
					<div className="basis-1/4">
						<select
							className="select select-bordered w-full"
							name="tahun"
							value={tahun}
							onChange={handleChangeFilter}
						>
							<option disabled>Filter Tahun</option>
							{listTahun().map((tahun, i) => (
								<option key={i} value={tahun}>
									{tahun}
								</option>
							))}
						</select>
					</div>
					<div className="basis-1/4">
						<select
							className="select select-bordered w-full"
							name="bulan"
							value={bulan}
							onChange={handleChangeFilter}
						>
							<option disabled>Filter Bulan</option>
							{listBulan.map((bulan, i) => (
								<option key={i} value={bulan.value}>
									{bulan.label}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="card card-compact">
					<div className="card-body">
						<TableCustom
							page="Transaksi User"
							headers={headers}
							data={listTransaksi}
							tableHeader={
								loadingTransaksi
									? undefined
									: `Pendapatan : ${formatRupiah(pendapatan)}`
							}
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
