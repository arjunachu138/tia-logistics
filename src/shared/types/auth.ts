export interface LoginPayload {
  password: string;
  username: string;
}

export interface SubOrgLocation {
  soLocID: number;
  warehouseId: string;
  headPersonName: string;
  locationType: string;
  settings: unknown | null;
  gsNumber: string | null;
  storeCode: string | null;
  storeQlf: string | null;
  soid: number;
  soCode: string;
  sOname: string;
  soDesc: string;
  soLogo: string;
  customerGSTIN: string;
  subOrgLocations: unknown | null;
  orgID: number;
  orgCode: string;
  orgName: string;
  orgDesc: string;
  orgLogo: string;
  subOrganisation: unknown | null;
}

export interface UserSetting {
  solocId: number;
  moduleName: string;
  statusName: string | null;
  statusDisplayName: string | null;
  isCoupled: boolean;
  isAutoASN: boolean;
  isInventoryCheck: boolean;
  isFTPCSV: boolean;
  isUOM: boolean;
  isAcknowledgementCheck: boolean;
  pdfTemplateLocation: string | null;
  overridePORevise: boolean;
  isUpload: boolean;
  enableLifeCycle: boolean;
  enableCreateASN: boolean;
  enablePOAck: boolean;
  enableRBOMDownload: boolean;
  enableInventoryDownload: boolean;
  enableEDI850Download: boolean;
  enableEDI856Download: boolean;
  enableEDI810Download: boolean;
  enableEDI855Download: boolean;
  isCustomPDF: boolean;
  enableCreateInvoice: boolean;
  isPOAutoAck: boolean;
  enableLoadTender: boolean;
  enableTenderShipment: boolean;
  enableTenderAck: boolean;
  enableTenderInvoice: boolean;
  enableFunctionalAck: boolean;
  isEDIDb: boolean;
  isProbillViaStopSequenceNo: boolean;
  enableAutoAck: boolean;
  isEnableApptWindow: boolean;
  fromSOLocID: string;
  subOrgModuleId: string;
  subOrgStatusId: string | null;
}

export interface UserRole {
  soLocID: number;
  roleName: string;
}

export interface SidebarMenu {
  moduleID: string;
  name: string;
  route: string;
  label: string;
  icon: string | null;
}

export interface SidebarItem {
  menu: SidebarMenu;
  subMenus: SidebarMenu[];
}

export interface LoginResponse {
  username: string;
  token: string;
  email: string;
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
  phoneNumber: string | null;
  role: string;
  subOrglocation: SubOrgLocation;
  settings: UserSetting[];
  userRoles: UserRole[];
  sidebar: SidebarItem[];
}
