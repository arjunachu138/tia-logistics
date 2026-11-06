import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface Props {
  value: unknown;
}

const DATE_FORMATS = [
  "DD/MM/YYYY",
  "DD-MM-YYYY",
  "YYYY-MM-DD",
  "YYYY/MM/DD",

  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY hh:mm A",
  "DD-MM-YYYY HH:mm",
  "DD-MM-YYYY hh:mm A",

  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD hh:mm A",
];

const parseDate = (value: unknown): Dayjs | null => {
  if (!value) return null;

  // API may return Date/string/number
  if (value instanceof Date) {
    const date = dayjs(value);
    return date.isValid() ? date : null;
  }

  if (typeof value === "number") {
    const date = dayjs(value);
    return date.isValid() ? date : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) return null;
  const nativeDate = dayjs(trimmedValue);

  if (nativeDate.isValid()) {
    return nativeDate;
  }

  // Then try known custom formats.
  const customDate = dayjs(trimmedValue, DATE_FORMATS, true);

  return customDate.isValid() ? customDate : null;
};

export default function DateRenderer({ value }: Props) {
  const date = parseDate(value);

  if (!date) {
    return <>--</>;
  }

  const hasTime =
    typeof value === "string"
      ? /\d{1,2}:\d{2}/.test(value)
      : date.hour() !== 0 || date.minute() !== 0 || date.second() !== 0;

  return <>{date.format(hasTime ? "DD MMM YYYY hh:mm A" : "DD MMM YYYY")}</>;
}
