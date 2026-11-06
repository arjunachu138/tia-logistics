import type { Dayjs } from "dayjs";

export interface DataTablesSearch {
  value: string;
  regex: boolean;
}

export interface DataTablesColumn {
  data: string | number;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: DataTablesSearch;
}

export interface DataTablesOrder {
  column: number;
  dir: "asc" | "desc";
}

export interface DataTablesParameters {
  draw: number;
  columns: DataTablesColumn[];
  order: DataTablesOrder[];
  start: number;
  length: number;
  search: DataTablesSearch;
}

export interface LoadTenderFilter {
  name: string;
  value?: unknown;
}

export interface LoadTenderListRequest {
  dataTablesParameters: DataTablesParameters;
  id: string;
  subOrgLocId: number;
  RoleType: string;
  filters: LoadTenderFilter[];
}

export interface LoadTenderNote {
  notesDescription: string;
}

export interface LoadTenderRecord {
  loadTenderid: string;
  customer: string;
  shipmentIdentificationNumber: string;
  dateReceived: string;
  deliveryDate: string;
  notes: Array<string | { notesDescription?: string | null } | null>;
  status: string;
  solocid: string | number;
  fromSolocid: string | number;
  routeCode: string | null;
}

export interface LoadTenderListResponse {
  draw: number;
  data: LoadTenderRecord[];
  recordsFiltered: number;
  recordsTotal: number;
  notification: unknown | null;
}

export interface LogisticsInvoicesFilters {
  fromDate: string | null;
  toDate: string | null;
  partnerOrganization: string[];
}

export interface LogisticsInvoiceRecord {
  shipmentIdentifcationNo: string;
  invoiceNumber: string;
  deliveryDate: string;
  totalCharge: number;
  status: string | null;
  errorDesc: string | null;
  invoiceId: string;
  solocid: string;
  fromSolocid: string;
}

export interface LogisticsInvoicesResponse {
  draw: number;
  data: LogisticsInvoiceRecord[];
  recordsFiltered: number;
  recordsTotal: number;
  notification: unknown | null;
}

export interface InvoiceFilterValues {
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  partnerOrganization: string[];
}

// invoice details
export interface LogisticsInvoiceAddress {
  partyTypeCode: string | null;
  partyName1: string | null;
  partyName2: string | null;
  partyAddrLine1: string | null;
  partyAddrLine2: string | null;
  partyCity: string | null;
  partyState: string | null;
  partyPostalId: string | null;
  partyCountry: string | null;
}

export interface LogisticsInvoiceDescriptionMark {
  ladingLineItemNo: string | null;
  ladingDesc: string | null;
}

export interface LogisticsInvoiceRateAndCharge {
  ladingLineItemNo: string | null;
  charge: string | number | null;
  specialChargeCode: string | null;
  specialChargeDesc: string | null;
}

export interface LogisticsInvoiceLineItem {
  billedAsQuantity: string | null;
  ladingQuantity: string | null;
  lineItemWeight: string | null;
  lineItemWeightUom: string | null;
}

export interface LogisticsInvoiceAssignedNumber {
  assignedNumber: string | null;
  invoiceDescMarksNum: LogisticsInvoiceDescriptionMark[];
  invoiceRateAndCharge: LogisticsInvoiceRateAndCharge[];
  invoiceLineItem: LogisticsInvoiceLineItem[];
}

export interface LogisticsInvoiceTotalWeightAndCharge {
  totalWeight: number | null;
  totalWeightQly: string | null;
  totalCharge: number | null;
  totalLadingQty: number | null;
  totalWeightUnitCode: string | null;
}

export interface LogisticsInvoiceReference {
  invoiceRefId1: string;
  refId: string | null;
  refIdqlf: string | null;
  freeFormDesc: string | null;
  date: string | null;
  time: string | null;
  timeCode: string | null;
}

export interface LogisticsInvoiceDateTimeRef {
  invoiceDateTimeRefId: string;
  parentName: string | null;
  parentId: string | null;
  dateQlf: string | null;
  date: string | null;
  timeQly: string | null;
  time: string | null;
  timeCode: string | null;
}

export interface LogisticsInvoiceDetail {
  invoiceMotorCarrierHeaderId: string;
  invoiceNumber: string | null;
  shipmentIdentificationNumber: string | null;
  billingDate: string | null;
  documentDate: string | null;
  deliveryDate: string | null;
  divisionName: string | null;
  tradingPartnerName: string | null;
  primaryReceiverId: string | null;
  description: string | null;
  netAmountDue: number | null;
  currencyCode: string | null;
  invoiceAddrDetail: LogisticsInvoiceAddress[];
  invoiceAssignedNumber: LogisticsInvoiceAssignedNumber[];
  invoiceTotalWeightAndCharge: LogisticsInvoiceTotalWeightAndCharge[];
  invoiceRefId: LogisticsInvoiceReference[] | null;
  invoiceDateTimeRef: LogisticsInvoiceDateTimeRef[] | null;
}

export interface EDICodeToStatusMappingItem {
  wheelkingStatus: string;
  ediStatusCode: string;
  codeType: string;
  description: string;
  solocid: string | null;
}

export interface EDICodeToStatusMappingResponse {
  default: EDICodeToStatusMappingItem[];
  tpSpecific: EDICodeToStatusMappingItem[];
}

export interface TradingPartnerSavedStatus {
  tpStatuesId: number;
  tpSolocID: string;
  sellerSolocID: string;
  shipmentStatusID: number;
  shipmentStatusName: string;
  sequenceNo: number | null;
  isActive: boolean;
  ediStatusCode: string;
  createdDate: string;
  updatedDate: string;
}

export interface TradingPartnerStatusConfigPayload {
  createdDate: string;
  updatedDate: string;
  tpStatuesId: number;
  tpSolocID: string;
  sellerSolocID: string;
  shipmentStatusID: number;
  shipmentStatusName: string;
  sequenceNo: number | null;
  isActive: boolean;
  ediStatusCode: string;
}

export interface PartnerDetail {
  soLocID: number;
  soName: string | null;
  orgName: string | null;
  soCode: string | null;
  gsNumber: string | null;
  region: string | null;
  city: string | null;
  warehouseID: string | null;
}

export interface PORow {
  srNo: string;
  poHeaderId: string;
  erp: string;
  erpImageVisible: boolean;
  erpImageSource: string;
  receiver: string;
  region: string;
  partner: string;
  sender: string;
  poNumber: string;
  transactionId?: string;
  isPoChanged: boolean;
  poDate: Date;
  shipDate: string;
  status: string;
}

export type LogisticsInvoiceDetailsResponse = LogisticsInvoiceDetail[];

// ─── Shipment Status Payload & Response ─────────────────────────────────────

export interface ShipmentStatusFilterItem {
  name: string;
  value: unknown[];
}

export interface ShipmentStatusPayload {
  dataTablesParameters: {
    draw: number;
    columns: {
      data: string;
      name: string;
      searchable: boolean;
      orderable: boolean;
      search: { value: string; regex: boolean };
    }[];
    order: { column: number; dir: "asc" | "desc" }[];
    start: number;
    length: number;
    search: { value: string; regex: boolean };
  };
  id: string;
  subOrgLocId: number | string;
  RoleType: string;
  filters: ShipmentStatusFilterItem[];
}

export interface ShipmentStatusRecord {
  probillNo: string | null;
  shipmentNo: string | null;
  currentStatus: string | null;
  currentStatusDesc: string | null;
  currentStatusDate: string | null;
  currentStatusTime: string | null;
  scac: string | null;
  tradingPartnerName: string | null;
  poNo: string | null;
  orderNumber: string | null;
  account: string | null;
  bolNumber: string | null;
  equipment: string | null;
}

export interface ShipmentStatusResponse {
  draw?: number;
  data: ShipmentStatusRecord[];
  recordsFiltered?: number;
  recordsTotal?: number;
}

// ─── Status History Payload & Response ─────────────────────────────────────

export interface ShipmentStatusHistoryRecord {
  statusCode: string | null;
  statusDesc: string | null;
  statusDate: string | null;
  statusTime: string | null;
  reasonCode: string | null;
  reasonDesc: string | null;
  notes: string | null;
  shipmentNumber: string | null;
  scac: string | null;
  poNo: string | null;
  probillNo: string | null;
  orderNumber: string | null;
  account: string | null;
  tradingPartnerName: string | null;
  bolNumber: string | null;
  equipment: string | null;
  longitudeCode: string | null;
  latitudeCode: string | null;
  directionIdentifierCode: string | null;
  appointmentCode: string | null;
  reasonDescription: string | null;
  eta: string | null;
  etaTime: string | null;
  quantity: string | number | null;
  quantityUnit: string | null;
  weight: string | number | null;
  weightUnit: string | null;
}

export interface ShipmentStatusHistoryResponse {
  draw?: number;
  data: ShipmentStatusHistoryRecord[];
  recordsFiltered?: number;
  recordsTotal?: number;
}

// ─── Create Shipment Status (Process 214) ───────────────────────────────────

export interface ProbillStatusDetail {
  probillNumber: string;
  tradingPartner: string;
  appointmentCode: string;
  equipment: string;
  weight: string;
  weightUnit: string;
  quantity: string;
  quantityUnit: string;
  longitudeCode: string;
  latitudeCode: string;
  directionIdentifierCode: string;
  eta: string | null;
}

export interface CreateShipmentStatusPayload {
  shipmentNumber: string;
  scac: string | null;
  statusCode: string;
  statusDate: string | null;
  bolNumber: string;
  reasonCode: string;
  notes: string;
  borderLocation: string;
  borderStartDate: string | null;
  borderFinishDate: string | null;
  probillDetails: ProbillStatusDetail[];
  subOrgLocId: string | number;
  roleType: string;
}

export interface Process214AddressItem {
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  contact?: string;
  phone?: string;
  fax?: string;
  Country: string;
  timeZone?: string;
  refQlf?: string;
  refValue?: string;
}

export interface Process214AddressWrapper extends Array<Process214AddressItem> {}

export interface Process214Item {
  ediShipmentIDNumber: string;
  SCAC: string;
  docDate: string;
  deliver: string;
  deliverAdd: Process214AddressWrapper;
  pickup: string;
  pickupAdd: Process214AddressWrapper;
  statusCode: string;
  statusDate: string;
  weightUnit: string;
  weight: Number;
  quantity: Number;
  quantityUnit: string;
  poNo: string;
  bolNumber: string;
  probillNo: Number;
  orderNumber: Number;
  accountID: Number;
  TradingPartnerName: string;
  equipment: string;
  TiaStatus: string;
  TiaErrorDesc: unknown;
  longitudeCode: string;
  latitudeCode: string;
  directionIdentifierCode: string;
  delayCode: string;
  eta: unknown;
  appointmentCode: string;
  borderLocation?: string;
  borderStartDate?: string;
  borderFinishDate?: string;
  isBorderCrossing?: boolean;
  Notes?: string;
}

export interface Process214Payload extends Array<Process214Item> {}

export interface InsertBorderCrossingLocationPayload {
  parentName: string | "";
  partyTypeCode: string | "";
  partyName1: string | "";
  partyName2: string | "";
  partyIdqlf: string | "";
  partyId: string | "";
  partyAddrLine1: string | "";
  partyAddrLine2: string | "";
  partyCity: string | "";
  partyState: string | "";
  partyPostalId: string | "";
  partyCountry: string | "";
}

export interface CreateShipmentStatusResponse {
  success: boolean;
  message?: string | null;
}

export interface BorderCrossingLocation {
  id: string;
  parentName: string;
  partyTypeCode: string;
  partyName1: string;
  partyName2: string | null;
  partyIdqlf: string;
  partyId: string;
  partyAddrLine1: string;
  partyAddrLine2: string | null;
  partyCity: string;
  partyState: string;
  partyPostalId: string;
  partyCountry: string;
}
