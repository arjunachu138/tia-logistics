import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Link, Typography, CircularProgress } from "@mui/material";

import { Table, ToCard } from "../../../components";
import type { Column } from "../../../components/table/table";
import { logisticsService } from "../../../services";
import type {
  LogisticsInvoiceAddress,
  LogisticsInvoiceDetail,
} from "../../../shared/types/logistics";

import dayjs from "dayjs";
import styles from "./logistics-InvoiceDetails.module.css";
import { getCurrencySymbol } from "../../../shared/utils";
import InvoiceDetailsCard from "../components/invoice-details-card/InvoiceDetailsCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  charge: string;
  chargeValue: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const displayValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return String(value);
};

const formatInvoiceDate = (value: string | null | undefined): string => {
  if (!value || !dayjs(value).isValid()) {
    return "--";
  }

  return dayjs(value).format("DD MMM YYYY");
};

const formatAmount = (
  value: number | null | undefined,
  currency: string | null | undefined,
): string => {
  if (value === null || value === undefined) {
    return "--";
  }

  const amount = value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const symbol = getCurrencySymbol(currency);

  if (!symbol) {
    return amount;
  }

  // Add a space for currency codes used as fallbacks, such as CHF.
  const isCurrencyCode =
    currency != null && symbol.toUpperCase() === currency.toUpperCase();

  return `${symbol}${isCurrencyCode ? " " : ""}${amount}`;
};

const getAddressText = (
  address: LogisticsInvoiceAddress | undefined,
): string => {
  if (!address) {
    return "No address available";
  }

  const cityState = [address.partyCity, address.partyState]
    .filter(Boolean)
    .join(", ");

  const postalCountry = [address.partyPostalId, address.partyCountry?.trim()]
    .filter(Boolean)
    .join(" ");

  return (
    [address.partyAddrLine1, address.partyAddrLine2, cityState, postalCountry]
      .filter(Boolean)
      .join(", ") || "No address available"
  );
};

const getLineItems = (
  invoice: LogisticsInvoiceDetail,
  currency: string | null,
): LineItem[] => {
  return (invoice.invoiceAssignedNumber ?? []).flatMap(
    (assigned, groupIndex) => {
      const descriptions = assigned.invoiceDescMarksNum ?? [];
      const charges = assigned.invoiceRateAndCharge ?? [];

      return charges.map((charge, chargeIndex) => {
        const matchingDescription = descriptions.find(
          (item) =>
            item.ladingLineItemNo === charge.ladingLineItemNo &&
            Boolean(item.ladingDesc),
        );

        const description =
          matchingDescription?.ladingDesc ??
          descriptions[chargeIndex]?.ladingDesc ??
          charge.specialChargeDesc ??
          charge.specialChargeCode ??
          "--";

        const parsedCharge =
          charge.charge === null || charge.charge === ""
            ? null
            : Number(charge.charge);

        const validCharge =
          parsedCharge !== null && Number.isFinite(parsedCharge)
            ? parsedCharge
            : null;

        return {
          id: `${groupIndex}-${chargeIndex}`,
          description,
          charge: formatAmount(validCharge, currency),
          chargeValue: validCharge ?? 0,
        };
      });
    },
  );
};

// ─── Table Columns ────────────────────────────────────────────────────────────

const lineItemColumns: Column<LineItem>[] = [
  {
    key: "description",
    title: "Description",
    sortable: false,
    type: "string",
  },
  {
    key: "charge",
    title: "Charge",
    sortable: false,
    type: "string",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const LogisticsInvoiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice] = useState<LogisticsInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInvoiceDetails = async () => {
      if (!id) {
        setError("Invoice ID is missing from the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setInvoice(null);

      try {
        const response = await logisticsService.getLogisticsInvoiceDetails(id);

        if (cancelled) return;

        const invoiceData = response?.[0];

        if (!invoiceData) {
          throw new Error("No invoice details were returned.");
        }

        setInvoice(invoiceData);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch invoice details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchInvoiceDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const backToInvoices = () => {
    navigate("/logistics/invoices");
  };

  if (loading) {
    return (
      <div className={styles.poDetailContainer}>
        <CircularProgress size={32} />
        <Typography>Loading invoice details...</Typography>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className={styles.poDetailContainer}>
        <Typography variant="h6">Unable to load invoice</Typography>
        <Typography color="text.secondary">
          {error ?? "Invoice details were not found."}
        </Typography>
        <button type="button" onClick={backToInvoices}>
          Back to Invoices
        </button>
      </div>
    );
  }

  // ─── Derived API Data ───────────────────────────────────────────────────────

  const total = invoice.invoiceTotalWeightAndCharge?.[0];
  const currency = invoice.currencyCode;

  const getAddress = (partyTypeCode: string) =>
    invoice.invoiceAddrDetail?.find(
      (address) => address.partyTypeCode === partyTypeCode,
    );

  const quantity = total?.totalLadingQty ?? null;

  const orderNumber = invoice.invoiceRefId?.find(
    (reference) => reference.refIdqlf === "PO",
  )?.refId;

  const description = invoice.invoiceRefId?.find((reference) =>
    Boolean(reference.freeFormDesc),
  )?.freeFormDesc;

  const invoiceDetailsData = {
    Division: displayValue(invoice.divisionName),
    TradingPartner: displayValue(invoice.tradingPartnerName),
    AccountName: displayValue(invoice.primaryReceiverId),
    Quantity: displayValue(quantity),
    TotalCharge: formatAmount(total?.totalCharge ?? null, currency),
    TotalAmount: formatAmount(invoice?.netAmountDue ?? null, currency),
    Currency: displayValue(currency),
    BolNo: displayValue(invoice.shipmentIdentificationNumber),
    OrderNo: displayValue(orderNumber),
    Description: displayValue(description),
  };

    const actDelDate = invoice.invoiceDateTimeRef?.find((reference) =>
    Boolean(reference.date),
  )?.date;

  const lineItems = getLineItems(invoice, currency);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.chargeValue, 0);

  const addressCards = [
    { title: "Ship From", code: "SF" },
    { title: "Ship To", code: "ST" },
    { title: "Bill From", code: "BF" },
    { title: "Bill To", code: "BT" },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.poDetailContainer}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="/"
        sx={{
          "& .MuiBreadcrumbs-ol": { alignItems: "center" },
          "& .MuiBreadcrumbs-separator": { margin: "0 5px" },
        }}
      >
        <Link
          onClick={() => navigate("/")}
          underline="none"
          sx={{
            color: "#434343",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Home
        </Link>

        <Typography sx={{ color: "#141414", fontSize: "13px" }}>
          Logistics
        </Typography>

        <Link
          onClick={backToInvoices}
          underline="none"
          sx={{
            color: "#141414",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Invoices
        </Link>

        <Typography sx={{ color: "#7b7b7b", fontSize: "13px" }}>
          View Invoice
        </Typography>
      </Breadcrumbs>

      {/* Invoice Header */}
      <div className={styles.headerCard}>
        <div className={styles.topSection}>
          <div className={styles.orderInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.orderNumber}>
                #{displayValue(invoice.invoiceNumber)}
              </h1>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Invoice Date:</span>
                <strong className={styles.metaValue}>
                  {formatInvoiceDate(invoice.billingDate)}
                </strong>
              </div>

              <div className={styles.divider} />

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>
                  Expected Delivery Date:
                </span>
                <strong className={styles.metaValue}>
                  {formatInvoiceDate(invoice.deliveryDate)}
                </strong>
              </div>

              <div className={styles.divider} />

              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Actual Delivery Date:</span>
                <strong className={styles.metaValue}>
                  {formatInvoiceDate(actDelDate)}
                </strong>
              </div>
            </div>
          </div>

          <div className={styles.customer}>
            {displayValue(invoice.tradingPartnerName)}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className={styles.orderDetailsCol}>
        <InvoiceDetailsCard data={invoiceDetailsData} />
      </div>

      {/* Addresses */}
      <div className={styles.addressCol}>
        {addressCards.map(({ title, code }) => {
          const address = getAddress(code);

          const subtitle = address
            ? [address.partyName1, address.partyName2]
                .filter(Boolean)
                .join(" ") || "--"
            : "--";

          return (
            <ToCard
              key={title}
              title={title}
              subtitle={subtitle}
              details={getAddressText(address)}
            />
          );
        })}
      </div>

      {/* Charge Details and Total Charges */}
      <div className={styles.footer}>
        <div className={styles.lineItemsCard}>
          <div className={styles.lineItemsHeader}>
            <div className={styles.lineItemsTitleGroup}>
              <span className={styles.lineItemsTitle}>Charge Details</span>
            </div>
          </div>

          <Table<LineItem> columns={lineItemColumns} data={lineItems} />
        </div>

        <div className={styles.card}>
          <div className={styles.summaryRow}>
            <span className={styles.label}>Total Charges</span>
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalContent}>
              <span className={styles.totalLabel}>Grand Total</span>
              <span className={styles.totalValue}>
                {formatAmount(grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsInvoiceDetails;
