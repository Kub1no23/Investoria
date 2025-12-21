import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

type MySignInParams = {
    email: string;
    password: string;
};



const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: MySignInParams = {
                email,
                password
            };

            const res = await api.post(
                "/api/auth/signin",
                payload
            );

            console.log(res);
            navigate("/assets");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Přihlašuji..." : "Přihlásit se"}
                </button>
            </form>
        </>
    );
}

export default SignIn;