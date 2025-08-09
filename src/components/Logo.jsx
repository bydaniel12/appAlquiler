import { useNavigate } from "react-router";

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a9229bba-9f2f-4838-b8e4-6e23be7376f5.png"
        alt="Logotipo de la empresa - diseño moderno con gradiente azul y letras blancas"
        className="h-10 w-10 rounded"
      />
      <span className="ml-2 text-xl font-bold text-gray-800">AppRental</span>
    </div>
  );
};
