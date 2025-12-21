import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Assets = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/api/auth/signout"
            );

            console.log(res);
            navigate("/signin");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <p>Assets</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Sign out</button>
            </form>
        </div>
    );
}

export default Assets;