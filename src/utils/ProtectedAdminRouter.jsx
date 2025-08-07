import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";

export const ProtectedAdminRouter = ({ children }) => {
  const { currentUser, getUser } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser && getUser) {
        const data = await getUser(currentUser.uid);
        setUserRole(data.role);
      }
      setLoading(false);
    };
    fetchRole();
  }, [currentUser, getUser]);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!currentUser || userRole !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};
