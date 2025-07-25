import { NavLink } from "react-router";
import { useAuth } from "../context/AuthProvider";

export const MenuItems = ({ mobile }) => {
  const { currentUser } = useAuth();
  const commonClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const normalClasses = `${commonClasses} text-gray-700 hover:bg-gray-100 hover:text-gray-900`;
  const mobileClasses = `${commonClasses} block text-gray-900 hover:bg-gray-200`;

  return (
    <div className={`${mobile ? "space-y-1" : "hidden md:flex space-x-4"}`}>
      {currentUser ? (
        <>
          <NavLink
            className={mobile ? mobileClasses : normalClasses}
            to="/inquilino"
          >
            Inquilinos
          </NavLink>

          <NavLink
            className={mobile ? mobileClasses : normalClasses}
            to="/BusquedaxDni"
          >
            Busca tu recibo x DNI
          </NavLink>
          <NavLink
            className={mobile ? mobileClasses : normalClasses}
            to="/BusquedaxFecha"
          >
            Busca tu recibo x Fecha
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/"
            end
            className={mobile ? mobileClasses : normalClasses}
          >
            <span className="">Inicio</span>
          </NavLink>
        </>
      )}
    </div>
  );
};
