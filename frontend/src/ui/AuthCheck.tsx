import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                console.log("Checking auth...");
                await api.get("/api/auth/verify-token");

                navigate("/assets");
            } catch (err) {
                console.log("AuthCheck error:", err);
                navigate("/signin");
            }
        };

        verify();
    }, []);

    return <p>Kontroluji přihlášení...</p>;
};

export default AuthCheck;