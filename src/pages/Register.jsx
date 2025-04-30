import React, { useContext, useState } from "react";
import "../styles/Auth.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const { register } = useContext(AuthContext);

  const handleSignup = (e) => {
    e.preventDefault();
    const signUpForm = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      mobile: mobile,
    };
    register(signUpForm);
  };

  return (
    <div className="auth-section">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="auth-field">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            autoFocus
          />
          <div className="auth-icons" title="name">
            <FontAwesomeIcon icon={faUser} />
          </div>
        </div>
        <div className="auth-field">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div className="auth-icons" title="email">@</div>
        </div>
        <div className="auth-field">
          <input
            type={hidePassword ? "password" : "text"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={8}
          />
          <div className="auth-icons" title={hidePassword ? "show password" : "hide password"} onClick={() => setHidePassword(!hidePassword)}>
            <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} />
          </div>
        </div>
        <div className="auth-field">
          <input
            type="number"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
            required
            minLength={7}
          />
          <div className="auth-icons" title="mobile number">
            <FontAwesomeIcon icon={faPhone} />
          </div>
        </div>
        <button type="submit" className="auth-btn">
          Register
        </button>
      </form>
      <div className="auth-option">
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Register;