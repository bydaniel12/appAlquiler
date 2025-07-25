import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router";

export const BtnMenuItems = ({ mobile }) => {
  const { currentUser, logout } = useAuth();
  return (
    <>
      {currentUser ? (
        <Link
          onClick={logout}
          className="max-md:block max-md:text-center max-md:w-full max-md:mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
        >
          Cerrar sesion
        </Link>
      ) : (
        <Link
          to="/auth/login"
          className="max-md:block max-md:text-center max-md:w-full max-md:mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Ir al login
        </Link>
      )}
    </>
  );
};
