export const CARRIER_CONFIG = {
  DEFAULT_CARRIERS: ["Our Truck", "Freightcom Inc.", "Kinderslay"],
  POLYBOND_SOLOC_ID: "3596",
  POLYBOND_ADDITIONAL_CARRIERS: ["UPSG", "FXFR"],
} as const;
export const PACKAGING_CONFIG = {
  OUTER_PACKS: ["Pallet", "Container", "Carton", "Box", "Bundle", "NA"],

  INNER_PACKS: ["Carton", "Box", "Bag", "Bundle", "Roll", "EA"],
} as const;
export const getCarrierNames = (soLocId?: string | number | null): string[] => {
  const isPolybond =
    soLocId !== undefined &&
    soLocId !== null &&
    String(soLocId).trim() === CARRIER_CONFIG.POLYBOND_SOLOC_ID;

  if (isPolybond) {
    return [
      ...CARRIER_CONFIG.DEFAULT_CARRIERS,
      ...CARRIER_CONFIG.POLYBOND_ADDITIONAL_CARRIERS,
    ];
  }

  return [...CARRIER_CONFIG.DEFAULT_CARRIERS];
};

const manufacturerCodeBySolocId: Record<number, string> = {
  3602: "123456789000",
  3642: "380023307000",
  3538: "456700000000",
  3537: "629124000000",
};

export interface TaxOption {
  label: string;
  value: string;
  taxTypeCode: string;
  taxPercent: number;
  taxJurisdiction: string;
}
export const RETAIL_TAX_OPTIONS: TaxOption[] = [
  {
    label: "-- Select Tax Pay --",
    value: "",
    taxTypeCode: "",
    taxPercent: 0,
    taxJurisdiction: "",
  },
  {
    label: "No Taxes (0%)",
    value: "NO_TAX",
    taxTypeCode: "",
    taxPercent: 0,
    taxJurisdiction: "",
  },
  {
    label: "Canada GST (5%)",
    value: "CANADA_GST",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Canada GST",
  },
  {
    label: "Alberta (5%)",
    value: "ALBERTA",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Alberta",
  },
  {
    label: "British Columbia (5%)",
    value: "BRITISH_COLUMBIA",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "British Columbia",
  },
  {
    label: "Manitoba (5%)",
    value: "MANITOBA",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Manitoba",
  },
  {
    label: "New Brunswick (15%)",
    value: "NEW_BRUNSWICK",
    taxTypeCode: "TX",
    taxPercent: 15,
    taxJurisdiction: "New Brunswick",
  },
  {
    label: "Newfoundland and Labrador (15%)",
    value: "NEWFOUNDLAND_AND_LABRADOR",
    taxTypeCode: "TX",
    taxPercent: 15,
    taxJurisdiction: "Newfoundland and Labrador",
  },
  {
    label: "Northwest Territories (5%)",
    value: "NORTHWEST_TERRITORIES",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Northwest Territories",
  },
  {
    label: "Nova Scotia (15%)",
    value: "NOVA_SCOTIA",
    taxTypeCode: "TX",
    taxPercent: 15,
    taxJurisdiction: "Nova Scotia",
  },
  {
    label: "Nunavut (5%)",
    value: "NUNAVUT",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Nunavut",
  },
  {
    label: "Ontario (13%)",
    value: "ONTARIO",
    taxTypeCode: "TX",
    taxPercent: 13,
    taxJurisdiction: "Ontario",
  },
  {
    label: "Prince Edward Island (PEI) (15%)",
    value: "PRINCE_EDWARD_ISLAND",
    taxTypeCode: "TX",
    taxPercent: 15,
    taxJurisdiction: "Prince Edward Island",
  },
  {
    label: "Quebec (14.98%)",
    value: "QUEBEC",
    taxTypeCode: "GS 5% SP 9.975%",
    taxPercent: 14.98,
    taxJurisdiction: "Quebec",
  },
  {
    label: "Saskatchewan (5%)",
    value: "SASKATCHEWAN",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Saskatchewan",
  },
  {
    label: "Yukon (5%)",
    value: "YUKON",
    taxTypeCode: "GS",
    taxPercent: 5,
    taxJurisdiction: "Yukon",
  },
];

export interface PaymentTermsConfig {
  solocId: number;
  termsPercent: number;
  termsNetDays: number;
  termsDueDays: number;
  customer: string;
}

export const PAYMENT_TERMS_CONFIG: PaymentTermsConfig[] = [
  {
    solocId: 1387,
    termsPercent: 2,
    termsNetDays: 60,
    termsDueDays: 45,
    customer: "Swift Innovations",
  },
  {
    solocId: 3537,
    termsPercent: 2,
    termsNetDays: 60,
    termsDueDays: 45,
    customer: "Swift Innovations",
  },
];

export interface POColumnConfig {
  customerID: string;
  erpColumnRequired: boolean;
  AckColumnRequired: boolean;
  ShipmentColumnRequired: boolean;
  InvoiceColumnRequired: boolean;
}

export const PO_COLUMN_CONFIG: POColumnConfig[] = [
  {
    customerID: "3537",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3533",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "2524",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3550",
    erpColumnRequired: true,
    AckColumnRequired: true,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3539",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3551",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3556",
    erpColumnRequired: true,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3562",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "2522",
    erpColumnRequired: true,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: false,
  },
  {
    customerID: "3570",
    erpColumnRequired: false,
    AckColumnRequired: true,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3569",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3571",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3573",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3584",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3566",
    erpColumnRequired: false,
    AckColumnRequired: true,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3600",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3596",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3574",
    erpColumnRequired: false,
    AckColumnRequired: true,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3602",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3604",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "2526",
    erpColumnRequired: false,
    AckColumnRequired: true,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3610",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: false,
  },
  {
    customerID: "3612",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },

  {
    customerID: "3621",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: false,
  },
  {
    customerID: "3624",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },

  {
    customerID: "3631",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },

  {
    customerID: "3578",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: false,
    InvoiceColumnRequired: true,
  },
  {
    customerID: "3641",
    erpColumnRequired: false,
    AckColumnRequired: false,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: false,
  },
  {
    customerID: "3642",
    erpColumnRequired: true,
    AckColumnRequired: true,
    ShipmentColumnRequired: true,
    InvoiceColumnRequired: true,
  },
];

export const config = {
  nonRetailBaseUrl: import.meta.env.VITE_NON_RETAIL_BASE_URL,
  retailBaseUrl: import.meta.env.VITE_RETAIL_BASE_URL,
  logisticsBaseUrl: import.meta.env.VITE_LOGISTICS_BASE_URL,
  carriers: CARRIER_CONFIG,
  packaging: PACKAGING_CONFIG,
  manufacturerCodes: manufacturerCodeBySolocId,
  taxOptions: RETAIL_TAX_OPTIONS,
  paymentTerms: PAYMENT_TERMS_CONFIG,
  poColumnConfig: PO_COLUMN_CONFIG,
};
