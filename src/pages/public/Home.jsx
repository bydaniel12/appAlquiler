import medidorLuz from "../../assets/medidorluz.webp";

export const Home = () => {
  return (
    <div className="container mx-auto px-8 py-8">
      {/* Resumen de la app */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-bold mb-2 text-black">
          ¿Qué puedes hacer con esta app?
        </h2>
        <p className="text-black mb-2">
          Gestiona alquileres de inmuebles de forma sencilla y eficiente.
          Registra inquilinos, agrega y consulta pagos mensuales, calcula montos
          de servicios luz (puedes registrar los kilowats de tu medidor), agua,
          internet, busca boletas por rango de fechas y envía detalles por
          WhatsApp. Además, cuenta con registro de usuarios y control de acceso
          por roles (admin/usuario) para mayor seguridad. Todo integrado con
          Firebase y una interfaz moderna en React.
        </p>
        <p className="text-black mb-2">
          Cuando se crea un nuevo inquilino tienes la opcion de habilitar
          medidor de luz y registrar los kilowats con el que esta comenzando el
          inquilino.
        </p>
        <div className="flex justify-center">
          <img
            src={medidorLuz}
            alt="Medidor de luz"
            className="w-40 h-auto rounded shadow"
          />
        </div>
      </div>
    </div>
  );
};
