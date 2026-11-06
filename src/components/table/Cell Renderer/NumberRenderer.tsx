interface Props {
  value: unknown;
}

export default function NumberRenderer({ value }: Props) {
  if (value === null || value === undefined || value === "") {
    return <>-</>;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return <>-</>;
  }

  return <>{String(number).padStart(2, "0")}</>;
}
