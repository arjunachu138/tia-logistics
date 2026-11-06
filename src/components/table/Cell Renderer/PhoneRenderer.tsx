interface Props {
  value: unknown;
}

export default function PhoneRenderer({ value }: Props) {
  if (!value) return <>-</>;

  return <>{String(value).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}</>;
}
