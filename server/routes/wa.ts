import express from "express";
import {
	createSession,
	getSession,
	deleteSession,
	sendMessage,
	formatPhone,
} from "../whatsapp";

const router = express.Router();

const MSG_STARTED = "Whatsapp Bot Telah Berjalan";
const MSG_STOPED = "Whatsapp Bot Telah Dimatikan";
const MSG_NOT_STARTED = "Whatsapp Bot Belum Berjalan";

router.get("/", async (_, res) => {
	const message = getSession() == null ? MSG_NOT_STARTED : MSG_STARTED;

	res.status(200).send({
		error: false,
		message,
		run: getSession() != null,
	});
});

router.post("/send", async (_, res) => {
	try {
		const session = getSession();

		console.log(session);

		if (session == null) {
			res.status(400).send({
				error: true,
				message: "Session belum berjalan",
			});
		} else {
			const response = await sendMessage(
				session,
				formatPhone("+6285255136996"),
				"Tes bosku"
			);

			res.status(200).send({
				error: false,
				message: response,
			});
		}
	} catch (error) {
		res.status(400).send({
			error: true,
			message: error,
		});
	}
});

router.post("/run", async (_: any, res) => {
	if (getSession() != null) {
		res.status(200).send({
			error: false,
			message: MSG_STARTED,
		});
	} else {
		return await createSession(res);
	}
});

router.post("/stop", async (_, res) => {
	const session = getSession();
	if (session != null) {
		session.logout();
		deleteSession();

		res.status(200).send({
			error: false,
			message: MSG_STOPED,
			run: false,
		});
	} else {
		res.status(200).send({
			error: false,
			message: MSG_NOT_STARTED,
			run: false,
		});
	}
});

export default router;
