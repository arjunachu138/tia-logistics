import { useEffect, useMemo, useState } from "react";
import { icons } from "../../../assets/icons";
import {
  AppImage,
  MultiSelectDropdown,
  DateInput,
  Table,
  Button,
  Input,
} from "../../../components";

import type { MultiSelectDropdownOption } from "../../../components/multi-select-dropdown/multiSelectDropdown";
import styles from "./logistics-invoices.module.css";
import type { Dayjs } from "dayjs";
import type { Column } from "../../../components/table/table";
import { useSort } from "../../../shared/hooks/useSort";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";
import { logisticsService, usePartnerDetails } from "../../../services";
import { useAppSelector } from "../../../store/hooks";
import {
  selectSolocId,
  selectUserRole,
} from "../../../store/user/userSelectors";
import type { InvoiceFilterValues } from "../../../shared/types/logistics";

interface PORow {
  poNo: string;
  invoiceNo: string;
  deliveryDate: string;
  totalCharge: string;
  invoiceId: string;
  view: boolean;
}

const LogisticsInvoices = () => {
  const navigate = useNavigate();
  const subOrgLocId = useAppSelector(selectSolocId);
  const roleType = useAppSelector(selectUserRole);
  const today = dayjs().startOf("day");

  const { data: partnerDetails } = usePartnerDetails(subOrgLocId);

  const partnerOptions = useMemo<MultiSelectDropdownOption[]>(
    () =>
      partnerDetails?.map((item) => ({
        label: item.soName ?? "",
        value: String(item.soLocID),
      })) ?? [],
    [partnerDetails],
  );

  const poColumns: Column<PORow>[] = [
    {
      key: "poNo",
      title: "PO No.",
      width: 70,
      sortable: false,
      type: "string",
    },
    {
      key: "invoiceNo",
      title: "Invoice No.",
      sortable: false,
      type: "string",
      width: 240,
    },
    {
      key: "deliveryDate",
      title: "Delivery Date",
      sortable: true,
      type: "string",
      width: 240,
    },
    {
      key: "totalCharge",
      title: "Total Charge",
      sortable: true,
      type: "string",
      width: 140,
    },
    {
      key: "view",
      title: "View",
      width: 72,
      align: "center",
      type: "action",
      actions: [
        {
          id: "view",
          label: "View",
          icon: (
            <Tooltip
              title="View"
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
          onClick: (row) => navigate(`/logistics/invoices/${row.invoiceId}`),
        },
      ],
    },
  ];

  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [partnerOrganization, setPartnerOrganization] = useState<string[]>([]);
  const [invoiceRows, setInvoiceRows] = useState<PORow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<InvoiceFilterValues>({
    fromDate: null,
    toDate: null,
    partnerOrganization: [],
  });

  const { sortedData, sortColumn, sortDirection, handleSort } = useSort(
    invoiceRows,
    "deliveryDate",
  );

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pageData = sortedData;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      fromDate,
      toDate,
      partnerOrganization: [...partnerOrganization],
    });

    setPage(1);
  };

  const handleClearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setPartnerOrganization([]);

    setAppliedFilters({
      fromDate: null,
      toDate: null,
      partnerOrganization: [],
    });

    setPage(1);
  };

  useEffect(() => {
    if (!roleType) return;

    let isCurrent = true;

    const fetchInvoices = async () => {
      try {
        const response = await logisticsService.getLogisticsInvoicesList(
          {
            fromDate: appliedFilters.fromDate
              ? appliedFilters.fromDate.format("DD-MM-YYYY HH:mm:ss")
              : null,
            toDate: appliedFilters.toDate
              ? appliedFilters.toDate.format("DD-MM-YYYY HH:mm:ss")
              : null,
            partnerOrganization: appliedFilters.partnerOrganization,
          },
          subOrgLocId,
          roleType,
          (page - 1) * pageSize,
          pageSize,
          search,
        );

        if (!isCurrent) return;

        const mappedRows: PORow[] = response.data.map((invoice) => ({
          poNo: invoice.shipmentIdentifcationNo,
          invoiceNo: invoice.invoiceNumber,
          deliveryDate: dayjs(invoice.deliveryDate).isValid()
            ? dayjs(invoice.deliveryDate).format("DD MMM YYYY | hh:mmA")
            : "-",
          totalCharge: String(invoice.totalCharge),
          view: true,
          invoiceId: invoice.invoiceId,
        }));

        setInvoiceRows(mappedRows);
        setTotalRecords(response.recordsTotal);
      } catch (error) {
        if (isCurrent) {
          console.error("Failed to fetch logistics invoices:", error);
          setInvoiceRows([]);
          setTotalRecords(0);
        }
      }
    };

    void fetchInvoices();

    return () => {
      isCurrent = false;
    };
  }, [appliedFilters, subOrgLocId, roleType, page, pageSize, search]);

  return (
    <div className={styles.container}>
      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.filtersGroup}>
            <div className={styles.filterField}>
              <DateInput
                label="From Date"
                placeholder="Select From Date"
                height="44px"
                value={fromDate}
                maxDate={today}
                onChange={(val) => {
                  if (val && val.isAfter(today, "day")) return;

                  setFromDate(val);

                  if (val && toDate && toDate.isBefore(val, "day")) {
                    setToDate(null);
                  }
                }}
              />
            </div>

            <div className={styles.filterField}>
              <DateInput
                label="To Date"
                placeholder="Select To Date"
                height="44px"
                value={toDate}
                minDate={fromDate ?? undefined}
                maxDate={today}
                onChange={(val) => {
                  if (val && val.isAfter(today, "day")) return;

                  if (val && fromDate && val.isBefore(fromDate, "day")) {
                    return;
                  }

                  setToDate(val);
                }}
              />
            </div>

            <div className={styles.filterField}>
              <MultiSelectDropdown
                label="Partner Organization"
                placeholder="Partner Organization"
                height="44px"
                options={partnerOptions}
                value={partnerOrganization}
                onChange={(val) => {
                  setPartnerOrganization(val);
                }}
                variant="light"
              />
            </div>
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
          <div className={styles.searchRow}>
            <Input
              inputContainerClass={styles.searchInput}
              type="text"
              value={search}
              placeholder="Search Invoice Number"
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
          </div>
        </div>

        <Table<PORow>
          columns={poColumns}
          data={pageData}
          showPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default LogisticsInvoices;
