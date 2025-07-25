import { useAuth } from "../../context/AuthProvider";

export const Inquilino = () => {
  const { currentUser } = useAuth();
  return (
    <div className="container">
      <h1>Inquilino {currentUser.email}</h1>
      {/* Aquí puedes agregar más contenido relacionado con el inquilino */}
    </div>
  );
};
