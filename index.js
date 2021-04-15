const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const usersRouter = require("./routes/users");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("login_users.json");
const login_users = low(adapter);

login_users.defaults({ users: [] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.login_users = login_users;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", usersRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))