import type { LogisticsInvoicesFilters } from "../../../shared/types/logistics";

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
    columns: [
      {
        Data: "erpName",
        Name: "ErpName",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "reciever",
        Name: "Reciever",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "messages",
        Name: "Messages",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "region",
        Name: "Region",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "partnerName",
        Name: "PartnerName",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "sender",
        Name: "Sender",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "poNumber",
        Name: "PONumber",
        Searchable: true,
        Orderable: true,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "poDate",
        Name: "DocumentDate",
        Searchable: true,
        Orderable: true,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "shipDate",
        Name: "ShipDate",
        Searchable: true,
        Orderable: true,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "status",
        Name: "Status",
        Searchable: true,
        Orderable: true,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "",
        Name: "",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "poAcknowledgedStatus",
        Name: "A",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "sentToWareHouseStatus",
        Name: "W",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "shippedStatus",
        Name: "S",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "invoicedStatus",
        Name: "I",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "remittanceStatus",
        Name: "R",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "logoURL",
        Name: "LogoURL",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "preparingShipmentStatus",
        Name: "p",
        Searchable: true,
        Orderable: false,
        Search: {
          Value: "",
          Regex: false,
        },
      },
      {
        Data: "poHeaderId",
        Name: "POHeaderId",
        Searchable: true,
        Orderable: true,
        Search: {
          Value: "",
          Regex: false,
        },
      },
    ],
    order: [
      {
        Column: 7,
        Dir: "desc",
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
