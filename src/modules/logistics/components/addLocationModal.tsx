import React, { useState } from "react";
import { AppImage, Button, Input } from "../../../components";
import styles from "./addLocationModal.module.css";
import { icons } from "../../../assets/icons";
import { logisticsService } from "../../../services";
import { useToast } from "../../../components/toast/ToastProvider";
import { CircularProgress } from "@mui/material";

export interface LocationData {
  parentName: string;
  name1: string;
  name2: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  postalCode: string;
  country: string;
  typeCode: string;
}

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: LocationData) => void;
}

const initialFormState: LocationData = {
  parentName: "",
  name1: "",
  name2: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  state: "",
  postalCode: "",
  country: "",
  typeCode: "BR",
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<LocationData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (field: keyof LocationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name1.trim()) {
      newErrors.name1 = "Name 1 is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal Code is required.";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    try {
      await logisticsService.insertBorderCrossingLocation({
        parentName: formData.parentName.trim(),
        partyTypeCode: "BR", // always BR
        partyName1: formData.name1.trim(),
        partyName2: formData.name2.trim(),
        partyIdqlf: "", // always empty
        partyId: "", // always empty
        partyAddrLine1: formData.addressLine1.trim(),
        partyAddrLine2: formData.addressLine2.trim(),
        partyCity: formData.city.trim(),
        partyState: formData.state.trim(),
        partyPostalId: formData.postalCode.trim(),
        partyCountry: formData.country.trim(),
      });

      showToast("Border location added successfully.", "success");
      onSave?.(formData);
      setFormData(initialFormState);
      setErrors({});
      onClose();
    } catch (err: unknown) {
      console.error("Error inserting border crossing location:", err);
      let errMsg = "Failed to add location. Please try again.";
      if (err instanceof Error) {
        const message = err.message;
        const separator = " - ";
        const separatorIndex = message.indexOf(separator);
        if (
          separatorIndex !== -1 &&
          message.startsWith("HTTP error! status:")
        ) {
          errMsg = message.slice(separatorIndex + separator.length).trim();
        } else {
          errMsg = message;
        }
      }
      setSaveError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setSaveError(null);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Location</h2>
        </div>

        <div className={styles.body}>
          {saveError && <div className={styles.errorMessage}>{saveError}</div>}

          {/* Row 1: 4 columns */}
          <div className={styles.row4}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>PARENT NAME</label>
              <Input
                placeholder="Parent name"
                disableMessage
                value={formData.parentName}
                onChange={(e) => handleChange("parentName", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                NAME 1 <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="Name 1"
                disableMessage
                value={formData.name1}
                error={errors.name1}
                onChange={(e) => handleChange("name1", e.target.value)}
              />
              {errors.name1 && (
                <span className={styles.fieldError}>{errors.name1}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>NAME 2</label>
              <Input
                placeholder="Name 2"
                disableMessage
                value={formData.name2}
                onChange={(e) => handleChange("name2", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                CITY <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="City"
                disableMessage
                value={formData.city}
                error={errors.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <span className={styles.fieldError}>{errors.city}</span>
              )}
            </div>
          </div>

          {/* Row 2: 2 columns */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>ADDRESS LINE 1</label>
              <Input
                placeholder="Address Line 1"
                disableMessage
                value={formData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>ADDRESS LINE 2</label>
              <Input
                placeholder="Address Line 2"
                disableMessage
                value={formData.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: 4 columns */}
          <div className={styles.row4}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                STATE <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="State"
                disableMessage
                value={formData.state}
                error={errors.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              {errors.state && (
                <span className={styles.fieldError}>{errors.state}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                POSTAL CODE <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="Postal Code"
                disableMessage
                value={formData.postalCode}
                error={errors.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
              />
              {errors.postalCode && (
                <span className={styles.fieldError}>{errors.postalCode}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                COUNTRY <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="Country"
                disableMessage
                value={formData.country}
                error={errors.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
              {errors.country && (
                <span className={styles.fieldError}>{errors.country}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                TYPE CODE <span className={styles.requiredStar}>*</span>
              </label>
              <Input
                placeholder="Type Code"
                disableMessage
                value={formData.typeCode}
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            title={isSaving ? "Saving..." : "Save"}
            className={styles.saveButton}
            color="primary"
            disabled={isSaving}
            icon={
              isSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <AppImage
                  iconPath={icons.savePrimary}
                  width="22px"
                  height="24px"
                />
              )
            }
            onClick={handleSave}
          />
          <Button
            title="Cancel"
            type="button"
            color="outline"
            onClick={handleClose}
            icon={
              <AppImage
                iconPath={icons.CancelIcon}
                width="12px"
                height="12px"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
