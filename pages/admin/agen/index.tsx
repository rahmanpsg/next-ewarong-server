import React, {
	useState,
	useEffect,
	useRef,
	ReactElement,
	FormEvent,
} from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Layout from "@/components/Layout";

import {
	getAgens,
	addAgen,
	editAgen,
	deleteAgen,
	setStatusAgen,
	resetAgen,
} from "@/store/agen/action";

import Alert from "@/components/Alert";
import TableCustom, { HeadersType } from "@/components/TableCustom";
import ModalDetail from "@/components/ModalDetail";
import ModalForm from "@/components/ModalForm";
import ModalAksi from "@/components/ModalAksi";

import { IoAddCircle, IoWarning } from "react-icons/io5";

import { State, AgenState } from "@/types";
import { Irow } from "react-tailwind-table";

type PelangganProps = {
	agenState: AgenState;
	getAgens: () => void;
	addAgen: (formData: FormData) => void;
	editAgen: (formData: FormData, id: string) => void;
	deleteAgen: (id: string) => void;
	setStatusAgen: (status: boolean, id: string) => void;
	resetAgen: () => void;
};

const Pelanggan = (props: PelangganProps) => {
	const [loading, setLoading] = useState(false);
	const [idAgenSelected, setIdAgenSelected] = useState(undefined);
	const [aksi, setAksi] = useState("");
	const [messageAksi, setMessageAksi] = useState("");
	const [showMessage, setShowMessage] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const modalDetailRef = useRef<HTMLInputElement>(null);
	const modalFormRef = useRef<HTMLInputElement>(null);
	const modalAksiRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (!props.agenState.agens.length) setLoading(true);
		props.getAgens();
	}, []);

	useEffect(() => {
		if (loading) {
			setLoading(false);
		}

		if (props.agenState.errors !== null) return;

		if (aksi == "") return;

		if (modalFormRef.current?.checked) {
			modalFormRef.current?.click();
		} else if (modalAksiRef.current?.checked) {
			modalAksiRef.current?.click();
		}

		if (showMessage) return;

		setShowMessage(true);

		setTimeout(() => {
			setShowMessage(false);
			props.resetAgen();
		}, 4000);
	}, [props.agenState]);

	useEffect(() => {
		switch (aksi) {
			case "hapus":
				setMessageAksi("Data agen akan di hapus?");
				break;
			case "aktif":
				setMessageAksi("Data agen akan di aktifkan?");
				break;
			case "nonaktif":
				setMessageAksi("Data agen akan di nonaktifkan?");
				break;
		}
	}, [aksi]);

	const submitForm = async (e?: FormEvent) => {
		e?.preventDefault();

		const data = new FormData(formRef.current!);

		try {
			setLoading(true);
			switch (aksi) {
				case "tambah":
					props.addAgen(data);
					break;
				case "edit":
					props.editAgen(data, idAgenSelected!);
					break;
				case "hapus":
					props.deleteAgen(idAgenSelected!);
					break;
				case "aktif":
					props.setStatusAgen(true, idAgenSelected!);
					break;
				case "nonaktif":
					props.setStatusAgen(false, idAgenSelected!);
					break;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const tambahClick = () => {
		if (props.agenState.error) props.resetAgen();
		formRef.current!.reset();
		setAksi("tambah");

		for (let index = 0; index < formRef.current?.children.length!; index++) {
			const input = formRef.current?.children.item(index)?.children.item(1);
			input?.removeAttribute("value");
		}
	};

	const statusClick = (row: Irow, aktif: boolean) => {
		setIdAgenSelected(row._id);
		setAksi(aktif ? "aktif" : "nonaktif");
	};

	const editClick = (row: Irow) => {
		if (props.agenState.error) props.resetAgen();
		formRef.current!.reset();
		setAksi("edit");

		setIdAgenSelected(row._id);

		for (let index = 0; index < formRef.current?.children.length!; index++) {
			const input = formRef.current?.children.item(index)?.children.item(1);
			input?.setAttribute("value", row[input.getAttribute("name")!]);
		}
	};

	const hapusClick = (row: Irow) => {
		setIdAgenSelected(row._id);
		setAksi("hapus");
	};

	const detailClick = (row: Irow) => {
		router.push(`/admin/agen/${row._id}`);
	};

	const headers: HeadersType[] = [
		{
			name: "no",
			text: "#",
		},

		{
			name: "nama",
			text: "Nama",
			type: "text",
		},
		{
			name: "namaToko",
			text: "Nama Toko",
			type: "text",
		},
		{
			name: "telpon",
			text: "Telpon",
			type: "tel",
		},
		{
			name: "username",
			text: "Username",
			type: "text",
			hide: true,
		},
		{
			name: "password",
			text: "Password",
			type: "password",
			hide: true,
		},
		{
			name: "alamat",
			text: "Alamat",
			type: "text",
		},
		{
			name: "createdAt",
			text: "Tanggal Daftar",
		},
		{
			name: "aktif",
			text: "Status",
		},
		{
			name: "aksi",
			text: "Aksi",
		},
	];

	return (
		<div className="container outline outline-1 outline-gray-300 rounded p-2">
			<div className="flex md:flex-row flex-col gap-2 justify-between">
				<label
					htmlFor="my-modal-form"
					className="btn btn-success btn-outline gap-1"
					onClick={tambahClick}
				>
					<IoAddCircle size={20} />
					Tambah Agen
				</label>

				{loading && (
					<div className="flex items-center space-x-2 animate-pulse">
						<div className="w-8 h-8 bg-primary rounded-full"></div>
						<div className="w-8 h-8 bg-primary rounded-full"></div>
						<div className="w-8 h-8 bg-primary rounded-full"></div>
					</div>
				)}

				{showMessage && !loading && (
					<Alert
						error={props.agenState.error}
						message={props.agenState.message!}
						className="max-w-xs animate-backInOutRight alert-sm"
					/>
				)}
			</div>

			<TableCustom
				page="Agen"
				headers={headers}
				data={props.agenState.agens}
				detailClick={detailClick}
				statusClick={statusClick}
				editClick={editClick}
				hapusClick={hapusClick}
			/>

			<ModalDetail modalRef={modalDetailRef} id={idAgenSelected} />

			<ModalForm
				page="Agen"
				modalRef={modalFormRef}
				formRef={formRef}
				state={props.agenState}
				headers={headers}
				aksi={aksi}
				loading={loading}
				submitForm={submitForm}
			/>

			<ModalAksi
				modalRef={modalAksiRef}
				icon={<IoWarning size={50} className="text-warning" />}
				message={messageAksi}
				loading={loading}
				submit={submitForm}
			/>
		</div>
	);
};

const mapStateToProps = (state: State) => ({
	agenState: state.agenState,
});

const mapActionsToProps = {
	getAgens,
	addAgen,
	editAgen,
	deleteAgen,
	setStatusAgen,
	resetAgen,
};

Pelanggan.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default connect(mapStateToProps, mapActionsToProps)(Pelanggan);
