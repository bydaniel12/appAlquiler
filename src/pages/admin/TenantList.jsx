import { useEffect, useState } from "react";
import { useFireStore } from "../../context/FireStoreProvider";
import { useAuth } from "../../context/AuthProvider";
import { TenantForm } from "./TenantForm";
import { useNavigate } from "react-router";

export const TenantList = () => {
  const { getTenants, deleteTenant, getPayments } = useFireStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [editTenant, setEditTenant] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTenants = async () => {
      const fetchedTenants = await getTenants();
      setTenants(fetchedTenants);
    };
    fetchTenants();
  }, [currentUser, getTenants]);

  const handleDelete = async (tenantId) => {
    try {
      await deleteTenant(tenantId);
      setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
    } catch (error) {
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
                      {tenant.rent}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Garantia: </span>{" "}
                      {tenant.warranty}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Comentario: </span>{" "}
                      {tenant.comment}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Fecha de Ingreso: </span>{" "}
                      {tenant.dateInit}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Fecha de Salida: </span>{" "}
                      {tenant.dateFin}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setShowTenantForm(true);
                      setEditTenant(tenant);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => handleDelete(tenant.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleGoToPayments(tenant)}
                    className="bg-black text-white px-2 py-1 rounded hover:bg-gray-900 cursor-pointer"
                  >
                    Boletas
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
