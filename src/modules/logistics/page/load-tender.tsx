import { useEffect, useMemo, useRef, useState } from "react";
import { icons } from "../../../assets/icons";
import {
  AppImage,
  MultiSelectDropdown,
  DateInput,
  Table,
  Input,
  Button,
} from "../../../components";

import type { MultiSelectDropdownOption } from "../../../components/multi-select-dropdown/multiSelectDropdown";
import styles from "./load-tender.module.css";
import type { Dayjs } from "dayjs";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import type { Column } from "../../../components/table/table";

import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";

import type {
  DataTablesColumn,
  LoadTenderListRequest,
} from "../../../shared/types/logistics";
import { useAppSelector } from "../../../store/hooks";
import {
  selectSolocId,
  selectUserRole,
} from "../../../store/user/userSelectors";
import { logisticsService, usePartnerDetails } from "../../../services";

const statusOptions: MultiSelectDropdownOption[] = [
  { label: "Accepted", value: "Accepted" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Delivered", value: "Delivered" },
  { label: "InTransit", value: "InTransit" },
  { label: "Received", value: "Received" },
  { label: "Rejected", value: "Rejected" },
  { label: "Revised", value: "Revised" },
];

interface PORow {
  srNo: string;
  loadTenderid: string;
  customer: string;
  shipmentNo: string;
  tenderReceiveDate: Date;
  status: string;
  routeId: string;
  probillsAvailable: boolean;
  shipmentAvailable: boolean;
}

const loadTenderColumns: DataTablesColumn[] = [
  {
    data: "erpname",
    name: "ErpName",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "reciever",
    name: "Reciever",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "messages",
    name: "Messages",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "region",
    name: "Region",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "partnerName",
    name: "PartnerName",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "sender",
    name: "Sender",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "poNumber",
    name: "PONumber",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
  {
    data: "poDate",
    name: "DocumentDate",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
  {
    data: "shipDate",
    name: "ShipDate",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
  {
    data: "status",
    name: "Status",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
  {
    data: "",
    name: "",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "poAcknowledgedStatus",
    name: "A",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "sentToWareHouseStatus",
    name: "W",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "shippedStatus",
    name: "S",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "invoicedStatus",
    name: "I",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "remittanceStatus",
    name: "R",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "logoURL",
    name: "LogoURL",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "preparingShipmentStatus",
    name: "p",
    searchable: true,
    orderable: false,
    search: { value: "", regex: false },
  },
  {
    data: "poHeaderId",
    name: "POHeaderId",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
  {
    data: "DateReceived",
    name: "DateReceived",
    searchable: true,
    orderable: true,
    search: { value: "", regex: false },
  },
];

const LoadTenders = () => {
  const navigate = useNavigate();
  const subOrgLocId = useAppSelector(selectSolocId);
  const userRole = useAppSelector(selectUserRole);

  const { data: partnerDetails } = usePartnerDetails(subOrgLocId);

  const partnerOptions = useMemo<MultiSelectDropdownOption[]>(
    () =>
      partnerDetails
        ?.map((item) => ({
          label: item.soName ?? "",
          value: String(item.soLocID),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) ?? [],
    [partnerDetails],
  );

  const poColumns: Column<PORow>[] = [
    { key: "srNo", title: "SR NO", width: 70, type: "number" },
    { key: "customer", title: "Customer", type: "string" },
    {
      key: "shipmentNo",
      title: "Shipment Number",

      type: "string",
    },
    {
      key: "tenderReceiveDate",
      title: "Tender Received On",

      type: "date",
    },

    { key: "status", title: "Status", type: "string" },
    {
      key: "routeId",
      title: "Route ID",

      type: "string",
    },

    {
      key: "probillsAction",
      title: "Probills",
      width: 72,
      align: "center",
      type: "action",
      actions: [
        {
          id: "probills",
          label: "Probills View",
          icon: (
            <Tooltip
              title="Probills View"
              placement="top"
              arrow
              classes={{
                tooltip: styles.tooltip,
                arrow: styles.tooltipArrow,
              }}
            >
              <span className={styles.tooltipTrigger}>
                <AppImage iconPath={icons.EyeIcon} width="18" height="18" />
              </span>
            </Tooltip>
          ),
          onClick: (row) =>
            navigate(`/logistics/load-tenders/probills/${row.loadTenderid}`),
        },
      ],
    },
    {
      key: "shipmentAction",
      title: "Shipment",
      width: 72,
      align: "center",
      type: "action",
      render: (_value, row: PORow) => {
        const isShipmentAvailable = row.shipmentAvailable;

        return (
          <Tooltip
            title={
              isShipmentAvailable ? "Shipment View" : "Shipment not available"
            }
            placement="top"
            arrow
            classes={{
              tooltip: styles.tooltip,
              arrow: styles.tooltipArrow,
            }}
          >
            <span
              className={styles.tooltipTrigger}
              style={{
                cursor: isShipmentAvailable ? "pointer" : "not-allowed",
              }}
              onClick={(event) => {
                event.stopPropagation();

                if (!isShipmentAvailable) return;

                navigate(
                  `/logistics/load-tenders/shipment-status/${row.shipmentNo}`,
                );
              }}
              onKeyDown={(event) => {
                if (
                  isShipmentAvailable &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();

                  navigate(
                    `/logistics/load-tenders/shipment-status/${row.shipmentNo}`,
                  );
                }
              }}
              role="button"
              tabIndex={isShipmentAvailable ? 0 : -1}
              aria-label={
                isShipmentAvailable ? "View shipment" : "Shipment not available"
              }
              aria-disabled={!isShipmentAvailable}
            >
              <AppImage
                iconPath={
                  isShipmentAvailable ? icons.EyeIcon : icons.NotAvailIcon
                }
                width="18"
                height="18"
              />
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const [advanceFilterOpen, setAdvanceFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "month").startOf("day"),
  );
  const [toDate, setToDate] = useState<Dayjs | null>(
    dayjs().endOf("day") as Dayjs | null,
  );
  const [status, setStatus] = useState<string[]>([]);
  const [customer, setCustomer] = useState<string[]>([]);
  const [routeId, setRouteId] = useState<string[]>([]);
  const [loadTenderRows, setLoadTenderRows] = useState<PORow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [routeIdOptions, setRouteIdOptions] = useState<
    MultiSelectDropdownOption[]
  >([]);
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: dayjs().subtract(1, "month").startOf("day") as Dayjs | null,
    toDate: dayjs().endOf("day") as Dayjs | null,
    status: [] as string[],
    customer: [] as string[],
    routeId: [] as string[],
  });

  const usedFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.fromDate || appliedFilters.toDate) {
      count += 1;
    }
    if (appliedFilters.status && appliedFilters.status.length > 0) {
      count += 1;
    }
    if (appliedFilters.customer && appliedFilters.customer.length > 0) {
      count += 1;
    }
    if (appliedFilters.routeId && appliedFilters.routeId.length > 0) {
      count += 1;
    }
    return count;
  }, [appliedFilters]);

  const handleClose = () => {
    setAdvanceFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      fromDate,
      toDate,
      status,
      customer,
      routeId,
    });

    setPage(1);
    setAdvanceFilterOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFrom = dayjs().subtract(1, "month").startOf("day");
    const defaultTo = dayjs().endOf("day");

    // Reset filter inputs
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setStatus([]);
    setCustomer([]);
    setRouteId([]);

    // Reset applied filters
    setAppliedFilters({
      fromDate: defaultFrom as Dayjs | null,
      toDate: defaultTo as Dayjs | null,
      status: [],
      customer: [],
      routeId: [],
    });

    setPage(1);
  };

  // Table state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useClickOutside(
    filterRef,
    () => setAdvanceFilterOpen(false),
    advanceFilterOpen,
  );

  const filtered = loadTenderRows.filter((row) => {
    // Search filter
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      row.shipmentNo.toLowerCase().includes(searchValue) ||
      row.customer.toLowerCase().includes(searchValue) ||
      row.routeId.toLowerCase().includes(searchValue);

    // Status filter
    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(row.status);

    // Route ID filter
    const matchesRouteId =
      appliedFilters.routeId.length === 0 ||
      appliedFilters.routeId.includes(row.routeId);

    // Date filters
    const rowDate = row.tenderReceiveDate
      ? new Date(row.tenderReceiveDate)
      : null;

    const fromDate = appliedFilters.fromDate
      ? appliedFilters.fromDate.startOf("day").toDate()
      : null;

    const toDate = appliedFilters.toDate
      ? appliedFilters.toDate.endOf("day").toDate()
      : null;

    const matchesFromDate = !fromDate || !rowDate || rowDate >= fromDate;

    const matchesToDate = !toDate || !rowDate || rowDate <= toDate;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRouteId &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const pageData = filtered.map((row, index) => ({
    ...row,
    srNo: String((page - 1) * pageSize + index + 1).padStart(2, "0"),
  }));

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchRouteIds = async () => {
      try {
        const response: unknown = await logisticsService.getRouteIds();

        let parsed: unknown = response;

        if (typeof response === "string") {
          try {
            parsed = JSON.parse(response);
          } catch {
            parsed = response
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean);
          }
        }

        let routeList: unknown[] = [];

        if (Array.isArray(parsed)) {
          routeList = parsed;
        } else if (parsed && typeof parsed === "object") {
          const record = parsed as Record<string, unknown>;

          const candidate = record.data ?? record.routeIds ?? record.routes;

          if (Array.isArray(candidate)) {
            routeList = candidate;
          }
        }

        const options = routeList
          .map((item): MultiSelectDropdownOption | null => {
            if (typeof item === "string" || typeof item === "number") {
              const value = String(item).trim();

              return value ? { label: value, value } : null;
            }

            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;

            const rawValue =
              record.routeCode ??
              record.routeId ??
              record.routeID ??
              record.value ??
              record.id;

            if (rawValue == null || String(rawValue).trim() === "") {
              return null;
            }

            const value = String(rawValue);

            return {
              label: String(record.label ?? value),
              value,
            };
          })
          .filter(
            (option): option is MultiSelectDropdownOption => option !== null,
          );

        if (!cancelled) {
          setRouteIdOptions(options);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch Route IDs:", error);
        setRouteIdOptions([]);
      }
    };

    void fetchRouteIds();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!subOrgLocId || !userRole) {
      return;
    }

    let isCurrentRequest = true;

    const fetchLoadTenders = async () => {
      const start = (page - 1) * pageSize;

      const fromDateValue = appliedFilters.fromDate
        ? [appliedFilters.fromDate.format("DD-MM-YYYY") + " 12:00:00"]
        : [];

      const toDateValue = appliedFilters.toDate
        ? [appliedFilters.toDate.format("DD-MM-YYYY") + " 12:00:00"]
        : [];

      const payload: LoadTenderListRequest = {
        dataTablesParameters: {
          draw: page,
          columns: loadTenderColumns,
          order: [
            {
              column: 19,
              dir: "desc",
            },
          ],
          start,
          length: pageSize,
          search: {
            value: search.trim(),
            regex: false,
          },
        },
        id: "",
        subOrgLocId,
        RoleType: userRole,
        filters: [
          { name: "fromDate", value: fromDateValue },
          { name: "toDate", value: toDateValue },
          { name: "recieverFilter", value: [] },
          { name: "tradingPartnerFilter", value: appliedFilters.customer },
          { name: "statusFilter", value: appliedFilters.status },
          { name: "regionFilter" },
          { name: "organisationFilter", value: [] },
          { name: "routeFilter", value: appliedFilters.routeId },
          { name: "documentFilter", value: [] },
        ],
      };

      try {
        setIsLoading(true);
        const response = await logisticsService.getLoadTenders(payload);

        if (!isCurrentRequest) return;

        const rows: PORow[] = response.data.map((item) => {
          const receivedDate = dayjs(item.dateReceived);

          return {
            srNo: "",
            loadTenderid: item.loadTenderid,
            customer: item.customer ?? "",
            shipmentNo: item.shipmentIdentificationNumber ?? "",
            tenderReceiveDate: receivedDate.isValid()
              ? receivedDate.toDate()
              : new Date(0),
            status: item.status ?? "",
            routeId: item.routeCode ?? "",
            probillsAvailable: Boolean(item.routeCode),
            shipmentAvailable: Boolean(
              item.status === "Accepted" ||
              item.status === "InTransit" ||
              item.status === "Delivered",
            ),
          };
        });

        setLoadTenderRows(rows);
        setTotalRecords(
          response.recordsFiltered ?? response.recordsTotal ?? rows.length,
        );
      } catch (error) {
        if (!isCurrentRequest) return;

        console.error("Failed to fetch Load Tenders:", error);
        setLoadTenderRows([]);
        setTotalRecords(0);
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    void fetchLoadTenders();

    return () => {
      isCurrentRequest = false;
    };
  }, [
    appliedFilters.fromDate,
    appliedFilters.toDate,
    appliedFilters.customer,
    appliedFilters.status,
    appliedFilters.routeId,
    subOrgLocId,
    userRole,
    page,
    pageSize,
    search,
  ]);
  console.log(loadTenderRows);

  return (
    <div className={styles.container}>
      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <Input
              inputContainerClass={styles.searchInput}
              type="text"
              value={search}
              placeholder="Search Shipment Number"
              disableMessage
              endIcon={
                <AppImage
                  width="18px"
                  height="18px"
                  iconPath={icons.SearchIcon}
                />
              }
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className={styles.selectGroup}>
              <button
                type="button"
                className={`${styles.filterButton} ${advanceFilterOpen ? styles.filterButtonActive : ""}`}
                onClick={() => setAdvanceFilterOpen(!advanceFilterOpen)}
              >
                <AppImage iconPath={icons.FIlterIcon} width="20" height="20" />
                <span>Advance filter</span>
                {usedFiltersCount > 0 && (
                  <span className={styles.filterBadge}>{usedFiltersCount}</span>
                )}
              </button>
            </div>
          </div>
          {advanceFilterOpen && (
            <div
              className={styles.filterModalOverlay}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setAdvanceFilterOpen(false);
                }
              }}
            >
              <div className={styles.filterCard} ref={filterRef}>
                {/* Close button */}
                <button
                  type="button"
                  className={styles.filterCloseButton}
                  onClick={handleClose}
                  aria-label="Close advanced filters"
                >
                  <AppImage iconPath={icons.X} width="20" height="20" />
                </button>

                <h3 className={styles.modalTitle}>Advance Filters</h3>

                <div className={styles.advancedfilter}>
                  {/* Filter fields */}
                  <div className={styles.filterInputs}>
                    <div className={styles.filterField}>
                      <DateInput
                        placeholder="Enter Date"
                        height="44px"
                        className={styles.filterInput}
                        label="From Date"
                        value={fromDate}
                        maxDate={toDate || undefined}
                        onChange={setFromDate}
                      />
                    </div>

                    <div className={styles.filterField}>
                      <DateInput
                        className={styles.filterInput}
                        placeholder="Enter Date"
                        label="To Date"
                        height="44px"
                        minDate={fromDate || undefined}
                        value={toDate}
                        onChange={setToDate}
                      />
                    </div>

                    <div className={styles.filterField}>
                      <label className={styles.fieldLabel}>Status</label>

                      <MultiSelectDropdown
                        placeholder="Select Status"
                        value={status}
                        options={statusOptions}
                        onChange={setStatus}
                        variant="light"
                        height="44px"
                        className={styles.filterInput}
                      />
                    </div>

                    <div className={styles.filterField}>
                      <label className={styles.fieldLabel}>Partner</label>

                      <MultiSelectDropdown
                        placeholder="Select Partner"
                        height="44px"
                        options={partnerOptions}
                        value={customer}
                        onChange={setCustomer}
                        variant="light"
                        className={styles.filterInput}
                      />
                    </div>
                    <div className={styles.filterField}>
                      <label className={styles.fieldLabel}>Route ID</label>

                      <MultiSelectDropdown
                        placeholder="Select Route ID"
                        height="44px"
                        options={routeIdOptions}
                        value={routeId}
                        onChange={setRouteId}
                        variant="light"
                        className={styles.filterInput}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.filterActions}>
                    <Button
                      className={styles.filterActionButton}
                      title="Apply"
                      color="primary"
                      onClick={handleApplyFilters}
                    />

                    <Button
                      className={styles.filterActionButton}
                      title="Clear"
                      color="outline"
                      onClick={handleClearFilters}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Table<PORow>
          columns={poColumns}
          data={pageData}
          showPagination
          loading={isLoading}
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          sortColumn={"tenderReceiveDate"}
          sortDirection={"desc"}
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

export default LoadTenders;
