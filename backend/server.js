import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//cors options and cors config

app.use(
  cors({
    origin: "https://social-media-app-assignment.vercel.app"|| "http://localhost:5173",
    credentials: true,
  })
);

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

app.listen(port, () => {
  console.log("listening on port ", port);
});
