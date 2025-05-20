import { useState, useEffect, useContext } from "react";
import { auth } from "../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { AlertContext } from "../context/AlertContext";
import "../styles/Auth.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function RegisterWithOTP() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "", otp: "" });
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const { setAlert, setAlertMessage } = useContext(AlertContext);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // Setup invisible reCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container", // container ID
                {
                    size: "invisible",
                    callback: (response) => {
                        console.log("reCAPTCHA solved:", response);
                    },
                },
            );

            try {
                if (auth && auth.settings) {
                    if (window.location.hostname === "localhost") {
                        // Disable reCAPTCHA in localhost for testing
                        auth.settings.appVerificationDisabledForTesting = true;
                        console.log("Test mode: app verification disabled");
                    } else {
                        // Enable reCAPTCHA in production for security
                        auth.settings.appVerificationDisabledForTesting = false;
                        console.log("Production mode: reCAPTCHA enabled");
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

        if (!/^\d{10}$/.test(mobile)) {
            setAlert("warn");
            setAlertMessage("Enter a valid 10-digit mobile number.");
            return;
        }

        if (password.length < 6) {
            setAlert("warn");
            setAlertMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            setupRecaptcha();

            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = "+91" + mobile;

            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setStep(2);
            setAlert("success");
            setAlertMessage("OTP sent successfully!");
            startResendTimer();
        } catch (error) {
            console.error(error);
            setAlert("failure");
            setAlertMessage("Error sending OTP: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTPAndRegister = async () => {
        try {
            setLoading(true);

            const result = await confirmationResult.confirm(form.otp);
            const idToken = await result.user.getIdToken();
            const verifyMobile = form.mobile.startsWith("+91") ? form.mobile : `+91${form.mobile}`;

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
            console.log("User:", response.data.user);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setAlert("failure");
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
        <div className="auth-section">
            <h2>Register</h2>

            {step === 1 && (
                <div className="auth-form">
                    <div className="auth-field">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            disabled={loading}
                        />
                        <div className="auth-icons" title="name">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                    <div className="auth-field">
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            disabled={loading}
                        />
                        <div className="auth-icons" title="email">@</div>
                    </div>
                    <div className="auth-field">
                        <input
                            type={hidePassword ? "password" : "text"}
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            disabled={loading}
                        />
                        <div className="auth-icons" title={hidePassword ? "show password" : "hide password"} onClick={() => setHidePassword(!hidePassword)}>
                            <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} />
                        </div>
                    </div>
                    <div className="auth-field">
                        <input
                            type="tel"
                            placeholder="Mobile (10 digits)"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            disabled={loading}
                        />
                        <div className="auth-icons" title="mobile number">
                            <FontAwesomeIcon icon={faPhone} />
                        </div>
                    </div>
                    <button onClick={sendOTP} disabled={loading} className="auth-btn">
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="auth-form">
                    <div className="auth-field">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={form.otp}
                            onChange={(e) => setForm({ ...form, otp: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="auth-btn-container">
                        <button onClick={verifyOTPAndRegister} disabled={loading} className="auth-btn">
                            {loading ? "Verifying..." : "Verify & Register"}
                        </button>
                        {resendTimer > 0 ? (
                            <p>Resend OTP in: {resendTimer} seconds</p>
                        ) : (
                            <button onClick={handleResendOTP} disabled={!canResend || loading} className="auth-btn">
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div id="recaptcha-container" />

            <div className="auth-option">
                <p>Already have an account?</p>
                <Link to="/login">Login</Link>
            </div>
        </div>
    );
}