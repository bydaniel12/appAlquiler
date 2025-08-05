import { useState } from "react";
import { useFireStore } from "../../context/FireStoreProvider";
import { FormatDate } from "../../utils/FormatDate";

export const SearchPayment = () => {
  const { searchPaymentsByDateRange } = useFireStore();
  const [formData, setFormData] = useState(() => {
    return {
      dateInit: "",
      dateEnd: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (
      formData.dateInit &&
      formData.dateEnd &&
      formData.dateInit > formData.dateEnd
    ) {
      newErrors.dateRange = "La fecha desde debe ser anterior a la fecha hasta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }
    (async () => {
      try {
        const payments = await searchPaymentsByDateRange(
          formData.dateInit,
          formData.dateEnd
        );
        setSearchResult({
          results: payments.length,
          payments,
        });
      } catch (error) {
        setErrors({ global: "Error en la búsqueda" });
      }
      setIsSubmitting(false);
    })();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Buscador por Fechas
        </h1>
        <p className="text-gray-600">
          Ingresa un rango de fechas para realizar tu búsqueda
        </p>
      </div>
      <form onSubmit={handleSubmitSearch} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="dateInit" className="">
              Fecha Desde:
            </label>
            <input
              id="dateInit"
              name="dateInit"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="date"
              onChange={handleChange}
              max={today}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="dateEnd" className="">
              Fecha Hasta:
            </label>
            <input
              id="dateEnd"
              name="dateEnd"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="date"
              onChange={handleChange}
              max={today}
              required
            ></input>
          </div>
        </div>
        {errors ? (
          <div className="text-red-600">{errors.dateRange}</div>
        ) : (
          <div></div>
        )}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium text-white transition ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
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
                Buscando...
              </span>
            ) : (
              "Buscar"
            )}
          </button>
        </div>
      </form>
      {searchResult && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Resultados de búsqueda
          </h3>
          <ul className="mt-4 divide-y divide-blue-100">
            {searchResult.payments.length === 0 ? (
              <div>No hay Boletas en el rango de fechas indicadas</div>
            ) : (
              <div className="space-y-4">
                {searchResult.payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 ${
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
                        <h3 className="text-xl font-semibold text-gray-800">
                          {payment.name}
                        </h3>
                        <p className="text-gray-800 font-semibold">
                          <FormatDate dateRegister={payment.fecha} />
                        </p>
                        <p className="text-gray-600 mt-1">
                          Renta: S/{payment.rent}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Luz: S/{payment.montoxkilowats}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Agua: S/{payment.agua}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Deuda: S/{payment.deuda}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Comentario: {payment.comment}
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
                  </div>
                ))}
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
