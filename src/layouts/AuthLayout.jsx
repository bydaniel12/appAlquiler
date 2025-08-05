import { Link, Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { Menu } from "../components/Menu.jsx";
import { Footer } from "../components/Footer.jsx";

export const AuthLayout = () => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/inquilino" replace />;
  }

  return (
    <div>
      <header>
        <Menu />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
