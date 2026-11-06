import { useEffect, useState } from "react";
import { icons } from "../../../assets/icons";
import { AppImage, Table, Button } from "../../../components";
import styles from "./configuration.module.css";
import type { Column } from "../../../components/table/table";
import { useSort } from "../../../shared/hooks/useSort";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { logisticsService } from "../../../services";
import { useAppSelector } from "../../../store/hooks";
import { selectSolocId } from "../../../store/user/userSelectors";
import type { PartnerDetail } from "../../../shared/types";

interface PORow {
  id: string;
  soLocID: string;
  organisationName: string;
  subOrgName: string;
  receiverID: string;
  region: string;
}

const Configuration = () => {
  const navigate = useNavigate();
  const subOrgLocId = useAppSelector(selectSolocId);

  const [partnerRows, setPartnerRows] = useState<PORow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPartners = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await logisticsService.getPartnerDetails(subOrgLocId);

        if (cancelled) return;

        const partners: PartnerDetail[] = Array.isArray(response)
          ? response
          : [];

        const rows: PORow[] = partners.map((partner) => ({
          id: String(partner.soLocID),
          soLocID: String(partner.soLocID),
          organisationName: partner.orgName ?? "--",
          subOrgName: partner.soName ?? "--",
          receiverID: partner.gsNumber ?? partner.soCode ?? "--",
          region: partner.region ?? "--",
        }));

        setPartnerRows(rows);
        setPage(1);
      } catch (err: unknown) {
        if (cancelled) return;

        setPartnerRows([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load trading partner configuration.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchPartners();

    return () => {
      cancelled = true;
    };
  }, [subOrgLocId]);

  const poColumns: Column<PORow>[] = [
    {
      key: "soLocID",
      title: "SoLocID",
      width: 70,
      sortable: false,
      type: "string",
    },
    {
      key: "organisationName",
      title: "Organisation Name",
      sortable: false,
      type: "string",
      width: 240,
    },
    {
      key: "subOrgName",
      title: "Sub Org Name",
      sortable: true,
      type: "string",
      width: 240,
    },
    {
      key: "receiverID",
      title: "Receiver ID",
      sortable: true,
      type: "string",
      width: 140,
    },
    {
      key: "region",
      title: "Region",
      sortable: true,
      type: "string",
      width: 180,
    },
    {
      key: "action",
      title: "Action",
      width: 220,
      align: "center",
      type: "action",
      actions: [
        {
          id: "view",
          label: "Add Status",
          icon: (
            <Tooltip
              title="Add Status"
              placement="top"
              arrow
              classes={{
                tooltip: styles.tooltip,
                arrow: styles.tooltipArrow,
              }}
            >
              <span className={styles.tooltipTrigger}>
                <Button
                  title="Add Status"
                  color="outline"
                  icon={
                    <AppImage
                      iconPath={icons.PurplePlusIcon}
                      width="16px"
                      height="16px"
                    />
                  }
                />
              </span>
            </Tooltip>
          ),
          onClick: (row) =>
            navigate("/logistics/configuration/add-status", {
              state: {
                partnerName: row.subOrgName,
                subOrgLocId: Number(row.soLocID),
              },
            }),
        },
      ],
    },
  ];

  const { sortedData, sortColumn, sortDirection, handleSort } = useSort(
    partnerRows,
    "soLocID",
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  const pageData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <h1 className={styles.pageTitle}>Trading Partner Configuration</h1>
        </div>

        {error && <p role="alert">{error}</p>}

        <Table<PORow>
          columns={poColumns}
          data={pageData}
          showPagination
          page={page}
          loading={loading}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={sortedData.length}
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

export default Configuration;
