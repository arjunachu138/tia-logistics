export interface DataTableColumnItem {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: {
    value: string;
    regex: boolean;
  };
}

export interface DataTableOrderItem {
  column: number;
  dir: "asc" | "desc";
}

export interface FilterItem {
  name: string;
  value: unknown[] | string;
}

export interface ShipmentStatusPayload {
  dataTablesParameters: {
    draw: number;
    columns: DataTableColumnItem[];
    order: DataTableOrderItem[];
    start: number;
    length: number;
    search: {
      value: string;
      regex: boolean;
    };
  };
  id: string;
  subOrgLocId: number | string;
  RoleType: string;
  filters: FilterItem[];
}

const createColumn = (
  data: string,
  name: string,
  orderable = false,
): DataTableColumnItem => ({
  data,
  name,
  searchable: true,
  orderable,
  search: {
    value: "",
    regex: false,
  },
});

export const shipmentStatusColumns: DataTableColumnItem[] = [
  createColumn("erpName", "ErpName"),
  createColumn("reciever", "Reciever"),
  createColumn("messages", "Messages"),
  createColumn("region", "Region"),
  createColumn("partnerName", "PartnerName"),
  createColumn("sender", "Sender"),
  createColumn("poNumber", "PONumber", true),
  createColumn("poDate", "DocumentDate", true),
  createColumn("shipDate", "ShipDate", true),
  createColumn("status", "Status", true),
  createColumn("no data", "no name"),
  createColumn("poAcknowledgedStatus", "A"),
  createColumn("sentToWareHouseStatus", "W"),
  createColumn("shippedStatus", "S"),
  createColumn("invoicedStatus", "I"),
  createColumn("remittanceStatus", "R"),
  createColumn("logoURL", "LogoURL"),
  createColumn("preparingShipmentStatus", "p"),
  createColumn("poHeaderId", "POHeaderId", true),
];

export const defaultFiltersList: FilterItem[] = [
  { name: "fromDate", value: [] },
  { name: "toDate", value: [] },
  { name: "recieverFilter", value: [] },
  { name: "tradingPartnerFilter", value: [] },
  { name: "statusFilter", value: [] },
  { name: "regionFilter", value: [] },
  { name: "organisationFilter", value: [] },
  { name: "routeFilter", value: [] },
  { name: "documentFilter", value: [] },
];

export interface BuildShipmentStatusPayloadOptions {
  probillNo: string;
  subOrgLocId?: string | number;
  roleType?: string;
  draw?: number;
  start?: number;
  length?: number;
  searchValue?: string;
  orderColumn?: number;
  orderDir?: "asc" | "desc";
  filters?: FilterItem[];
}

export const buildShipmentStatusPayload = ({
  probillNo,
  subOrgLocId,
  roleType,
  draw = 1,
  start = 0,
  length = 10,
  searchValue = "",
  orderColumn = 7,
  orderDir = "desc",
  filters = defaultFiltersList,
}: BuildShipmentStatusPayloadOptions): ShipmentStatusPayload => ({
  dataTablesParameters: {
    draw: Number(draw),
    columns: shipmentStatusColumns,
    order: [
      {
        column: Number(orderColumn),
        dir: orderDir,
      },
    ],
    start: Number(start),
    length: Number(length),
    search: {
      value: searchValue.trim(),
      regex: false,
    },
  },
  id: String(probillNo || ""),
  subOrgLocId:
    subOrgLocId !== undefined && subOrgLocId !== null && subOrgLocId !== ""
      ? Number.isNaN(Number(subOrgLocId))
        ? subOrgLocId
        : Number(subOrgLocId)
      : 2514,
  RoleType: roleType || "Admin",
  filters,
});
