import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../styles/Auth.css"
import { RegisterContext } from "../context/RegisterContext";
import PhoneInput from "react-phone-input-2";

export default function Register() {
    const [hidePassword, setHidePassword] = useState(true);
    const { step, form, setForm, loading, resendTimer, canResend, verifyOTPAndRegister, sendOTP, handleResendOTP } = useContext(RegisterContext);

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
                            required
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
                            required
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
                            required
                        />
                        <div className="auth-icons" title={hidePassword ? "show password" : "hide password"} onClick={() => setHidePassword(!hidePassword)}>
                            <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} />
                        </div>
                    </div>
                    <div className="auth-field">
                        <PhoneInput
                            country={'in'}
                            value={form.mobile}
                            onChange={(phone) => setForm({ ...form, mobile: phone })}
                            inputProps={{
                                disabled: loading,
                                name: 'mobile',
                                required: true,
                            }}
                            inputStyle={{ width: '100%' }}
                            required
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
                            required
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