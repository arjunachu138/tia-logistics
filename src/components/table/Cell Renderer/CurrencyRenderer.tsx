interface Props {
  value: unknown;
}

export default function CurrencyRenderer({ value }: Props) {
  if (value === null || value === undefined || value === "") {
    return <>-</>;
  }

  return (
    <>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value))}
    </>
  );
}
