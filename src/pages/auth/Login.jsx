import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";

export const Login = () => {
  const { login } = useAuth();
  const [msgError, setMsgError] = useState("");

  const [formData, setFormData] = useState(() => {
    return {
      email: "",
      password: "",
    };
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    setMsgError("");
    try {
      await login(formData.email, formData.password);
      //Se redirige al usuario con la ruta protegida a /Inicio
    } catch (err) {
      setMsgError(err.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLoginUser}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Inicia Sesión</h2>
          <div className="my-6">
            <label htmlFor="email" className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-3 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                Email
              </span>
            </label>
          </div>
          <div className="my-6">
            <label htmlFor="password" className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-3 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                Contraseña
              </span>
            </label>
          </div>
          <input
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer mt-3"
            value="Inicia sesión"
            type="submit"
          />
          {msgError !== "" ? (
            <div className="text-red-500 mt-3 text-center font-semibold">
              {msgError}
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
};
