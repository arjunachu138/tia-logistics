export const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  TEXTAREA: "textarea",

  MOBILE_NUMBER: "mobile_number",

  CHECKBOX: "checkbox",
  TOGGLE: "toggle",
  RADIO: "radio",

  STATIC_SINGLE_SELECT: "static_single_select",
  STATIC_MULTI_SELECT: "static_multi_select",
  API_MULTI_SELECT: "api_multi_select",

  DATE_PICKER: "date_picker",
  DATE_RANGE_PICKER: "date_range_picker",
  TIME_PICKER: "time_picker",

  OTP: "otp",

  UPLOAD_PHOTO: "upload_photo",
  FILE_UPLOAD: "file_upload",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
