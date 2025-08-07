import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { useFireStore } from "../../context/FireStoreProvider";
import { PaymentForm } from "./PaymentForm";
import { FormatDate } from "../../utils/FormatDate";

export const PaymentList = () => {
  const location = useLocation();
  const {
    name: tenantName,
    rent: tenantRent,
    phone: tenantPhone,
    lightMeter: tenantLightMeter,
    numberKilowatsInit: tenantNumberKilowatsInit,
  } = location.state || {};
  const { getPayments, deletePayment } = useFireStore();
  const [payments, setPayments] = useState([]);
  const { currentUser } = useAuth();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [refreshPayments, setRefreshPayments] = useState(false);
  const { tenantId } = useParams();
  const [editPayment, setEditPayment] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchpayments = async () => {
        const fetchedPayments = await getPayments(tenantId);
        setPayments(fetchedPayments);
      };
      fetchpayments();
      //el estado refreshPayments es para que se ejecute al guardar o eliminar un pago
      //al ponerlo como dependencia en el useEffect se va a disparar al cambiar de estado
    }
  }, [currentUser, getPayments, refreshPayments]);

  const getMontoTotal = (paymentCard) => {
    const { montoxkilowats, agua, internet, deuda } = paymentCard;
    const montoTotal =
      Number(tenantRent) +
      Number(montoxkilowats) +
      Number(agua) +
      Number(internet) +
      (deuda !== "" ? Number(deuda) : Number(0));
    return montoTotal;
  };

  /*
  const handleDelete = async (paymentId) => {
    try {
      await deletePayment(tenantId, paymentId);
      setRefreshPayments((prev) => !prev);
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };
  */

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in max-w-2xl mx-auto">
      <div className="mb-2 mt-2 p-4 bg-blue-300 rounded-lg text-left">
        <p className="text-lg font-semibold">Inquilino: {tenantName}</p>
        <p className="text-lg text-gray-700">Teléfono: {tenantPhone}</p>
      </div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h2 className="text-2xl font-bold">Boletas</h2>
        <button
          onClick={() => setShowPaymentForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Agregar
        </button>
      </div>
      {showPaymentForm && (
        <PaymentForm
          listPayments={payments}
          onClose={() => {
            setShowPaymentForm(false);
            setEditPayment(null);
          }}
          handlePaymentAdd={() => {
            setRefreshPayments((prev) => !prev);
            setShowPaymentForm(false);
          }}
          beanEditPayment={editPayment}
          tenantLightMeter={tenantLightMeter}
          tenantNumberKilowatsInit={tenantNumberKilowatsInit}
        ></PaymentForm>
      )}

      <div className="mt-4 px-4 max-sm:px-0 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
        {payments.length === 0 ? (
          <div className="text-xl font-semibold text-blue-600 mb-2 text-center">
            No hay Boletas registradas.
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-blue-100">
            {payments.map((payment, index) => (
              <div
                key={index}
                className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 mb-4 ${
                  payment.status === "completed"
                    ? "border-green-500"
                    : payment.status === "pending"
                    ? "border-red-500"
                    : payment.status === "partial"
                    ? "border-yellow-500"
                    : "border-gray-500"
                } animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xl font-semibold text-gray-800 leading-5">
                      <div>{tenantName}</div>
                      <div>{FormatDate(payment.fecha)}</div>
                    </div>
                    {tenantLightMeter && payment.kilowats && (
                      <>
                        <p className="text-gray-800 mt-1">
                          Registro de kwts: {payment.kilowats}
                        </p>
                        <p className="text-gray-800 mt-1">
                          Consumo kwts: {payment.mesxkilowats}
                        </p>
                      </>
                    )}
                    <p className="text-gray-800 mt-1">
                      Luz: S/{payment.montoxkilowats}
                    </p>
                    <p className="text-gray-800 mt-1">Agua: S/{payment.agua}</p>
                    {payment.internet !== "" && (
                      <p className="text-gray-800 mt-1">
                        Internet: S/{payment.internet}
                      </p>
                    )}
                    {payment.deuda !== "" && (
                      <p className="text-gray-800 mt-1">
                        Deuda: S/{payment.deuda}
                      </p>
                    )}
                    <p className="text-gray-800 mt-1">
                      Renta mensual: S/{tenantRent}
                    </p>
                    {payment.comment !== "" && (
                      <p className="text-gray-800 mt-1">
                        Comentario: {payment.comment}
                      </p>
                    )}
                    <p className="text-gray-800 mt-1 font-semibold">
                      Monto total a pagar: S/
                      {getMontoTotal(payment)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === "completed"
                        ? "bg-gray-200 text-green-600"
                        : payment.status === "pending"
                        ? "bg-gray-200 text-red-600"
                        : payment.status === "partial"
                        ? "bg-gray-200 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setEditPayment(payment);
                      setShowPaymentForm(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Actualizar
                  </button>
                  {/* Botón WhatsApp */}
                  <a
                    href={`https://wa.me/51${tenantPhone}?text=${encodeURIComponent(
                      `*Hola ${tenantName}, le dejo un detalle del monto a pagar, ${FormatDate(
                        payment.fecha
                      )}*\n` +
                        `- Estado: ${payment.status}\n` +
                        `- Kilowats registrado: ${payment.kilowats}\n` +
                        `- Kilowats consumido: ${payment.mesxkilowats}\n` +
                        `- Luz: S/ ${payment.montoxkilowats}\n` +
                        `- Agua: S/ ${payment.agua}\n` +
                        `${
                          payment.internet &&
                          `- Internet: S/ ${payment.internet}`
                        }\n` +
                        `- Renta Mensual: S/ ${tenantRent}\n` +
                        `${payment.deuda && `- Deuda: S/ ${payment.deuda}`}\n` +
                        `${payment.comment && `- Nota: ${payment.comment}`}\n` +
                        `*- Monto total a pagar: S/ ${getMontoTotal(payment)}*`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 cursor-pointer flex items-center"
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
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
