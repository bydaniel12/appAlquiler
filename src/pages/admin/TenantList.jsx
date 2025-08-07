import { useEffect, useState } from "react";
import { useFireStore } from "../../context/FireStoreProvider";
import { useAuth } from "../../context/AuthProvider";
import { TenantForm } from "./TenantForm";
import { useNavigate } from "react-router";
import { FormatDate } from "../../utils/FormatDate";

export const TenantList = () => {
  const { getTenants, deleteTenant, getPayments } = useFireStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTenants = async () => {
      const fetchedTenants = await getTenants();
      setTenants(fetchedTenants);
    };
    fetchTenants();
  }, [currentUser, getTenants]);

  const handleDelete = async (tenantId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este inquilino y todos sus pagos?"
    );
    if (!confirmDelete) return;
    try {
      setIsLoading(true);
      await deleteTenant(tenantId);
      setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting tenant:", error);
    }
  };

  const handleGoToPayments = (tenant) => {
    navigate(`/payments/${tenant.id}`, {
      state: {
        name: tenant.name,
        rent: tenant.rent,
        phone: tenant.phone,
        lightMeter: tenant.lightMeter,
        numberKilowatsInit: tenant.numberKilowatsInit,
      },
    });
  };

  return (
    <div className="container mx-auto max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Inquilinos</h2>
        <button
          onClick={() => setShowTenantForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Agregar
        </button>
      </div>

      {showTenantForm && (
        <TenantForm
          onClose={() => {
            setShowTenantForm(false);
            setEditTenant(null);
          }}
          onTenantAdd={(newTenant) => {
            if (editTenant && editTenant.id) {
              setTenants(
                tenants.map((t) => (t.id === newTenant.id ? newTenant : t))
              );
            } else {
              setTenants([...tenants, newTenant]);
            }
            setShowTenantForm(false);
            setEditTenant(null);
          }}
          beanEditTenant={editTenant}
        ></TenantForm>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden items-center text-center">
        {tenants.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No hay inquilinos registrados.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <li
                key={tenant.id}
                className="p-4 mt-4 bg-sky-100 rounded-2xl hover:bg-sky-200 hover:rounded-2xl"
              >
                <button
                  onClick={() => handleDelete(tenant.id)}
                  className="text-red-500 relative cursor-pointer float-end text-xl font-semibold -top-3 w-5"
                >
                  {isLoading ? (
                    <div className="fixed inset-0 bg-gray-400/70 text-black flex justify-center items-center">
                      Eliminando...
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-black z-99"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <>x</>
                  )}
                </button>
                <div className="flex justify-center items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {tenant.name} - {tenant.dni}
                    </h3>
                    <p className="text-gray-800">
                      <span className="font-semibold">
                        Numero Medidor de luz inicial:{" "}
                      </span>
                      {tenant.lightMeter ? (
                        <span>{tenant.numberKilowatsInit}</span>
                      ) : (
                        <span>No tiene</span>
                      )}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">telefono: </span>
                      {tenant.phone}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Dirección: </span>{" "}
                      {tenant.address}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Renta Mensual: </span>
                      {" S/ "}
                      {tenant.rent}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Garantia: </span>
                      {" S/ "}
                      {tenant.warranty}
                    </p>
                    {tenant.comment && (
                      <p className="text-gray-800">
                        <span className="font-semibold">Comentario: </span>{" "}
                        {tenant.comment}
                      </p>
                    )}

                    <p className="text-gray-800">
                      <span className="font-semibold">Fecha de Ingreso: </span>{" "}
                      {FormatDate(tenant.dateInit)}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Fecha de Salida: </span>{" "}
                      {FormatDate(tenant.dateFin)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-1 mt-4">
                  <button
                    onClick={() => {
                      setShowTenantForm(true);
                      setEditTenant(tenant);
                    }}
                    className="bg-blue-500 text-white px-2 py-2 max-sm:py-0 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Actualizar
                  </button>

                  <button
                    onClick={() => handleGoToPayments(tenant)}
                    className="bg-black text-white px-2 py-1 rounded hover:bg-gray-900 cursor-pointer"
                  >
                    Boletas
                  </button>
                  {/* Botón WhatsApp */}
                  <a
                    href={`https://wa.me/51${
                      tenant.phone
                    }?text=${encodeURIComponent(
                      `*Detalle de Habitación Alquilada*\n` +
                        `- Nombre: ${tenant.name}\n` +
                        `- DNI: ${tenant.dni}\n` +
                        `- Teléfono: ${tenant.phone}\n` +
                        `- Renta Mensual: ${tenant.rent}\n` +
                        `- Garantía: ${tenant.warranty}\n` +
                        `- Nota: ${tenant.comment}\n` +
                        `- Fecha de Ingreso: ${FormatDate(tenant.dateInit)}\n` +
                        `- Fecha de Salida: ${FormatDate(tenant.dateFin)}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-1 py-1 rounded hover:bg-green-600 cursor-pointer flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12c0 5.385 4.365 9.75 9.75 9.75 2.064 0 3.98-.632 5.563-1.713l3.187.85a.75.75 0 00.927-.927l-.85-3.187A9.708 9.708 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.125 13.125c-.75 1.125-2.25 1.125-3 0-.75-1.125-2.25-1.125-3 0"
                      />
                    </svg>
                    Enviar Whatsapp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
