import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRouter = ({ children }) => {
  const { currentUser, loading } = useAuth();

  console.log("ProtectedRouter currentUser:", currentUser);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
