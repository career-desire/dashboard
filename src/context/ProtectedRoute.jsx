// This component protect particular route from unauthorized access

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="site-loader">
      <div className="loader"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
