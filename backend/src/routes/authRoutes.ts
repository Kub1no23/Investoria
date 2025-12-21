import { Router } from "express";
import { prisma } from "../../utils/prisma";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { UserSignUp, UserSignIn } from "../../../types/auth";
import { signJWT, verifyJWT } from "../../utils/jwt";

const router = Router();

router.post("/signup", async (req, res) => {
    const { username, fullname, email, password }: UserSignUp = req.body;

    try {
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username: username,
                fullname: fullname,
                email: email,
                password_hash: passwordHash
            }
        });

        const token = signJWT({ userId: user.user_id, email }, "4h");
        res.cookie("jwt", token, {
            httpOnly: true,
            //secure: true,
            sameSite: "strict"
        });
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        return res.status(400).json({ message: "User creation failed" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password }: UserSignIn = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                user_id: true,
                password_hash: true
            }
        });

        if (user === null) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = signJWT({ userId: user.user_id, email }, "4h");
        res.cookie("jwt", token, {
            httpOnly: true,
            //secure: true,
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Sign in successful" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

router.get("/verify-token", (req, res) => {
    const token = req.cookies["jwt"];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const payload = verifyJWT(token);

        return res.status(200).json({ message: "Token is valid" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

router.post("/signout", (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        //secure: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: "Signed out successfully" });
});

export default router;