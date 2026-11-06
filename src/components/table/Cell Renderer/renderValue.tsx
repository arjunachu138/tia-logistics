import {
  StringRenderer,
  NumberRenderer,
  CurrencyRenderer,
  DateRenderer,
  PhoneRenderer,
} from ".";

export type ColumnType =
  | "string"
  | "number"
  | "currency"
  | "date"
  | "phone"
  | "invoice"
  | "action";
interface Props {
  value: unknown;
  type?: ColumnType;
}

export default function RenderValue({ value, type = "string" }: Props) {
  switch (type) {
    case "number":
      return <NumberRenderer value={value} />;

    case "currency":
      return <CurrencyRenderer value={value} />;

    case "date":
      return <DateRenderer value={value} />;

    case "phone":
      return <PhoneRenderer value={value} />;

    default:
      return <StringRenderer value={value} />;
  }
}
