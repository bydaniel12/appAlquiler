import { NavLink } from "react-router";
import { useAuth } from "../context/AuthProvider";

export const MenuItems = ({ mobile }) => {
  const { currentUser } = useAuth();
  return (
    <div className={`${mobile ? "space-y-1" : "hidden md:flex space-x-4"}`}>
      {currentUser ? (
        <>
          <NavLink
            className="px-3 py-2 rounded-md text-sm font-medium md:text-gray-700 md:hover:bg-gray-100 md:hover:text-gray-900 max-md:block max-md:text-gray-900 max-md:hover:bg-gray-200"
            to="/inquilino"
            end
          >
            Inquilinos
          </NavLink>
          <NavLink
            className="px-3 py-2 rounded-md text-sm font-medium md:text-gray-700 md:hover:bg-gray-100 md:hover:text-gray-900 max-md:block max-md:text-gray-900 max-md:hover:bg-gray-200"
            to="/search-payment"
            end
          >
            Buscar Boletas x Fecha
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/"
            end
            className="px-3 py-2 rounded-md text-sm font-medium md:text-gray-700 md:hover:bg-gray-100 md:hover:text-gray-900 max-md:block max-md:text-gray-900 max-md:hover:bg-gray-200"
          >
            <span className="">Inicio</span>
          </NavLink>
        </>
      )}
    </div>
  );
};
