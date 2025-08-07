import { useState } from "react";
import { useParams } from "react-router";
import { useFireStore } from "../../context/FireStoreProvider";

export const PaymentForm = ({
  onClose,
  handlePaymentAdd,
  beanEditPayment,
  listPayments,
  tenantLightMeter,
  tenantNumberKilowatsInit,
}) => {
  const { addPayment, updatePaymentsActive, updatePayment } = useFireStore();
  const [error, setError] = useState("");
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
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
      setIsLoadingBtn(true);
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
      setIsLoadingBtn(false);
    } catch (error) {
      setIsLoadingBtn(false);
      setError(error);
      console.error("Error adding tenant:", error);
    }
  };

  const calcularKilowats = () => {
    let calKilowats = 0;
    if (formData.kilowats) {
      if (tenantLightMeter && tenantNumberKilowatsInit) {
        if (listPayments.length === 0) {
          if (Number(formData.kilowats) >= tenantNumberKilowatsInit) {
            calKilowats = Number(formData.kilowats) - tenantNumberKilowatsInit;
            setError("");
          } else {
            setError(
              "Error: Ingrese un valor mayor o igual al valor del ultimo mes en el campo kilowats"
            );
          }
        } else {
          for (const payment of listPayments) {
            if (payment.active && payment.kilowats) {
              if (Number(formData.kilowats) >= payment.kilowats) {
                calKilowats = Number(formData.kilowats) - payment.kilowats;
                setError("");
                break;
              } else {
                setError(
                  "Error: Ingrese un valor mayor o igual al valor del ultimo mes en el campo kilowats"
                );
              }
            } else {
              if (Number(formData.kilowats) >= tenantNumberKilowatsInit) {
                calKilowats =
                  Number(formData.kilowats) - tenantNumberKilowatsInit;
                setError("");
              } else {
                setError(
                  "Error: Ingrese un valor mayor o igual al valor del kilowats inicial"
                );
              }
            }
          }
        }
        let montoTotal = 0;
        if (calKilowats <= 90) {
          montoTotal = Number.parseFloat(calKilowats * 1.0).toFixed(0);
        } else if (calKilowats <= 120) {
          montoTotal = Number.parseFloat(calKilowats * 1.1).toFixed(0);
        } else if (calKilowats <= 150) {
          montoTotal = Number.parseFloat(calKilowats * 1.2).toFixed(0);
        } else {
          montoTotal = Number.parseFloat(calKilowats * 1.3).toFixed(0);
        }
        setFormData({
          ...formData,
          mesxkilowats: calKilowats.toString(),
          montoxkilowats: montoTotal.toString(),
        });
      }
    } else {
      setError(
        "Error: Ingresa el valor que marca su medidor en campo el kilowats"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center p-4 font-sans overflow-scroll">
      <div className="bg-white p-6 rounded-lg w-full max-w-md overflow-scroll font-medium text-gray-700 text-sm">
        <h2 className="text-xl font-bold mb-4">
          {beanEditPayment ? "Actualizar boleta" : "Agregar boleta"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-start">
            <p className="text-black">
              {tenantLightMeter
                ? "Ingresa el valor de kilowats para el calculo de la Luz"
                : "Ingresa el monto de Luz"}
            </p>
          </div>
          <div className="border-1 py-1 px-4 border-gray-400 mb-2 rounded-2xl">
            {tenantLightMeter ? (
              <div>
                <div className="flex justify-between">
                  <div className="mt-4">
                    <label htmlFor="kilowats" className="relative">
                      <input
                        type="number"
                        name="kilowats"
                        id="kilowats"
                        placeholder=""
                        value={formData.kilowats}
                        onChange={handleChange}
                        required={tenantLightMeter}
                        disabled={beanEditPayment ? true : false}
                        className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
                      />
                      <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                        Kilowats
                      </span>
                    </label>
                  </div>
                  <input
                    className={`  px-4 py-2 rounded  max-h-9 mt-5 ${
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
                <div className="my-4">
                  <label htmlFor="mesxkilowats" className="relative">
                    <input
                      type="number"
                      name="mesxkilowats"
                      id="mesxkilowats"
                      placeholder=""
                      value={formData.mesxkilowats}
                      onChange={handleChange}
                      required={tenantLightMeter}
                      readOnly
                      disabled
                      className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
                    />
                    <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                      Kilowats calculado
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <div className="my-4">
              <label htmlFor="montoxkilowats" className="relative">
                <input
                  type="text"
                  name="montoxkilowats"
                  id="montoxkilowats"
                  placeholder=""
                  value={formData.montoxkilowats}
                  onChange={handleChange}
                  required
                  pattern="[0-9]*"
                  className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
                />
                <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                  Luz
                </span>
              </label>
            </div>
          </div>

          <div className="my-4">
            <label htmlFor="agua" className="relative">
              <input
                type="text"
                name="agua"
                id="agua"
                placeholder=""
                value={formData.agua}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Agua
              </span>
            </label>
          </div>

          <div className="my-4">
            <label htmlFor="internet" className="relative">
              <input
                type="number"
                name="internet"
                id="internet"
                placeholder=""
                value={formData.internet}
                onChange={handleChange}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Internet
              </span>
            </label>
          </div>

          <div className="my-4">
            <label htmlFor="deuda" className="relative">
              <input
                type="number"
                name="deuda"
                id="deuda"
                placeholder=""
                value={formData.deuda}
                onChange={handleChange}
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Deuda
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
            <label htmlFor="status" className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="partial">Parcial</option>
                <option value="completed">Completado</option>
              </select>
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Estado
              </span>
            </label>
          </div>

          <div className="my-4">
            <label htmlFor="fecha" className="relative">
              <input
                type="date"
                name="fecha"
                id="fecha"
                placeholder=""
                value={formData.fecha}
                onChange={handleChange}
                required
                className="peer mt-0.5 p-2 w-full rounded border-gray-400 border-1 shadow-sm sm:text-sm"
              />
              <span className="absolute inset-y-0 start-3 -translate-y-4.5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5">
                Fecha de pago
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
                  {beanEditPayment ? "Actualizando..." : "Agregando..."}
                </span>
              ) : (
                <>{beanEditPayment ? "Actualizar" : "Agregar"}</>
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
