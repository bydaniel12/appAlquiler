import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div>
      <h1>404 - Pagina no encontrada</h1>
      <p>La pagina que intentas visualizar no existe</p>
      <Link to="/">Ir a inicio</Link>
    </div>
  );
};
