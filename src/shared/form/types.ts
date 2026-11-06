import type { FIELD_TYPES } from "./fieldTypes";

export interface FieldRef {
  runValidation: () => boolean;
}

type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export interface FieldData {
  name: string;
  type: FieldType;

  label?: string;
  errorLabel?: string;
  placeholder?: string;

  value?: unknown;

  isRequired?: boolean;
  disabled?: boolean;
  hiddenLabel?: boolean;

  checkValidation?: string[];
  forbid?: string;

  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";

  [key: string]: unknown;
}

export type OnChange = (
  fieldName: string,
  value: unknown,
  hasError: boolean,
) => void;
