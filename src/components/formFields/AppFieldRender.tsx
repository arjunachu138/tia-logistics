import React, { lazy, Suspense } from "react";

import type { FieldData, FieldRef, OnChange } from "../../shared/form/types";

import { FIELD_TYPES } from "../../shared/form/fieldTypes";

const AppEmail = lazy(() => import("./appEmail/AppEmail"));
const AppPassword = lazy(() => import("./appPassword/AppPassword"));
const AppText = lazy(() => import("./appText/AppText"));

interface AppFieldRenderProps {
  field: FieldData;
  onChange: OnChange;
  ref: React.Ref<FieldRef>;
}

const AppFieldRender = ({ field, onChange, ref }: AppFieldRenderProps) => {
  const renderField = () => {
    switch (field.type) {
      case FIELD_TYPES.EMAIL:
        return <AppEmail ref={ref} fieldData={field} onChange={onChange} />;

      case FIELD_TYPES.PASSWORD:
        return <AppPassword ref={ref} fieldData={field} onChange={onChange} />;
      case FIELD_TYPES.TEXT:
        return <AppText ref={ref} fieldData={field} onChange={onChange} />;

      default:
        return null;
    }
  };

  return <Suspense fallback={null}>{renderField()}</Suspense>;
};

export default AppFieldRender;
