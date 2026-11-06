import type { LogisticsInvoicesFilters } from "../../../shared/types/logistics";

interface InvoiceDataTableColumn {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: {
    value: string;
    regex: boolean;
  };
}

const createColumn = (
  data: string,
  name: string,
  orderable = false,
): InvoiceDataTableColumn => ({
  data,
  name,
  searchable: true,
  orderable,
  search: {
    value: "",
    regex: false,
  },
});

const invoiceColumns: InvoiceDataTableColumn[] = [
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
  createColumn("", ""),
  createColumn("poAcknowledgedStatus", "A"),
  createColumn("sentToWareHouseStatus", "W"),
  createColumn("shippedStatus", "S"),
  createColumn("invoicedStatus", "I"),
  createColumn("remittanceStatus", "R"),
  createColumn("logoURL", "LogoURL"),
  createColumn("preparingShipmentStatus", "p"),
  createColumn("poHeaderId", "POHeaderId", true),
];

export const buildLogisticsInvoicesPayload = (
  filters: LogisticsInvoicesFilters,
  subOrgLocId: number,
  roleType: string,
  start = 0,
  length = 10,
  searchTerm = "",
) => ({
  dataTablesParameters: {
    draw: 1,
    columns: invoiceColumns,
    order: [
      {
        column: 7,
        dir: "desc" as const,
      },
    ],
    start,
    length,
    search: {
      value: searchTerm.trim(),
      regex: false,
    },
  },

  id: "",
  subOrgLocId,
  RoleType: roleType,

  filters: [
    {
      name: "fromDate",
      value: filters.fromDate ? [filters.fromDate] : [],
    },
    {
      name: "toDate",
      value: filters.toDate ? [filters.toDate] : [],
    },
    {
      name: "recieverFilter",
      value: [],
    },
    {
      name: "tradingPartnerFilter",
      value: filters.partnerOrganization.filter((value) => value !== ""),
    },
    {
      name: "statusFilter",
      value: [],
    },
    {
      name: "regionFilter",
      value: [],
    },
    {
      name: "organisationFilter",
      value: [],
    },
    {
      name: "routeFilter",
      value: [],
    },
    {
      name: "documentFilter",
      value: [],
    },
  ],
});
