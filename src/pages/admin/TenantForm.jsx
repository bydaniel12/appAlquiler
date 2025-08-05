import { useState } from "react";
import { useFireStore } from "../../context/FireStoreProvider";

export const TenantForm = ({ onClose, onTenantAdd, beanEditTenant }) => {
  const { addTenant, updateTenant } = useFireStore();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(() => {
    if (beanEditTenant !== null) {
      return { ...beanEditTenant };
    }
    return {
      dni: "",
      name: "",
      phone: "",
      address: "",
      rent: "",
      warranty: "",
      comment: "",
      dateInit: "",
      dateFin: "",
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (beanEditTenant !== null) {
        //Actualizar datos del inquilino
        await updateTenant(beanEditTenant.id, formData);

        //Actualizar el array inquilinos para la lista y cerrarmos popUp
        onTenantAdd({ id: beanEditTenant.id, ...formData });
      } else {
        const tenanRef = await addTenant(formData);
        onTenantAdd({ id: tenanRef.id, ...formData });
      }
      setError("");
      onClose();
    } catch (error) {
      setError(error);
      console.error("Error adding tenant:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {beanEditTenant ? "Actualizar Inquilino" : "Agregar Inquilino"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Dni:
            </label>
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              value={formData.dni}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nombre y Apellido:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre y apellido"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Teléfono:
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Dirección:
            </label>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded"
            />
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Renta mensual:
              </label>
              <input
                type="text"
                name="rent"
                placeholder="Renta mensual"
                value={formData.rent}
                onChange={handleChange}
                required
                className="w-full mb-1 p-1 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Garantia:
              </label>
              <input
                type="text"
                name="warranty"
                placeholder="Garantia"
                value={formData.warranty}
                onChange={handleChange}
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Comentario:
              </label>
              <input
                type="text"
                name="comment"
                placeholder="Comentario adicional"
                value={formData.comment}
                onChange={handleChange}
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="dateInit"
                value={formData.dateInit}
                onChange={handleChange}
                required
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Fecha Fin (Opcional)
              </label>
              <input
                type="date"
                name="dateFin"
                value={formData.dateFin}
                onChange={handleChange}
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
          </div>
          {error !== "" ? (
            <div className="text-red-500 mt-2 text-center font-semibold">
              {error}
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-end space-x-4 mt-2 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 cursor-pointer"
            >
              {beanEditTenant ? "Actualizar" : "Agregar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
