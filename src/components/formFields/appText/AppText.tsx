import {
  useEffect,
  useImperativeHandle,
  useState,
  type ChangeEvent,
} from "react";

import Input from "../../input/input";

import type { FieldData, FieldRef, OnChange } from "../../../shared/form/types";

import { FIELD_TYPES } from "../../../shared/form/fieldTypes";

interface AppTextProps {
  fieldData: FieldData;
  onChange: OnChange;
  ref: React.Ref<FieldRef>;
}

const AppText = ({ fieldData, onChange, ref }: AppTextProps) => {
  const [value, setValue] = useState(
    typeof fieldData.value === "string" ? fieldData.value : "",
  );

  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const runValidation = (currentValue: string): boolean => {
    let errorMessage = "";

    if (fieldData.isRequired && currentValue.trim().length === 0) {
      errorMessage = fieldData.label
        ? `${fieldData.label} is required`
        : "This field is required";
    }

    const checkValidation = fieldData.checkValidation ?? [];

    if (
      !errorMessage &&
      checkValidation.includes(FIELD_TYPES.EMAIL) &&
      currentValue.includes("@")
    ) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue);

      if (!isValidEmail) {
        errorMessage = "Please enter a valid email address";
      }
    }

    setError(errorMessage);
    setIsTouched(true);

    onChange?.(fieldData.name, currentValue, !!errorMessage);

    return !errorMessage;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (fieldData.forbid) {
      const regex = new RegExp(fieldData.forbid);

      if (!regex.test(newValue)) {
        return;
      }
    }

    setValue(newValue);
    runValidation(newValue);
  };

  const handleBlur = () => {
    runValidation(value);
  };

  useImperativeHandle(ref, () => ({
    runValidation: () => runValidation(value),
  }));

  useEffect(() => {
    if (typeof fieldData.value === "string") {
      setValue(fieldData.value);
    }
  }, [fieldData.value]);

  return (
    <Input
      id={fieldData.name}
      name={fieldData.name}
      type="text"
      label={fieldData.hiddenLabel ? undefined : fieldData.label}
      placeholder={fieldData.placeholder}
      value={value}
      disabled={fieldData.disabled}
      error={isTouched ? error : ""}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default AppText;
