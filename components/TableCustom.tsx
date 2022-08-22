import Table, { Icolumn, Irow, ItableStyle } from "react-tailwind-table";
import "react-tailwind-table/dist/index.css";

import Moment from "react-moment";
import "moment/locale/id";

import {
	TiBusinessCard,
	TiDownloadOutline,
	TiEdit,
	TiTrash,
	TiTickOutline,
	TiTick,
	TiTimes,
} from "react-icons/ti";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { Users } from "types";
import { HTMLInputTypeAttribute } from "react";

export type HeadersType = {
	name: string;
	text: string;
	type?: HTMLInputTypeAttribute;
	hide?: boolean;
};

type TableCustomProps = {
	headers: HeadersType[];
	data: Array<Users>;
	page: string;
	tableHeader?: string;
	noContentMessage?: string;
	detailClick?: (row: Irow) => void;
	statusClick?: (row: Irow, aktif: boolean) => void;
	editClick?: (row: Irow) => void;
	hapusClick?: (row: Irow) => void;
	terimaClick?: (row: Irow) => void;
	tolakClick?: (row: Irow) => void;
};

const TableCustom = (props: TableCustomProps) => {
	const columns: Icolumn[] = props.headers.map((header) => {
		return {
			field: header.name,
			use: header.text,
			use_in_display: !header.hide,
		};
	});

	const rows: Irow[] = props.data.map((val, idx) => {
		return { no: idx + 1, ...val };
	});

	const style: ItableStyle = {
		base_bg_color: "bg-green-700",
		base_text_color: "text-green-600",
		table_head: {
			table_data: "bg-secondary",
		},
	};

	const rowcheck = (row: Irow, column: Icolumn, display_value: any) => {
		if (column.field === "createdAt" || column.field === "updatedAt") {
			return (
				<Moment format="llll" locale="id">
					{display_value.toString()}
				</Moment>
			);
		} else if (column.field === "total") {
			return Intl.NumberFormat("id-ID", {
				style: "currency",
				currency: "IDR",
				minimumFractionDigits: 0,
			}).format(row.jumlah * row.harga);
		} else if (column.field === "bulan") {
			return display_value.length > 1
				? `${display_value[0]} - ${display_value[display_value.length - 1]}`
				: display_value[0];
		} else if (column.field === "foto") {
			return (
				<a href={display_value.toString()} target="_blank">
					<img src={display_value.toString()} width="50" />
				</a>
			);
		} else if (column.field === "status") {
			return display_value === true ? (
				<div className="tooltip" data-tip="Pembayaran di Terima">
					<TiTick color="green" size={25} />
				</div>
			) : (
				<div className="tooltip" data-tip="Pembayaran di Tolak">
					<TiTimes color="red" size={25} />
				</div>
			);
		} else if (column.field === "aktif") {
			return display_value === undefined ? (
				<div className="badge badge-sm badge-warning w-32 text-white">
					Belum di Aktifkan
				</div>
			) : display_value === true ? (
				<div className="badge badge-sm badge-success w-32">Aktif</div>
			) : (
				<div className="badge badge-sm badge-error w-32">Tidak Aktif</div>
			);
		} else if (column.field === "konfirmasi") {
			return (
				<div className="flex gap-2">
					<div className="tooltip" data-tip="Terima Pembayaran">
						<label
							onClick={() => {
								props.terimaClick!(row);
							}}
							htmlFor="my-modal-aksi"
							className="btn btn-sm btn-outline btn-success text-white"
						>
							<TiTick size={18} />
						</label>
					</div>
					<div className="tooltip" data-tip="Tolak Pembayaran">
						<label
							onClick={() => {
								props.tolakClick!(row);
							}}
							htmlFor="my-modal-aksi"
							className="btn btn-sm btn-outline btn-error text-white"
						>
							<TiTimes size={18} />
						</label>
					</div>
				</div>
			);
		} else if (column.field === "aksi") {
			return (
				<div
					className={`dropdown dropdown-left ${row.no != 1 && "dropdown-end"}`}
				>
					<label tabIndex={0} className="btn btn-sm btn-ghost m-1">
						<IoEllipsisHorizontal color="green" size={18} />
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-60"
					>
						<li>
							<label onClick={() => props.detailClick!(row)}>
								<TiBusinessCard color="green" size={18} /> Detail {props.page}
							</label>
						</li>
						<li>
							<a
								download
								href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/qrcode/${row._id}`}
							>
								<TiDownloadOutline color="blue" size={18} /> Download QR Code
							</a>
						</li>
						<li>
							{row.aktif === true ? (
								<label
									onClick={() => props.statusClick!(row, false)}
									htmlFor="my-modal-aksi"
								>
									<TiTimes color="red" size={18} /> Non Aktifkan
								</label>
							) : (
								<label
									onClick={() => props.statusClick!(row, true)}
									htmlFor="my-modal-aksi"
								>
									<TiTickOutline color="green" size={18} /> Aktifkan
								</label>
							)}
						</li>
						<li>
							<label
								onClick={() => props.editClick!(row)}
								htmlFor="my-modal-form"
							>
								<TiEdit color="orange" size={18} /> Ubah Data {props.page}
							</label>
						</li>
						<li>
							<label
								onClick={() => props.hapusClick!(row)}
								htmlFor="my-modal-aksi"
							>
								<TiTrash color="red" size={18} /> Hapus Data {props.page}
							</label>
						</li>
					</ul>
				</div>
			);
		} else if (column.field == "aksi2") {
			return (
				<div className="flex gap-2">
					<div className="tooltip" data-tip="Ubah Rekening">
						<label
							onClick={() => {
								props.editClick!(row);
							}}
							htmlFor="my-modal-form"
							className="btn btn-sm btn-outline btn-warning text-white"
						>
							<TiEdit size={18} />
						</label>
					</div>
					<div className="tooltip" data-tip="Hapus Rekening">
						<label
							onClick={() => {
								props.hapusClick!(row);
							}}
							htmlFor="my-modal-aksi"
							className="btn btn-sm btn-outline btn-error text-white"
						>
							<TiTrash size={18} />
						</label>
					</div>
				</div>
			);
		}

		return display_value;
	};

	return (
		<Table
			table_header={props.tableHeader}
			columns={columns}
			rows={rows}
			row_render={rowcheck}
			per_page={7}
			no_content_text={props.noContentMessage ?? "Tidak ada data"}
			styling={style}
			should_export={false}
		/>
	);
};

export default TableCustom;
