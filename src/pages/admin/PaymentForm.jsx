import { useState } from "react";
import { useParams } from "react-router";
import { useFireStore } from "../../context/FireStoreProvider";

export const PaymentForm = ({
  onClose,
  handlePaymentAdd,
  beanEditPayment,
  listPayments,
}) => {
  const { addPayment, updatePaymentsActive, updatePayment } = useFireStore();
  const [error, setError] = useState("");
  const { tenantId } = useParams();

  const [formData, setFormData] = useState(() => {
    if (beanEditPayment !== null) {
      return {
        ...beanEditPayment,
      };
    }
    return {
      kilowats: "",
      mesxkilowats: "",
      montoxkilowats: "",
      agua: "",
      internet: "",
      deuda: "",
      comment: "",
      status: "pending",
      fecha: "",
      active: true,
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (beanEditPayment) {
        await updatePayment(tenantId, beanEditPayment.id, formData);
        //refrescar lista de pagos y cerrar popup
        handlePaymentAdd({ id: beanEditPayment.id, ...formData });
      } else {
        if (error !== "") return;
        // Actualizar active a false en los demás pagos antes de agregar el nuevo
        await updatePaymentsActive(tenantId);
        // Agregar el nuevo pago
        const newPayment = await addPayment(tenantId, formData);
        handlePaymentAdd({ id: newPayment.id, ...formData });
      }
      setError("");
      onClose();
    } catch (error) {
      setError(error);
      console.error("Error adding tenant:", error);
    }
  };

  const calcularKilowats = () => {
    if (formData.kilowats) {
      if (listPayments.length === 0) {
        setFormData({ ...formData, mesxkilowats: "0", montoxkilowats: "0" });
      } else {
        listPayments.map((payment) => {
          if (payment.active) {
            if (Number(formData.kilowats) >= payment.kilowats) {
              const calcKilowats = Number(formData.kilowats) - payment.kilowats;
              const montoTotal = Number.parseFloat(calcKilowats * 1.0).toFixed(
                0
              );
              setFormData({
                ...formData,
                mesxkilowats: calcKilowats.toString(),
                montoxkilowats: montoTotal.toString(),
              });
              setError("");
            } else {
              setError(
                "Error: Ingrese un valor mayor o igual al valor del ultimo mes en el campo kilowats"
              );
            }
          }
        });
      }
    } else {
      setError("Error: Ingresa el valor que marca su medidor");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center p-4 font-sans overflow-scroll">
      <div className="bg-white p-6 rounded-lg w-full max-w-md overflow-scroll font-medium text-gray-700 text-sm">
        <h2 className="text-xl font-bold mb-4">
          {beanEditPayment ? "Actualizar boleta" : "Agregar boleta"}
        </h2>
        <form onSubmit={handleSubmit}>
          <p className="text-black">Calculo de la luz</p>
          <div className="border-1 p-4 border-gray-400 mb-2 rounded-2xl">
            <div className="flex justify-between items-start">
              <div className="">
                <label htmlFor="kilowats" className="block mb-1 text-black">
                  Kilowats:
                </label>
                <input
                  type="number"
                  name="kilowats"
                  placeholder="kilowats de medidor"
                  value={formData.kilowats}
                  onChange={handleChange}
                  required
                  disabled={beanEditPayment ? true : false}
                  className="w-full mb-1 p-1 border rounded max-sm:w-40"
                />
              </div>
              <input
                className={`  px-4 py-1 rounded  max-h-9 mt-6 ${
                  beanEditPayment
                    ? "cursor-not-allowed bg-gray-300 hover:bg-gray-300 text-gray-700"
                    : "cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={calcularKilowats}
                type="button"
                disabled={beanEditPayment ? true : false}
                value="Calcular"
              />
            </div>
            <div>
              <label htmlFor="mesxkilowats" className="block mb-1 text-black">
                kilowats calculado con el ultimo registro:
              </label>
              <input
                type="number"
                name="mesxkilowats"
                placeholder="mesxkilowats"
                value={formData.mesxkilowats}
                onChange={handleChange}
                required
                readOnly
                disabled
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
            <div>
              <label htmlFor="montoxkilowats" className="block mb-1 text-black">
                Luz:
              </label>
              <input
                type="number"
                name="montoxkilowats"
                placeholder="montoxkilowats"
                value={formData.montoxkilowats}
                onChange={handleChange}
                required
                readOnly
                disabled
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
          </div>
          <div>
            <label htmlFor="agua" className="block mb-1 text-black">
              Agua:
            </label>
            <input
              type="number"
              name="agua"
              placeholder="agua"
              value={formData.agua}
              onChange={handleChange}
              required
              className="w-full mb-1 p-1 border rounded"
            />
            <div>
              <label htmlFor="internet" className="block mb-1 text-black">
                Internet:
              </label>
              <input
                type="number"
                name="internet"
                placeholder="internet"
                value={formData.internet}
                onChange={handleChange}
                min={0}
                className="w-full mb-1 p-1 border rounded"
              />
            </div>

            <div>
              <label htmlFor="deuda" className="block mb-1 text-black">
                Deuda:
              </label>
              <input
                type="number"
                name="deuda"
                placeholder="deuda"
                value={formData.deuda}
                onChange={handleChange}
                min={0}
                className="w-full mb-1 p-1 border rounded"
              />
            </div>
            <div>
              <label htmlFor="comment" className="block mb-1 text-black">
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
              <label htmlFor="status" className="block mb-1 text-black">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mb-1 p-1 border rounded"
              >
                <option value="pending">Pendiente</option>
                <option value="partial">Parcial</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            <div>
              <label htmlFor="fecha" className="block mb-1 text-black">
                Fecha del pago
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
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
              {beanEditPayment ? "Actualizar" : "Agregar"}
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
