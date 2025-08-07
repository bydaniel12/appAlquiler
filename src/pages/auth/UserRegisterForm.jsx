import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthProvider";

export const UserRegisterForm = () => {
  const navigate = useNavigate();
  const { registerUserWithRole } = useAuth();
  const [msgError, setMsgError] = useState("");
  const [formData, setFormData] = useState(() => {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      roles: "user",
      fecha: new Date(),
    };
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const RegistrarUsuario = (e) => {
    e.preventDefault();
    setMsgError("");
    registerUserWithRole(
      formData.email,
      formData.password,
      formData.roles,
      formData.name,
      formData.phone
    )
      .then(() => {
        navigate("/inquilino");
        setMsgError("");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setMsgError("Formato del Email incorrecto");
        }
        if (error.code === "auth/weak-password") {
          setMsgError("El Password debe tener 6 caracteres o mas");
        }
        if (error.message) {
          setMsgError(error.message);
        }
      });
  };

  return (
    <div className=" flex items-center justify-center p-4 font-sans">
      <div className="bg-white py-5 px-7 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">Registrar usuario</h2>
        <form onSubmit={RegistrarUsuario}>
          <div className="my-4">
            <label htmlFor="name" className="relative">
              <input
                type="text"
                name="name"
                id="name"
                placeholder=""
                value={formData.name}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Nombres
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="email" className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Email
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="password" className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Contraseña
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="phone" className="relative">
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder=""
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                maxLength={9}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Telefono
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer mb-2"
          >
            Registrar usuario
          </button>
        </form>
      </div>
    </div>
  );
};
