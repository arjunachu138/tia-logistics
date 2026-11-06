interface Props {
  value: unknown;
}

export default function StringRenderer({ value }: Props) {
  return <>{value !== null && value !== undefined && value !== "" ? String(value) : "-"}</>;
}
