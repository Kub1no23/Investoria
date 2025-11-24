import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../../utils/jwt";
import { jwtPayload } from "../../../types/auth";

type alteredReq = Request & { user?: jwtPayload };

const authMiddleware = (req: alteredReq, res: Response, next: NextFunction) => {
    const token = req.cookies["jwt"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const payload = verifyJWT(token);
        req.user = payload;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export default authMiddleware;
