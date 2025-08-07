import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebaseconfig";
import { setDoc, doc } from "firebase/firestore";
import { UserRegisterForm } from "./UserRegisterForm";

export const Login = () => {
  const { login } = useAuth();
  const auth = getAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msgError, setMsgError] = useState("");
  const [showUserRegisterForm, setShowUserRegisterForm] = useState(false);

  const handleLoginUser = (e) => {
    e.preventDefault();
    try {
      if (user === "") {
        setMsgError("Ingrese el email con formato correcto");
        return;
      } else if (pass === "") {
        setMsgError("Ingrese la contraseña");
        return;
      } else {
        setMsgError("");
        login(user, pass);
        //Se redirige al usuario con la ruta protegida a /Inicio
      }
    } catch (err) {
      setMsgError(err.message);
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
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              onChange={(e) => {
                setUser(e.target.value);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Introduce el email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              Contraseña
            </label>
            <input
              onChange={(e) => {
                setPass(e.target.value);
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Introduce la contraseña"
              name="password"
              type="password"
            />
          </div>
          <input
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
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

          <div
            className="cursor-pointer"
            onClick={() => {
              setShowUserRegisterForm(true);
            }}
          >
            Crear nuevo usuario
          </div>
        </form>
      </div>

      {showUserRegisterForm && (
        <UserRegisterForm
          onClose={() => {
            setShowTenantForm(false);
            setEditTenant(null);
          }}
        ></UserRegisterForm>
      )}
    </div>
  );
};
