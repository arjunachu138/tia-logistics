import { LOGISTICS_API_ENDPOINTS, NON_RETAIL_API_ENDPOINTS } from "../api";
import { HTTP_METHODS } from "../api/httpmethods";
import { buildLogisticsInvoicesPayload } from "../modules/logistics/Utils/logisticsinvoicepayload";
import { buildShipmentStatusPayload } from "../modules/logistics/Utils/shipmentStatusPayload";
import type { PartnerDetail } from "../shared/types";

import type {
  EDICodeToStatusMappingResponse,
  LoadTenderListRequest,
  LoadTenderListResponse,
  LogisticsInvoiceDetailsResponse,
  LogisticsInvoicesFilters,
  LogisticsInvoicesResponse,
  TradingPartnerSavedStatus,
  TradingPartnerStatusConfigPayload,
  ShipmentStatusResponse,
  ShipmentStatusHistoryResponse,
  CreateShipmentStatusPayload,
  CreateShipmentStatusResponse,
  Process214Payload,
  InsertBorderCrossingLocationPayload,
} from "../shared/types/logistics";
import { httpClient } from "./httpclient";

class LogisticService {
  private ediCodeMappingCache = new Map<
    string,
    Promise<EDICodeToStatusMappingResponse>
  >();

  async getLoadTenders(
    payload: LoadTenderListRequest,
  ): Promise<LoadTenderListResponse> {
    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.GET_LOAD_TENDERS,
      true,
      payload,
    );
  }
  async getPartnerDetails(soId: number) {
    const url = `${NON_RETAIL_API_ENDPOINTS.GET_PARTNER_DETAILS}${soId}`;

    return httpClient.apihelper(HTTP_METHODS.GET, url) as Promise<
      PartnerDetail[]
    >;
  }
  async getRouteIds(): Promise<string> {
    const url = `${LOGISTICS_API_ENDPOINTS.GET_ROUTE_IDS}`;

    return httpClient.apihelper(HTTP_METHODS.GET, url) as Promise<string>;
  }

  async getProbillList(id: string): Promise<Record<string, unknown>> {
    const url = `${LOGISTICS_API_ENDPOINTS.GET_PROBILL_LISTING}?id=${id}`;

    return httpClient.apihelper(HTTP_METHODS.POST, url);
  }

  // ─── Shipment Status ──────────────────────────────────────────────────────

  async getShipmentStatus(
    probillNo: string,
    subOrgLocId: string | number,
    roleType: string,
    start = 0,
    length = 10,
  ): Promise<ShipmentStatusResponse> {
    const payload = buildShipmentStatusPayload({
      probillNo,
      subOrgLocId,
      roleType,
      start,
      length,
    });

    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.GET_SHIPMENT_STATUS,
      true,
      payload,
    );
  }

  // ─── Shipment Status History ──────────────────────────────────────────────

  async getShipmentStatusHistory(
    probillNo: string,
    subOrgLocId: string | number,
    roleType: string,
    start = 0,
    length = 100,
  ): Promise<ShipmentStatusHistoryResponse> {
    const payload = buildShipmentStatusPayload({
      probillNo,
      subOrgLocId,
      roleType,
      start,
      length,
    });

    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.GET_SHIPMENT_STATUS_HISTORY,
      true,
      payload,
    );
  }

  // ─── Create / Update Shipment Status (214) ────────────────────────────────

  async createShipmentStatus(
    payload: Process214Payload | CreateShipmentStatusPayload,
  ): Promise<CreateShipmentStatusResponse> {
    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.CREATE_SHIPMENT_STATUS,
      true,
      payload,
    );
  }

  // ─── Insert Border Crossing Location ──────────────────────────────────────

  async insertBorderCrossingLocation(
    payload: InsertBorderCrossingLocationPayload,
  ): Promise<unknown> {
    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.INSERT_BORDER_CROSSING_LOCATION,
      true,
      payload,
      {},
      "text",
    );
  }

  async getBorderCrossingLocation(shipmentNo: string): Promise<unknown> {
    return httpClient.apihelper(
      HTTP_METHODS.GET,
      `${LOGISTICS_API_ENDPOINTS.GET_STOPOFF_LOCATIONS}/${shipmentNo}`,
    );
  }

  // ─── Logistics Invoices ───────────────────────────────────────────────────

  async getLogisticsInvoicesList(
    filters: LogisticsInvoicesFilters,
    subOrgLocId: number,
    roleType: string,
    start: number,
    length: number,
    searchTerm: string,
  ): Promise<LogisticsInvoicesResponse> {
    const payload = buildLogisticsInvoicesPayload(
      filters,
      subOrgLocId,
      roleType,
      start,
      length,
      searchTerm,
    );

    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.GET_LOGISTICS_INVOICES_LISTING,
      true,
      payload,
    );
  }

  async getLogisticsInvoiceDetails(
    invoiceId: string,
  ): Promise<LogisticsInvoiceDetailsResponse> {
    const url =
      `${LOGISTICS_API_ENDPOINTS.GET_LOGISTICS_INVOICE_DETAILS}` +
      `?invoiceId=${encodeURIComponent(invoiceId)}`;

    return httpClient.apihelper(HTTP_METHODS.POST, url, true);
  }

  async getEDICodeToStatusMapping(
    codeType: string,
    solocid: number,
  ): Promise<EDICodeToStatusMappingResponse> {
    const cacheKey = `${codeType}_${solocid}`;
    if (this.ediCodeMappingCache.has(cacheKey)) {
      return this.ediCodeMappingCache.get(cacheKey)!;
    }

    const params = new URLSearchParams({
      codeType,
      solocid: String(solocid),
    });

    const url = `${LOGISTICS_API_ENDPOINTS.GET_LOGISTICS_CONFIG_STATUS}?${params.toString()}`;

    const promise = httpClient.apihelper(HTTP_METHODS.GET, url).catch((err) => {
      this.ediCodeMappingCache.delete(cacheKey);
      throw err;
    });

    this.ediCodeMappingCache.set(cacheKey, promise);
    return promise;
  }

  async getShipmentStatusesForTradingPartner(
    solocid: number,
  ): Promise<TradingPartnerSavedStatus[]> {
    const url =
      `${LOGISTICS_API_ENDPOINTS.GET_LOGISTICS_CONFIG_SAVED_STATUS}/` +
      encodeURIComponent(String(solocid));

    return httpClient.apihelper(HTTP_METHODS.GET, url);
  }

  async addOrUpdateStatusConfig(
    payload: TradingPartnerStatusConfigPayload[],
  ): Promise<string> {
    return httpClient.apihelper(
      HTTP_METHODS.POST,
      LOGISTICS_API_ENDPOINTS.GET_LOGISTICS_CONFIG_SAVE,
      true,
      payload,
      {},
      "text",
    );
  }
}

export const logisticsService = new LogisticService();
