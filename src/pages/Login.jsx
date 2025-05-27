import React, { useContext, useState } from "react";
import "../styles/Auth.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const loginForm = {
      email: email.toLowerCase().trim(),
      password: password.trim(),
    };
    login(loginForm);
  };

  return (
    <div className="auth-section">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="auth-icons" title="email">@</div>
        </div>
        <div className="auth-field">
          <input
            type={hidePassword ? "password" : "text"}
            name="password"
            placeholder="Password"
            minLength={8}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="auth-icons" title={hidePassword ? "show password" : "hide password"} onClick={() => setHidePassword(!hidePassword)}>
            <FontAwesomeIcon icon={hidePassword ? faEye : faEyeSlash} />
          </div>
        </div>
        <button type="submit" className="auth-btn">Login</button>
      </form>
      <div className="auth-option">
        <p>Don't have an account?</p>
        <Link to="/register">Register</Link>
      </div>
      <div className="auth-option">
        <Link to="/forgot-password">Forgot password</Link>
      </div>
    </div>
  );
}

export default Login;