import { config } from "../app/config";

const BASE_URL = config.logisticsBaseUrl;
export const LOGISTICS_API_ENDPOINTS = {
  GET_LOAD_TENDERS: `${BASE_URL}LoadTender/GetPagedLoadTenderList`,
  GET_ROUTE_IDS: `${BASE_URL}LoadTender/GetAllRouteId`,
  GET_PROBILL_LISTING: `${BASE_URL}LoadTender/GetProbillForLoadTender`,
  GET_SHIPMENT_STATUS: `${BASE_URL}ShipmentStatus/GetPagedShipmentStatus`,
  GET_SHIPMENT_STATUS_HISTORY: `${BASE_URL}ShipmentStatus/GetPagedShipmentHistoryDetails`,
  CREATE_SHIPMENT_STATUS: `${BASE_URL}ShipmentStatus/Process214fromWheelkings`,
  GET_LOGISTICS_INVOICES_LISTING: `${BASE_URL}LoadTenderInvoice/GetPagedLoadTenderInvoice`,
  GET_LOGISTICS_INVOICE_DETAILS: `${BASE_URL}LoadTenderInvoice/GetLoadTenderInvoiceDetails`,
  GET_LOGISTICS_CONFIG_STATUS: `${BASE_URL}ShipmentStatus/GetEDICodetoStatusMapping`,
  GET_LOGISTICS_CONFIG_SAVED_STATUS: `${BASE_URL}SubOrgLoc/GetShipmentStatuesforTradingPartner`,
  GET_LOGISTICS_CONFIG_SAVE: `${BASE_URL}SubOrgLoc/AddOrUpdateStatusConfig`,
  INSERT_BORDER_CROSSING_LOCATION: `${BASE_URL}ShipmentStatus/InsertBorderCrossingLocation`,
  GET_STOPOFF_LOCATIONS: `${BASE_URL}ShipmentStatus/GetStopOffDetails`,
} as const;
