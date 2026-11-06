import type { RootState } from "../store";

export const selectSolocId = (state: RootState) =>
  state.user.userDetails?.subOrglocation?.soLocID ?? 0;

export const selectIsEDIDb = (state: RootState) =>
  state.user.userDetails?.settings[0]?.isEDIDb ?? false;

export const selectStatusName = (state: RootState) =>
  state.user.userDetails?.settings[0]?.statusName ?? null;

export const selectIsPOAutoAck = (state: RootState) =>
  state.user.userDetails?.settings[0]?.isPOAutoAck ?? false;

export const selectUserRole = (state: RootState) =>
  state.user.userDetails?.role ?? "";

export const selectOwnerId = (state: RootState) =>
  state.user.userDetails?.subOrglocation?.warehouseId ?? "";

export const selectenableLifeCyclePO = (state: RootState) =>
  state.user.userDetails?.settings?.find(
    (item) => item.moduleName === "Purchase Order",
  )?.enableLifeCycle ?? false;

export const selectenableLifeCycleASN = (state: RootState) =>
  state.user.userDetails?.settings?.find(
    (item) => item.moduleName === "Advance Ship Notice",
  )?.enableLifeCycle ?? false;

export const selectIsPOUpload = (state: RootState) =>
  state.user.userDetails?.settings?.find(
    (item) => item.moduleName === "Purchase Order",
  )?.isUpload ?? false;

export const selectEnablePOAck = (state: RootState) =>
  state.user.userDetails?.settings?.find(
    (item) => item.moduleName === "Purchase Order",
  )?.enablePOAck ?? false;
