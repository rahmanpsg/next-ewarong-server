import { existsSync, mkdirSync, unlinkSync, readdir } from "fs";
import { join } from "path";
import { Boom } from "@hapi/boom";
import makeWASocket, {
	fetchLatestBaileysVersion,
	useMultiFileAuthState,
	makeInMemoryStore,
	DisconnectReason,
	Browsers,
	delay,
	AnyMessageContent,
} from "@adiwajshing/baileys";

import { Response } from "express";

const sessionId = "ewarong";
const sessions = new Map();
const retries = new Map();

const init = () => {
	if (!existsSync(__dirname + "/sessions")) {
		mkdirSync(__dirname + "/sessions", { recursive: true });
	}

	readdir(join(__dirname, "sessions"), (err, files) => {
		if (err) throw err;

		if (files.length > 0) {
			createSession();
		}
	});
};

const sessionsDir = (fullPath = false) => {
	return join(
		__dirname,
		"sessions",
		fullPath ? `${sessionId}_session.json` : ""
	);
};

const shouldReconnect = () => {
	let maxRetries = parseInt(process.env.MAX_RETRIES! ?? 0);
	let attempts = retries.get(sessionId) ?? 0;

	maxRetries = maxRetries < 1 ? 1 : maxRetries;

	if (attempts < maxRetries) {
		++attempts;

		console.log("Reconnecting...", { attempts, sessionId });
		retries.set(sessionId, attempts);

		return true;
	}

	return false;
};

const createSession = async (res: Response | null = null) => {
	const store = makeInMemoryStore({});

	const { state, saveCreds: saveState } = await useMultiFileAuthState(
		sessionsDir()
	);

	const { version, isLatest } = await fetchLatestBaileysVersion();

	console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

	const waConfig = {
		version,
		auth: state,
		printQRInTerminal: false,
		browser: Browsers.ubuntu("Chrome"),
	};

	const wa = makeWASocket(waConfig);

	store.readFromFile(sessionsDir(true));
	store.bind(wa.ev);

	wa.ev.on("creds.update", saveState);

	wa.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;

		console.log("Status Wa Bot: ", connection);

		if (connection === "open") {
			retries.delete(sessionId);
			sessions.delete(sessionId);

			sessions.set(sessionId, { ...wa, store });

			if (res && !res.headersSent) {
				res.status(200).send({
					error: false,
					message: "Whatsapp Bot Telah Berjalan",
				});
			}
		}

		if (connection === "close") {
			const statusCode = (lastDisconnect!.error as Boom)?.output?.statusCode;

			if (statusCode === DisconnectReason.loggedOut || !shouldReconnect()) {
				if (res && !res.headersSent) {
					res.status(500).send({
						error: true,
						message: "Gagal membuat sesi",
					});
				}

				return deleteSession();
			}

			setTimeout(
				() => {
					createSession(res);
				},
				statusCode === DisconnectReason.restartRequired
					? 0
					: parseInt(process.env.RECONNECT_INTERVAL! ?? 0)
			);
		}

		if (update.qr) {
			if (res && !res.headersSent) {
				try {
					const qr = update.qr;

					res.status(200).send({
						error: false,
						message: "Silahkan scan QR Code",
						qr,
					});
				} catch {
					res.status(500).send({
						error: true,
						message: "Gagal membuat QR Code",
					});
				}

				return;
			}

			try {
				await wa.logout();
			} catch {
			} finally {
				deleteSession();
			}
		}
	});
};

const getSession = () => {
	return sessions.get(sessionId) ?? null;
};

const deleteSession = () => {
	readdir(join(__dirname, "sessions"), (err, files) => {
		if (err) throw err;

		for (let file of files) {
			unlinkSync(join(__dirname, "sessions", file));
		}
	});

	sessions.delete(sessionId);
	retries.delete(sessionId);
};

const sendMessage = async (session: any, jid: string, text: string) => {
	try {
		await delay(1000);

		const message: AnyMessageContent = {
			text: text,
		};

		return session.sendMessage(jid, message);
	} catch {
		return Promise.reject(null);
	}
};

const formatPhone = (phone: string) => {
	if (phone.startsWith("0")) {
		phone = "+62" + phone.substring(1);
	}

	if (phone.endsWith("@s.whatsapp.net")) {
		return phone;
	}

	let formatted = phone.replace(/\D/g, "");

	return (formatted += "@s.whatsapp.net");
};

export {
	init,
	createSession,
	getSession,
	deleteSession,
	sendMessage,
	formatPhone,
};
