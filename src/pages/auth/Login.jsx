import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthProvider";

export const Login = () => {
  const { login } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msgError, setMsgError] = useState("");
  const navigate = useNavigate();

  /*
  const RegistrarUsuario = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, user, pass)
      .then((userCredential) => {
        // loguearse
        const user = userCredential.user;
        setMsgError("");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setMsgError("Formato del Email incorrecto");
        }
        if (error.code === "auth/weak-password") {
          setMsgError("El Password debe tener 6 caracteres o mas");
        }
      });
  };
  */

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
        </form>
      </div>
    </div>
  );
};
