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
    <div className="container mx-auto max-w-lg">
      <div className="mb-2 p-4 bg-blue-300 rounded-lg text-left">
        <p className="text-lg font-semibold">Inquilino: {tenantName}</p>
        <p className="text-lg text-gray-700">Teléfono: {tenantPhone}</p>
      </div>
      <div className="flex justify-between items-center mb-4">
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

      <div className="bg-white shadow rounded-lg overflow-hidden items-center text-center">
        {payments.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No hay Boletas registradas.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <li
                key={index}
                className="p-4 mt-4 bg-sky-100 rounded-2xl hover:bg-sky-200 hover:rounded-2xl"
              >
                <div className="flex justify-center items-center">
                  <div>
                    <div className="text-xl font-semibold">
                      {tenantName} {" - "}
                      <FormatDate dateRegister={payment.fecha}></FormatDate>
                    </div>
                    <p className="text-gray-800">
                      <span className="font-semibold">Estado: </span>{" "}
                      {payment.status}
                    </p>
                    {tenantLightMeter && tenantNumberKilowatsInit && (
                      <>
                        <p className="text-gray-800">
                          <span className="font-semibold">
                            Registro de kwts:{" "}
                          </span>
                          {payment.kilowats}
                        </p>
                        <p className="text-gray-800">
                          <span className="font-semibold">Consumo kwts: </span>
                          {payment.mesxkilowats}
                        </p>
                      </>
                    )}

                    <p className="text-gray-800">
                      <span className="font-semibold">Luz: </span>
                      {" S/ "}
                      {payment.montoxkilowats}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Agua: </span>
                      {" S/ "}
                      {payment.agua}
                    </p>
                    {payment.internet !== "" ? (
                      <p className="text-gray-800">
                        <span className="font-semibold">Internet: </span>
                        {" S/ "}
                        {payment.internet}
                      </p>
                    ) : (
                      <></>
                    )}
                    {payment.deuda !== "" ? (
                      <p className="text-gray-800">
                        <span className="font-semibold">Deuda: </span>
                        {" S/ "}
                        {payment.deuda}
                      </p>
                    ) : (
                      <></>
                    )}

                    <p className="text-gray-800">
                      <span className="font-semibold">Renta mensual: </span>
                      {" S/ "}
                      {tenantRent}
                    </p>

                    {payment.comment !== "" ? (
                      <p className="text-gray-800">
                        <span className="font-semibold">Comentario: </span>
                        {" S/ "}
                        {payment.comment}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
