import { useState } from "react";
import { useFireStore } from "../../context/FireStoreProvider";

export const TenantForm = ({ onClose, onTenantAdd, beanEditTenant }) => {
  const { addTenant, updateTenant } = useFireStore();
  const [error, setError] = useState("");
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (beanEditTenant !== null) {
      return { ...beanEditTenant };
    }
    return {
      lightMeter: false,
      numberKilowatsInit: "",
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
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingBtn(true);
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
      setIsLoadingBtn(false);
    } catch (error) {
      setIsLoadingBtn(false);
      setError(error);
      console.error("Error adding tenant:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center p-4 font-sans">
      <div className="bg-white py-5 px-7 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">
          {beanEditTenant ? "Actualizar Inquilino" : "Nuevo Inquilino"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <div className="flex justify-start">
              <p className="text-black">Tiene un medidor de luz? Activalo!</p>
              <input
                type="checkbox"
                id="lightMeter"
                name="lightMeter"
                checked={formData.lightMeter}
                onChange={handleChange}
                className="ml-2 rounded"
              ></input>
            </div>
          </div>
          {formData.lightMeter && (
            <div className="my-4">
              <label htmlFor="numberKilowatsInit" className="relative">
                <input
                  type="text"
                  name="numberKilowatsInit"
                  id="numberKilowatsInit"
                  placeholder=""
                  value={formData.numberKilowatsInit}
                  onChange={handleChange}
                  required
                  pattern="[0-9]*"
                  className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
                />
                <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                  Número de medidor de luz (Inicio)
                </span>
              </label>
            </div>
          )}

          <div className="my-4">
            <label htmlFor="dni" className="relative">
              <input
                type="text"
                name="dni"
                id="dni"
                placeholder=""
                value={formData.dni}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                maxLength={12}
                minLength={8}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Dni
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="name" className="relative">
              <input
                type="text"
                name="name"
                id="name"
                placeholder=""
                value={formData.name}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Nombres
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="phone" className="relative">
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder=""
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                maxLength={9}
                minLength={9}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Telefono
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="address" className="relative">
              <input
                type="text"
                name="address"
                id="address"
                placeholder=""
                value={formData.address}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Dirección
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="rent" className="relative">
              <input
                type="text"
                name="rent"
                id="rent"
                placeholder=""
                value={formData.rent}
                onChange={handleChange}
                pattern="[0-9]*"
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Renta mensual
              </span>
            </label>
          </div>

          <div className="my-4">
            <label htmlFor="warranty" className="relative">
              <input
                type="text"
                name="warranty"
                id="warranty"
                placeholder=""
                value={formData.warranty}
                onChange={handleChange}
                pattern="[0-9]*"
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Garantía
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="comment" className="relative">
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder=""
                value={formData.comment}
                onChange={handleChange}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Comentario
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="dateInit" className="relative">
              <input
                type="date"
                name="dateInit"
                id="dateInit"
                placeholder=""
                value={formData.dateInit}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Fecha inicio
              </span>
            </label>
          </div>
          <div className="my-4">
            <label htmlFor="dateFin" className="relative">
              <input
                type="date"
                name="dateFin"
                id="dateInit"
                placeholder=""
                value={formData.dateFin}
                onChange={handleChange}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Fecha fin (Opcional)
              </span>
            </label>
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
              {isLoadingBtn ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {beanEditTenant ? "Actualizando..." : "Agregando..."}
                </span>
              ) : (
                <>{beanEditTenant ? "Actualizar" : "Agregar"}</>
              )}
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
