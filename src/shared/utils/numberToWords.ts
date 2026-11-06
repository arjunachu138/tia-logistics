const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const convertBelowThousand = (num: number): string => {
  let result = "";

  if (num >= 100) {
    result += `${ones[Math.floor(num / 100)]} Hundred`;
    num %= 100;

    if (num > 0) {
      result += " ";
    }
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;

    if (num > 0) {
      result += `-${ones[num]}`;
    }
  } else if (num > 0) {
    result += ones[num];
  }

  return result;
};

export const numberToWords = (
  value: number | string | null | undefined,
): string => {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return "--";
  }

  if (num === 0) {
    return "Zero";
  }

  const integerPart = Math.floor(Math.abs(num));

  let remaining = integerPart;
  let result = "";

  const crore = Math.floor(remaining / 10_000_000);
  remaining %= 10_000_000;

  const lakh = Math.floor(remaining / 100_000);
  remaining %= 100_000;

  const thousand = Math.floor(remaining / 1_000);
  remaining %= 1_000;

  if (crore > 0) {
    result += `${convertBelowThousand(crore)} Crore `;
  }

  if (lakh > 0) {
    result += `${convertBelowThousand(lakh)} Lakh `;
  }

  if (thousand > 0) {
    result += `${convertBelowThousand(thousand)} Thousand `;
  }

  if (remaining > 0) {
    result += convertBelowThousand(remaining);
  }

  return `${num < 0 ? "Minus " : ""}${result.trim()}`;
};
