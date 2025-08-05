export const FormatDate = (dateRegister) => {
  const { dateRegister: fecha } = dateRegister;
  let fechaFormateada = "";

  try {
    let date;
    if (!fecha) throw new Error("Fecha vacía");
    if (fecha instanceof Date) {
      date = fecha;
    } else if (typeof fecha === "string") {
      // Si es string tipo ISO o YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
        const [year, month, day] = fecha.split("-");
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(fecha);
      }
    } else {
      throw new Error("Tipo de fecha no soportado");
    }
    fechaFormateada = date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error al formatear fecha:", e);
    return <>Fecha inválida</>;
  }
  return <>{fechaFormateada}</>;
};
