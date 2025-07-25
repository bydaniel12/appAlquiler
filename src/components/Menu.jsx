import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Logo } from "./Logo";
import { MenuItems } from "./MenuItems";

import { useAuth } from "../context/AuthProvider";
import { BtnMenuItems } from "./BtnMenuItems";

export const Menu = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex">
              <MenuItems mobile={false} />
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú</span>
                {isOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <BtnMenuItems mobile={false} />
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "block opacity-100 h-auto" : "hidden opacity-0 h-0"
        }`}
      >
        <div className="pt-2 pb-3 space-y-1 px-4">
          <MenuItems mobile={true} />
          <BtnMenuItems mobile={true} />
        </div>
      </div>
    </div>
  );
};
