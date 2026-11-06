import dayjs, { type Dayjs } from "dayjs";

export type TimeRange = "3m" | "6m" | "12m" | "24m" | "all";

export const DELFOR_FORECAST_START_DATE = "01012001";

export const getDelforForecastDates = (): {
  forecastEndDate: string;
  forecastStartDate: string;
} => {
  return {
    forecastEndDate: dayjs().format("DDMMYYYY"),
    forecastStartDate: DELFOR_FORECAST_START_DATE,
  };
};

export const formatApiDate = (date: Dayjs | null, isToDate = false): string => {
  if (!date) return "";

  return date
    .hour(isToDate ? 11 : 12)
    .minute(isToDate ? 59 : 0)
    .second(0)
    .format("DD-MM-YYYY HH:mm:ss");
};

export const getTimeRangeDates = (
  range: TimeRange,
): { fromDate: Dayjs | null; toDate: Dayjs | null } => {
  if (range === "all") {
    return { fromDate: null, toDate: null };
  }
  const toDate = dayjs();

  const months: Record<Exclude<TimeRange, "all">, number> = {
    "3m": 3,
    "6m": 6,
    "12m": 12,
    "24m": 24,
  };

  const fromDate = toDate.subtract(months[range], "month");

  return {
    fromDate,
    toDate,
  };
};

export const getDateRangeDays = (
  fromDate: Dayjs | null,
  toDate: Dayjs | null,
) => {
  if (!fromDate || !toDate) {
    return null;
  }

  return toDate.diff(fromDate, "day");
};

export const getDayTimeRangeDates = (range: string) => {
  const toDate = dayjs();
  const fromDate = toDate.subtract(Number(range), "day");

  return {
    fromDate,
    toDate,
  };
};

// export const formatDateToWord = (value: string | null | undefined): string => {
//   if (!value) return "--";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// export const addDays = (
//   date: string | null | undefined,
//   days: number | string | null | undefined,
// ) => {
//   if (!date) return "--";

//   const result = new Date(date);
//   result.setDate(result.getDate() + Number(days ?? 0));

//   return formatDateToWord(result.toISOString());
// };

// export const formatRevisionDate = (
//   value: string | null | undefined,
// ): string => {
//   if (!value) return "--";

//   const date = dayjs(value);

//   if (!date.isValid()) {
//     return value;
//   }

//   return date.format("YYYY-MM-DD HH:mm:ss");
// };

const isInvalidYearOne = (value: string): boolean => {
  const dateValue = value.trim();

  return /^0001[-/]/.test(dateValue) || /[-/]0001(?:\s|T|$)/.test(dateValue);
};

export const formatDateToWord = (value: string | null | undefined): string => {
  if (!value || isInvalidYearOne(value)) return "--";

  const date = dayjs(value);

  if (!date.isValid()) {
    return "--";
  }

  return date.format("DD MMM YYYY , hh:mm A");
};

export const addDays = (
  date: string | null | undefined,
  days: number | string | null | undefined,
) => {
  if (!date || isInvalidYearOne(date)) return "--";

  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) return "--";

  return formatDateToWord(
    parsedDate.add(Number(days ?? 0), "day").toISOString(),
  );
};

export const formatRevisionDate = (
  value: string | null | undefined,
): string => {
  if (!value || isInvalidYearOne(value)) return "--";

  const date = dayjs(value);

  if (!date.isValid()) {
    return "--";
  }

  return date.format("YYYY-MM-DD HH:mm:ss");
};
