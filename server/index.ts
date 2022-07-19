import next, { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createServer } from "http";
// import { init } from "./whatsapp";

require("dotenv").config();

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const appNext = next({ dev });
const handle: NextApiHandler = appNext.getRequestHandler();

const database = require("./config/database");
require("./config/cloudinary");

appNext.prepare().then(() => {
	const app = require("./app");
	const server = createServer(app);

	// Fallback handler
	app.get("*", (req: NextApiRequest, res: NextApiResponse) => {
		return handle(req, res);
	});

	// Connect to mongodb
	database.connect();

	server.listen(port, () => {
		console.log(
			`> Server listening at http://localhost:${port} as ${
				dev ? "development" : process.env.NODE_ENV
			}`
		);

		// setTimeout(() => {
		// 	// init whatsapp
		// 	init();
		// }, 1000);
	});
});
