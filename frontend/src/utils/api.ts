import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
    throw new Error("BACKEND_URL is not defined in environment variables");
}

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log(error);
        if (error.code === "ERR_NETWORK") {
            console.log("Server nedostupný nebo nejsi online");

            window.location.href = `/offline`;
            return;
        }

        if (error.response?.status === 401) {
            console.log("Neplatný token – přesměrovávám na signin");
            window.location.href = `/signin`;
            return;
        }

        return Promise.reject(error);
    }
);

export default api;
