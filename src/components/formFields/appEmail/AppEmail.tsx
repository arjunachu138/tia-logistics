import {
  useEffect,
  useImperativeHandle,
  useState,
  type ChangeEvent,
} from "react";

import Input from "../../input/input";

import type { FieldData, FieldRef, OnChange } from "../../../shared/form/types";

interface AppEmailProps {
  fieldData: FieldData;
  onChange: OnChange;
  ref: React.Ref<FieldRef>;
}

const AppEmail = ({ fieldData, onChange, ref }: AppEmailProps) => {
  const [value, setValue] = useState(
    typeof fieldData.value === "string" ? fieldData.value : "",
  );

  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const runValidation = (currentValue: string): boolean => {
    let errorMessage = "";

    if (fieldData.isRequired && currentValue.trim().length === 0) {
      errorMessage = fieldData.errorLabel
        ? `${fieldData.errorLabel} is required`
        : "This field is required";
    } else if (
      currentValue &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentValue)
    ) {
      errorMessage = fieldData.errorLabel
        ? `Please enter a valid ${fieldData.errorLabel}`
        : "Please enter a valid email address";
    }

    setError(errorMessage);
    setIsTouched(true);

    onChange?.(fieldData.name, currentValue, !!errorMessage);

    return !errorMessage;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

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
      type="email"
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

export default AppEmail;
