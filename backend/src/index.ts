
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import authMiddleware from "../src/middleware/authMiddleware";

dotenv.config();
const app = express();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use(authMiddleware);

app.get('/protected', (req, res) => {
    res.json({ message: "This is a protected route" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});