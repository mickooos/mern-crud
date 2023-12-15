import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLI_PORT,
  })
);
app.use(router);

app.listen(PORT, () => {
  console.log(`Server Running @ PORT ${PORT}...`);
});
