import React, { createContext, useContext, useEffect, useState } from 'react'
import { AlertContext } from './AlertContext';
import axios from 'axios';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../services/firebase';

export const ForgotContext = createContext();

export function ForgotProvider({ children }) {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const { setAlert, setAlertMessage } = useContext(AlertContext);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "reset-recaptcha-container",
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

    useEffect(() => {
        setMobile(prev => prev.startsWith("+") ? prev : `+${prev}`);
    }, [mobile])

    const sendOTP = async () => {

        if (!mobile || !newPassword) {
            setAlert("warn");
            setAlertMessage("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`, { mobile });
            const remaining = res.data.remainingAttempts;
            setupRecaptcha();
            const result = await signInWithPhoneNumber(auth, mobile, window.recaptchaVerifier);
            setConfirmationResult(result);
            setStep(2);
            setAlert("success")
            setAlertMessage(`OTP sent. Attempts left: ${remaining}`);
            startResendTimer();
        } catch (err) {
            setAlert("failed")
            setAlertMessage(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            setLoading(true);
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken();
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/verify-password`, { mobile, newPassword, idToken });
            setAlert("success")
            setAlertMessage('Password reset successfully');
        } catch (err) {
            setAlert("failed")
            setAlertMessage(err.response?.data?.message || 'Failed to reset password');
            setLoading(true);
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
        <ForgotContext.Provider value={{ mobile, setMobile, newPassword, setNewPassword, sendOTP, resetPassword, otp, setOtp, handleResendOTP, loading, resendTimer, canResend, step }}>
            {children}
        </ForgotContext.Provider>
    )
}