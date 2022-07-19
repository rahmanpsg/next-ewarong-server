import axios from "axios";
import AuthService from "@/services/auth";
import Router from "next/router";
import { IoMenu, IoExitOutline, IoLogoWhatsapp } from "react-icons/io5";
import { useState } from "react";
import QRCode from "react-qr-code";

const Header = () => {
	const [loading, setLoading] = useState(true);
	const [waStatus, setWaStatus] = useState("Silahkan scan barcode");
	const [qr, setQr] = useState("");

	const runWhatsapp = async () => {
		try {
			setLoading(true);

			const res = await axios.post("wa/run");

			setLoading(false);

			console.log(res.data);

			setWaStatus(res.data.message);

			setQr(res.data.qr ?? "");
		} catch (error: any) {
			console.log(error);
			setWaStatus("Gagal menjalankan whatsapp");

			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.log(error);
		}
		Router.replace("/");
	};

	return (
		<div className="navbar bg-secondary text-white">
			<div className="flex-none">
				<label
					htmlFor="my-drawer"
					className="btn btn-ghost drawer-button swap swap-rotate"
				>
					<input type="checkbox" />

					<IoMenu size={24} />
				</label>
			</div>
			<div className="flex-1">
				<a className="normal-case text-xl">E-Warong</a>
			</div>
			<div className="flex-none">
				<div className="dropdown dropdown-end">
					<label
						tabIndex={0}
						className="btn btn-ghost rounded-btn gap-2"
						onClick={runWhatsapp}
					>
						Whatsapp
						<IoLogoWhatsapp size={24} />
					</label>
					<div
						tabIndex={0}
						className="card compact dropdown-content shadow bg-base-100 rounded-box w-64"
					>
						<div className="card-body text-black">
							{loading && (
								<div className="flex items-center space-x-2 animate-pulse">
									<div className="w-8 h-8 bg-primary rounded-full"></div>
									<div className="w-8 h-8 bg-primary rounded-full"></div>
									<div className="w-8 h-8 bg-primary rounded-full"></div>
								</div>
							)}

							{!loading && (
								<div>
									<h2 className="card-title">{waStatus}</h2>
									{qr != "" && (
										<p>
											<QRCode value={qr} size={128} />
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
				<a className="btn btn-ghost gap-2" onClick={logout}>
					Keluar
					<IoExitOutline size={24} />
				</a>
			</div>
		</div>
	);
};

export default Header;
