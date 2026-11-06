import { config } from "../app/config";

const BASE_URL = config.nonRetailBaseUrl;
export const NON_RETAIL_API_ENDPOINTS = {
  USER_LOGIN: `${BASE_URL}account/UserLogin`,
  GET_PARTNER_DETAILS: `${BASE_URL}SubOrgLoc/GetTradingPartnerBySOLocID/`,
  GET_DASHBOARD_GRAPH: `${BASE_URL}TiA/GetOverallAnlyticsDataForSeller`,
  GENERATE_GRAPH_REPORT: `${BASE_URL}TiA/generateGraphReport/`,

  GET_POSTATUS: `${BASE_URL}Analytics/GetDocumentStatuses/Purchase Order`,
  GET_POLISTING: `${BASE_URL}PurchaseOrder/GetPagedPO`,
  GET_PURCHASE_ORDER: `${BASE_URL}PurchaseOrder/GetPurchaseOrder`,

  GET_POREPORT: `${BASE_URL}PurchaseOrder/GetPOReport/`,
  GENERATE_MULTIPLE_ORDER_PDF: `${BASE_URL}PurchaseOrder/GenerateMultipleOrderPDF`,
  GET_MULTIPLE_ORDERS_FOR_CSV: `${BASE_URL}PurchaseOrder/GetMultipleOrdersForCSV`,
  GENERATE_PO_ORDER_PDF: `${BASE_URL}PurchaseOrder/GeneratePOPDF`,
  GET_PO_HISTORY: `${BASE_URL}PurchaseOrder/GetPOChangedHistory`,
  GET_UPLOAD_FILE: `${BASE_URL}Tia/FilesUpload`,

  GET_SHIPMENT_STATUSES: `${BASE_URL}Analytics/GetDocumentStatuses/Shipment`,
  GET_PAGED_SHIPMENTS: `${BASE_URL}asn/GetPagedAsn`,
  GET_SEND_ASN: `${BASE_URL}TiA/SendASN`,
  GET_GENERATE_ASN_PDF: `${BASE_URL}ASN/GenerateASNPDF`,
  GET_ASN_REPORT: `${BASE_URL}ASN/GetASNReport/`,
  GET_SHIPMENT_DETAILS_BYID: `${BASE_URL}ASN/GetASNHeaderByID/`,
  GET_ASN_DETAILS: `${BASE_URL}ASN/GetASNDetailsById`,
  GET_GENERATE_ASN_DETAILS_PDF: `${BASE_URL}ASN/GenerateAsnDetailsPDF`,
  GET_PACKAGE_DETAILS: `${BASE_URL}ASN/GetPackagingLevelLabel/`,
  CREATE_SHIPMENT: `${BASE_URL}ASN/ASNCreationModify/Create`,

  GET_INVOICE_LIST: `${BASE_URL}Invoice/GetPagedInvoice`,
  GET_INVOICE_STATUS: `${BASE_URL}Analytics/GetDocumentStatuses/Invoice`,
  GET_INVOICE_REPORT: `${BASE_URL}invoice/GetINVReport/`,
  GET_INVOICE_DETAILS: `${BASE_URL}Invoice/GetInvoiceById`,
  SEND_INVOICE: `${BASE_URL}Invoice/SendInvoice`,
  GENERATE_INVOICE_PDF: `${BASE_URL}Invoice/GenerateInvoicePDF`,
  GENERATE_INVOICE_CSV: `${BASE_URL}Invoice/GenerateInvoiceCSV`,

  GET_DELFOR_STATUSES: `${BASE_URL}Analytics/GetDocumentStatuses/Delivery Forecast`,
  GET_DELFOR_LISTING: `${BASE_URL}DelFor/GetPagedDelFor`,
  GET_DELFOR_PDF: `${BASE_URL}delfor/GenerateDELFORPDF`,
  GET_DELFOR_CSV: `${BASE_URL}TCG830/PlanningScheduleForMultipleCSV`,
  GET_DELFOR_REPORT: `${BASE_URL}Delfor/GetDelforReport`,
  GET_DELFOR_EDI: `${BASE_URL}DelFor/GetEDIFACTFile`,
  GET_INV_LISTING_COUNTS: `${BASE_URL}TCG810/GetInvoiceListingCounts`,
  GET_PO_LISTING_COUNTS: `${BASE_URL}TCG850/GetPOListingCounts`,
  GET_ASN_LISTING_COUNTS: `${BASE_URL}TCG856/GetASNListingCounts`,
  GET_DELFOR_DETAILS:
    "https://tia-gateway-qa.azurewebsites.net/DelFor/GetDelForById/",
  GET_DELFOR_LINE_ITEMS:
    "https://tia-gateway-qa.azurewebsites.net/DelFor/GetDelForDetailsById",
  GET_DELFOR_ITEM_PDF: `${BASE_URL}Delfor/GenerateDELFORITEMPDF`,
  GET_DELFOR_BACKLOG_QUANTITY: `${BASE_URL}DelFor/ViewBacklogQuantity/`,
  GET_DELFOR_ITEM_STATUS: `${BASE_URL}DelFor/ViewDelforItemStatus/`,

  GET_DELJIT_LISTING: `${BASE_URL}DelFor/GetPagedDelFor`,
  GET_DELJIT_STATUSES: `${BASE_URL}Analytics/GetDocumentStatuses/Delivery Forecast`,
  GET_DELJIT_REPORT: `${BASE_URL}DelJit/GetDeljitReport/`,

  PUSH_PO_ACKNOWLEDGEMENT:
    "https://tia-gateway-qa.azurewebsites.net/Doc855/PushPOAcknowledge",
  GET_EDI_FILE_BY_DOC_TYPE: `${BASE_URL}PurchaseOrder/GetEDIFileByDocType/`,
} as const;
