import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { config } from "./config.js";
import { db } from "./db/database.js";
import authRouter from "./router/auth.js";

dotenv.config();

const app = express();

const corsOption = {
  origin: "*",
  optionsSuccessStatus: 200,
};

//사용할 미들웨어 세팅
app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));

//route로 연결
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

db.getConnection().then(console.log);
app.listen(config.port);
