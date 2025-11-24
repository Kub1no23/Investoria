import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPassword = async (password: string) => {
    try {
        const password_hash = await bcrypt.hash(password, saltRounds);
        return password_hash;
    } catch (err) {
        throw new Error("Bcrypt hash failed:", err as Error);
    }
};

const comparePassword = async (password: string, hash: string) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (err) {
        throw new Error("Bcrypt compare failed:", err as Error);
    }
};

export { hashPassword, comparePassword };
