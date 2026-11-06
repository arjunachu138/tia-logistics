import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Breadcrumbs, Link, Tooltip, Typography } from "@mui/material";

import { icons } from "../../../assets/icons";
import { AppImage, Table, ToCard } from "../../../components";
import type { Column } from "../../../components/table/table";
import { logisticsService } from "../../../services";
import styles from "./probills.module.css";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LineItem {
  refNo: string;
  cargo: string;
  quantity: string;
  weight: string;
  volume: string;
}

export interface PORow {
  srNo: string;
  pickupDate: Date | string;
  deliveryDate: Date | string;
  viewDetails: boolean;
  shipTo?: {
    subtitle?: string;
    details?: string;
  };
  shipFrom?: {
    subtitle?: string;
    details?: string;
  };
  lineItems?: LineItem[];
}

// ─── Columns & Default Data for Sub-Details ───────────────────────────────────

const lineItemColumns: Column<LineItem>[] = [
  {
    key: "refNo",
    title: "REF. No.",
    sortable: false,
    type: "string",
    align: "center",
  },
  {
    key: "cargo",
    title: "Cargo",
    sortable: false,
    type: "string",
    align: "center",
  },
  {
    key: "quantity",
    title: "QUANTITY",
    sortable: false,
    type: "string",
    align: "center",
  },
  {
    key: "volume",
    title: "Volume",
    sortable: false,
    type: "string",
    align: "center",
  },
  {
    key: "weight",
    title: "Weight",
    sortable: false,
    type: "string",
    align: "center",
  },
];

// ─── Probill Row Accordion Details ───────────────────────────────────────────

const ProbillRowDetails = ({ row }: { row: PORow }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const items = row.lineItems && row.lineItems.length > 0 ? row.lineItems : [];
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageData = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div
      className={styles.detailsContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={styles.accordionTitle}>Address Details</span>

      <div className={styles.accordionBody}>
        <div className={styles.addressContainer}>
          <ToCard
            title="Ship To"
            subtitle={
              row.shipTo?.subtitle || "Centennial Food Group / Medex Fish"
            }
            details={
              row.shipTo?.details ||
              "50 Leek Crescent, Richmond Hill, ON  L4B 4J3, Canada, 50987"
            }
          />
          <ToCard
            title="Ship From"
            subtitle={row.shipFrom?.subtitle || "Voila CFC1 GTA"}
            details={
              row.shipFrom?.details ||
              "50 Leek Crescent, Richmond Hill, ON  L4B 4J3, Canada, 50987"
            }
          />
        </div>
      </div>

      <span className={styles.accordionTitle}>Charge Details</span>

      <div className={styles.lineItemTableCard}>
        <Table<LineItem>
          columns={lineItemColumns}
          data={pageData}
          showPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={items.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

// ─── Main Probills Page Component ─────────────────────────────────────────────

const Probills = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [allData, setAllData] = useState<PORow[]>([]);
  const [poNo, setPoNo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

  const toggleRowExpand = (srNo: string) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(srNo)) {
        next.delete(srNo);
      } else {
        next.add(srNo);
      }
      return next;
    });
  };

  useEffect(() => {
    let isCurrent = true;

    const fetchProbills = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await logisticsService.getProbillList(id);
        if (!isCurrent) return;

        let parsed: unknown = response;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            console.log("error");
          }
        }

        let rawList: Record<string, unknown>[] = [];
        if (Array.isArray(parsed)) {
          rawList = parsed as Record<string, unknown>[];
        } else if (parsed && typeof parsed === "object") {
          const rec = parsed as Record<string, unknown>;
          if (Array.isArray(rec.data)) {
            rawList = rec.data as Record<string, unknown>[];
          } else if (Array.isArray(rec.result)) {
            rawList = rec.result as Record<string, unknown>[];
          } else if (Array.isArray(rec.probills)) {
            rawList = rec.probills as Record<string, unknown>[];
          } else if (Array.isArray(rec.probillList)) {
            rawList = rec.probillList as Record<string, unknown>[];
          } else if (Object.keys(rec).length > 0) {
            rawList = [rec];
          }
        }
        console.log(rawList);
        setPoNo((rawList[0]?.poNo as string) || "");

        const rows: PORow[] = rawList.flatMap((item, parentIndex) => {
          const probillDetails = Array.isArray(item.probillDetails)
            ? (item.probillDetails as Record<string, unknown>[])
            : [];

          return probillDetails.map((probill, index) => {
            const shipFrom = probill.shipFromAddress as
              | Record<string, string>
              | undefined;

            const shipTo = probill.shipToAddress as
              | Record<string, string>
              | undefined;

            const rawItems = Array.isArray(probill.itemLevelDetails)
              ? (probill.itemLevelDetails as Record<string, unknown>[])
              : [];

            const lineItems: LineItem[] = rawItems.map((li) => ({
              refNo: String(li.refNumber ?? "--"),
              cargo: String(li.cargoDescription ?? "--"),
              quantity: `${String(li.quantity) || ""} ${String(li.quantityUnit) || ""}`,

              volume: `${String(li.volume) || ""} ${String(li.volumeUnit) || ""}`,

              weight: String(li.weight ?? li.weightUnit ?? ""),
            }));

            return {
              srNo: String(parentIndex + index + 1).padStart(2, "0"),
              pickupDate: probill.pickupDate
                ? dayjs(probill.pickupDate as string).toDate()
                : "--",
              deliveryDate: probill.deliverDate
                ? dayjs(probill.deliverDate as string).toDate()
                : "--",
              viewDetails: true,
              shipFrom: shipFrom
                ? {
                    subtitle: String(shipFrom.locationName ?? "--"),
                    details: [
                      shipFrom.address1,
                      shipFrom.city,
                      shipFrom.state,
                      shipFrom.postalCode,
                      shipFrom.country,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  }
                : undefined,
              shipTo: shipTo
                ? {
                    subtitle: String(shipTo.locationName ?? "--"),
                    details: [
                      shipTo.address1,
                      shipTo.city,
                      shipTo.state,
                      shipTo.postalCode,
                      shipTo.country,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  }
                : undefined,
              lineItems,
            };
          });
        });
        setAllData(rows);
      } catch (err) {
        console.error("Failed to fetch probill list:", err);
        setAllData([]);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchProbills();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  console.log("Probills Data:", allData);

  const poColumns: Column<PORow>[] = [
    { key: "srNo", title: "SR NO", width: 80, sortable: false, type: "string" },
    {
      key: "pickupDate",
      title: "Pickup Date",
      sortable: true,
      type: "date",
    },
    {
      key: "deliveryDate",
      title: "Delivery Date",
      sortable: true,
      type: "date",
    },
    {
      key: "expand",
      title: "View Details",
      width: 44,
      align: "center",
      render: (_, row) => {
        const isExpanded = expandedRowIds.has(row.srNo);
        return (
          <Tooltip
            title={!isExpanded ? "Show Details" : "Hide Details"}
            placement="top"
            arrow
            classes={{
              tooltip: styles.tooltip,
              arrow: styles.tooltipArrow,
            }}
          >
            <span
              className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpand(row.srNo);
              }}
            >
              <AppImage
                iconPath={icons.downArrowIconB}
                width="14px"
                height="14px"
              />
            </span>
          </Tooltip>
        );
      },
    },
    // {
    //   key: "viewDetails",
    //   title: "View Details",
    //   width: 80,
    //   align: "center",
    //   type: "action",
    //   actions: [
    //     {
    //       id: "view",
    //       label: "View Details",
    //       icon: (
    //         <Tooltip
    //           title="View Details"
    //           placement="top"
    //           arrow
    //           classes={{
    //             tooltip: styles.tooltip,
    //             arrow: styles.tooltipArrow,
    //           }}
    //         >
    //           <span className={styles.tooltipTrigger}>
    //             <AppImage iconPath={icons.EyeIcon} width="18" height="18" />
    //           </span>
    //         </Tooltip>
    //       ),
    //       onClick: (row) => toggleRowExpand(row.srNo),
    //     },
    //   ],
    // },
  ];

  return (
    <div className={styles.container}>
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
          className={styles.breadcrumbLink}
          sx={{
            color: "#434343",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Home
        </Link>
        <Link
          onClick={() => navigate("/logistics/load-tenders")}
          underline="none"
          className={styles.breadcrumbLink}
          sx={{
            color: "#141414",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Load Tenders
        </Link>
        <Typography
          sx={{
            color: "#7b7b7b",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {id ? `Probill - ${poNo}` : "Probills"}
        </Typography>
      </Breadcrumbs>

      <div className={styles.tableCard}>
        <Table<PORow>
          columns={poColumns}
          data={allData}
          loading={loading}
          totalRecords={allData.length}
          onRowClick={(row) => toggleRowExpand(row.srNo)}
          isRowExpanded={(row) => expandedRowIds.has(row.srNo)}
          renderExpandedRow={(row) => (
            <ProbillRowDetails key={row.srNo} row={row} />
          )}
        />
      </div>
    </div>
  );
};

export default Probills;
