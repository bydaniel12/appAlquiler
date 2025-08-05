import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRouter = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};
