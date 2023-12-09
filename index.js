import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mysql from "mysql";
import userRouter from "./routes/user.router.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

export const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "internship",
});

app.use("/", userRouter);

const port = 4000;
app.listen(port, () => {
  console.log("Server is running on Port :", port);
});
