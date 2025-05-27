import axios from "axios";
import { checkLoginStatus, getAccessToken, refreshAccessToken, setAccessToken } from "./authService";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/cover-letter`,
    withCredentials: true
});

API.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            console.warn("Access token expired. Refreshing...");
            const newToken = await refreshAccessToken();
            if (newToken) {
                setAccessToken(newToken);
                checkLoginStatus();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axios(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export const saveCoverLetter = async (coverLetter, setAlert, setAlertMessage) => {
    try {
        const response = await API.post("/", coverLetter);
        setAlert("success");
        setAlertMessage("Cover Letter Saved!");
        return response.data
    } catch (error) {
        setAlert("failed")
        setAlertMessage("Cover Letter Not Saved!");
        throw error.response?.data?.message || "Failed to save resume.  "
    }
}

export const getAllCoverLetter = async (setCoverLetter) => {
    try {
        const response = await API.get("/");
        setCoverLetter(response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch cover letter.";
    }
}

export const getCoverLetterById = async (id) => {
    try {
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch cover letter.";
    }
}

export const updateCoverLetter = async (id, updatedCoverLetter, setAlert, setAlertMessage, setCoverLetter) => {
    try {
        const response = await API.put(`/${id}`, updatedCoverLetter);
        setAlert("success");
        setAlertMessage("Cover Letter Updated!");
        setCoverLetter(response.data);
        return response.data;
    } catch (error) {
        setAlert("failed")
        setAlertMessage("Cover Letter Not Updated!")
        throw error.response?.data?.message || "Failed to update cover letter"
    }
}

export const deleteCoverLetter = async (id) => {
    try {
        const response = await API.delete(`${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete cover letter.";
    }
}