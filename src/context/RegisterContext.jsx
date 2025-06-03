import { useState, useEffect, createContext, useContext } from 'react'
import axios from "axios";
import { auth } from "../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { AlertContext } from "./AlertContext";
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const RegisterContext = createContext();

export function RegisterProvider({ children }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "", otp: "" });
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const { setAlert, setAlertMessage } = useContext(AlertContext);
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate();

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // Setup invisible reCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container", // container ID
                {
                    size: "invisible",
                    // callback: (response) => {
                    //     console.log("reCAPTCHA solved:", response);
                    // },
                },
            );

            try {
                if (auth && auth.settings) {
                    if (window.location.hostname === "localhost") {
                        // Disable reCAPTCHA in localhost for testing
                        auth.settings.appVerificationDisabledForTesting = true;
                        // console.log("Test mode: app verification disabled");
                    } else {
                        // Enable reCAPTCHA in production for security
                        auth.settings.appVerificationDisabledForTesting = false;
                        // console.log("Production mode: reCAPTCHA enabled");
                    }
                }
            } catch (err) {
                console.warn("Could not set appVerificationDisabledForTesting:", err);
            }
        }
    };

    const startResendTimer = () => {
        setResendTimer(30);
        setCanResend(false);
    };

    useEffect(() => {
        let intervalId;
        if (resendTimer > 0) {
            intervalId = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [resendTimer]);

    const sendOTP = async () => {
        const { name, email, password, mobile } = form;

        if (!name || !email || !password || !mobile) {
            setAlert("warn");
            setAlertMessage("Please fill all fields.");
            return;
        }

        if (password.length < 6) {
            setAlert("warn");
            setAlertMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const preCheckResponse = await axios.post(
                `${SERVER_URL}/auth/validate-user`,
                {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    mobile: "+" + mobile,
                }
            );
            const remaining = preCheckResponse.data.remainingAttempts;

            if (!preCheckResponse.data.valid) {
                setAlert("failed");
                setAlertMessage(preCheckResponse.data.message);
                return;
            }

            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = "+" + mobile;

            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setStep(2);
            setAlert("success")
            setAlertMessage(`OTP sent. Attempts left: ${remaining}`);
            startResendTimer();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.message;
            setAlert("failed");
            setAlertMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };


    const verifyOTPAndRegister = async () => {
        try {
            setLoading(true);

            const result = await confirmationResult.confirm(form.otp);
            const idToken = await result.user.getIdToken();
            const verifyMobile = "+" + form.mobile;

            const sanitizedData = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                mobile: verifyMobile,
                idToken,
            };

            const response = await axios.post(
                `${SERVER_URL}/auth/register`,
                sanitizedData,
                { withCredentials: true }
            );

            setAlert("success");
            setAlertMessage("Registered successfully!");
            const user = response.data.user;
            setUser(user);
            navigate("/");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setAlert("failed");
            setAlertMessage("Error verifying OTP or registering: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (canResend) {
            await sendOTP();
            setResendTimer(30);
            setCanResend(false);
        }
    };

    return (
        <RegisterContext.Provider value={{ step, form, setForm, loading, resendTimer, canResend, verifyOTPAndRegister, sendOTP, handleResendOTP }}>
            {children}
        </RegisterContext.Provider>
    )
}