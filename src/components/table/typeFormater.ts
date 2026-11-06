export type ColumnType = "string" | "number" | "currency" | "date" | "phone";

export const formatValue = (value: unknown, type: ColumnType = "string") => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "number":
      return Number(value).toLocaleString();

    case "currency":
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(value));

    case "date":
      return new Date(value as string | number | Date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "phone":
      return String(value).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

    case "string":
    default:
      return String(value);
  }
};
