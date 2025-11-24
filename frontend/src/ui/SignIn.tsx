import { useState } from "react";
//import { useNavigate } from "react-router-dom";

type MySignUpParams = {
    email: string;
    password: string;
};



const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: MySignUpParams = {
                email,
                password
            };

            const result = await fetch("http://localhost:3000/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log("Výsledek přihlášení:", await result.json());
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