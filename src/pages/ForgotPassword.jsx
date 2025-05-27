import React, { useContext, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ForgotContext } from '../context/ForgotContext';
// import { auth, RecaptchaVerifier, signInWithPhoneNumber } from './firebaseConfig';

const ForgotPassword = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const {
    mobile,
    setMobile,
    newPassword,
    setNewPassword,
    sendOTP,
    resetPassword,
    otp,
    setOtp,
    handleResendOTP,
    loading,
    resendTimer,
    canResend,
    step
  } = useContext(ForgotContext);

  return (
    <div className="auth-section">
      <h1>Forgot Password</h1>
      {step === 1 && (
        <div className="auth-form">
          <div className="auth-field">
            <PhoneInput
              country={'in'}
              value={mobile}
              onChange={(mobile) => setMobile(mobile)}
              inputProps={{
                name: 'mobile',
                required: true,
              }}
              inputStyle={{ width: '100%' }}
              required
              disabled={loading}
            />
            <div className="auth-icons" title="mobile number">
              <FontAwesomeIcon icon={faPhone} />
            </div>
          </div>
          <div className="auth-field">
            <input
              type={hidePassword ? "password" : "text"}
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="auth-icons" title={hidePassword ? "show password" : "hide password"} onClick={() => setHidePassword(!hidePassword)}>
              <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} />
            </div>
          </div>
          <div id="reset-recaptcha-container"></div>
          <button onClick={sendOTP} disabled={loading} className="auth-btn">{loading ? "Sending OTP..." : "Send OTP"}</button>
        </div>
      )}

      {step === 2 && (
        <div className="auth-form">
          <div className="auth-field">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="auth-btn-container">
            <button onClick={resetPassword} disabled={loading} className="auth-btn">
              {loading ? "Verifying..." : "Verify & Reset"}
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

      <div className="auth-option">
        <p>Don't have an account ?</p>
        <Link to="/register">Register</Link>
      </div>
      <div className="auth-option">
        <p>Back to login ?</p>
        <Link to="/login">Click here</Link>
      </div>

    </div>
  );
};

export default ForgotPassword;