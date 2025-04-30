// This component handle authentication like login, logout, register and restore sessions

import { createContext, useContext, useEffect, useState } from "react";
import { checkLoginStatus, loginUser, logoutUser, registerUser } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertContext } from "./AlertContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { setAlert, setAlertMessage } = useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      const userData = await checkLoginStatus(setToken);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const register = async (registerForm) => {
    try {
      const registerData = await registerUser(registerForm);
      if (registerData?.accessToken) {
        setToken(registerData.accessToken);
        setUser(registerData.user);
        setAlert("success")
        setAlertMessage("Register successfully!")
        navigate("/");
      }
    } catch (error) {
      console.error("Registration failed:", error.message || error);
      setAlert("failed")
      setAlertMessage(`${error.message || error}!`)
      throw new Error(error.message || "Registration failed. Please try again.");
    }
  };

  const login = async (loginForm) => {
    try {
      const loginData = await loginUser(loginForm, setToken);
      if (loginData.accessToken) {
        setToken(loginData.accessToken);
        setUser(loginData.user)
        setAlert("success")
        setAlertMessage("Login successfully!")

        const redirectPath = location.state?.from || "/";
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error.message || error);
      setAlert("failed")
      setAlertMessage(`${error.message || error}!`)
      console.log(error)
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setToken(null);
      setAlert("success");
      setAlertMessage("Logout successfully!");
      navigate("/");
    } catch (error) {
      setAlert("failed")
      setAlertMessage(`${error.message || error}!`)
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
