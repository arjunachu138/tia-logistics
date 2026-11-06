import { useEffect, useImperativeHandle, useState } from "react";
import type { FieldData, FieldRef, OnChange } from "../../../shared/form/types";

import { icons } from "../../../assets/icons";
import { AppImage, Input } from "../../index";

interface AppPasswordProps {
  fieldData: FieldData;
  onChange: OnChange;
  ref: React.Ref<FieldRef>;
}

const AppPassword = ({ fieldData, onChange, ref }: AppPasswordProps) => {
  const [value, setValue] = useState(
    typeof fieldData.value === "string" ? fieldData.value : "",
  );

  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const runValidation = (currentValue: string): boolean => {
    let errorMessage = "";

    if (fieldData.isRequired && currentValue.length === 0) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} is required`;
    } else if (currentValue.length < 6) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} must be at least 8 characters`;
    } else if (!/[A-Z]/.test(currentValue)) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} must contain at least one uppercase letter`;
    } else if (!/[a-z]/.test(currentValue)) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} must contain at least one lowercase letter`;
    } else if (!/[0-9]/.test(currentValue)) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} must contain at least one number`;
    } else if (!/[^A-Za-z0-9]/.test(currentValue)) {
      errorMessage = `${fieldData.errorLabel ?? "Password"} must contain at least one special character`;
    }

    setError(errorMessage);
    setIsTouched(true);

    onChange?.(fieldData.name, currentValue, !!errorMessage);

    return !errorMessage;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      type={showPassword ? "text" : "password"}
      label={fieldData.hiddenLabel ? undefined : fieldData.label}
      placeholder={fieldData.placeholder}
      value={value}
      disabled={fieldData.disabled}
      error={isTouched ? error : ""}
      onChange={handleChange}
      onBlur={handleBlur}
      endIcon={
        <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
          <AppImage
            iconPath={showPassword ? icons.EyeIcon : icons.EyeOff}
            width="16px"
            height="16px"
          />
        </button>
      }
    />
  );
};

export default AppPassword;
