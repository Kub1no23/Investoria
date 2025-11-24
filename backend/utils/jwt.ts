import jwt, { SignOptions } from "jsonwebtoken";
import { jwtPayload } from "../../types/auth";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const signJWT = (payload: jwtPayload, expiresIn: string | number) => {
    const token = jwt.sign(payload, jwtSecret, { expiresIn } as SignOptions);
    return token;
}
const verifyJWT = (token: string): jwtPayload => {
    try {
        const payload = jwt.verify(token, jwtSecret) as jwtPayload;
        return payload;
    } catch (err) {
        throw new Error("Invalid token");
    }
}

export { signJWT, verifyJWT };