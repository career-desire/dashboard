import axios from "axios";
import { getAccessToken, refreshAccessToken, setAccessToken } from "./authService";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/resume`,
    withCredentials: true,
});

// Attach access token to requests
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

// Handle expired token in API responses
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

// Save resume function
export const saveResume = async (resume, setAlert, setAlertMessage, setResume) => {
    try {
        const response = await API.post("/", resume);
        setAlert("success");
        setAlertMessage("Resume Saved!");
        setResume(response.data);
        return response.data;
    } catch (error) {
        setAlert("failure");
        setAlertMessage("Resume Not Saved!");
        throw error.response?.data?.message || "Failed to save resume.";
    }
};

//get every resume of the user
export const getAllResumes = async (setResumes) => {
    try {
        const response = await API.get("/");
        setResumes(response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch resumes.";
    }
};

//Get particular resume
export const getResumeById = async (id) => {
    try {
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch resume.";
    }
};

//Update function
export const updateResume = async (id, updatedResume, setAlert, setAlertMessage, setResume) => {
    try {
        const response = await API.put(`/${id}`, updatedResume);
        setAlert("success")
        setAlertMessage("Resume Updated!")
        setResume(response.data)
        return response.data;
    } catch (error) {
        setAlert("failure")
        setAlertMessage("Resume Not Updated!")
        throw error.response?.data?.message || "Failed to update resume.";
    }
};

//Delete function
export const deleteResume = async (id) => {
    try {
        const response = await API.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete resume.";
    }
};
