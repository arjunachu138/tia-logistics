import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import {
  selectSolocId,
  selectUserRole,
} from "../../../store/user/userSelectors";
import { logisticsService } from "../../../services";
import type {
  ShipmentStatusRecord,
  ShipmentStatusHistoryRecord,
} from "../../../shared/types/logistics";
import StatusHistoryModal from "../components/statusHistoryModal";
import type { StatusHistoryItem } from "../components/statusHistoryModal";
import styles from "./shipmentStatus.module.css";
import dayjs from "dayjs";
import { AppImage, Button } from "../../../components";
import { icons } from "../../../assets/icons";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVal = (
  obj: Record<string, unknown> | null | undefined,
  ...keys: string[]
): string => {
  if (!obj || typeof obj !== "object") return "--";
  for (const k of keys) {
    if (
      obj[k] !== undefined &&
      obj[k] !== null &&
      String(obj[k]).trim() !== ""
    ) {
      return String(obj[k]);
    }
  }
  const objKeys = Object.keys(obj);
  for (const k of keys) {
    const matchedKey = objKeys.find(
      (key) => key.toLowerCase() === k.toLowerCase(),
    );
    if (
      matchedKey &&
      obj[matchedKey] !== undefined &&
      obj[matchedKey] !== null &&
      String(obj[matchedKey]).trim() !== ""
    ) {
      return String(obj[matchedKey]);
    }
  }
  return "--";
};

const formatStatusDate = (raw: string | null | undefined): string => {
  if (!raw || raw === "--") return "--";
  const d = dayjs(raw);
  return d.isValid() ? d.format("DD-MM-YYYY") : raw;
};

const formatStatusTime = (raw: string | null | undefined): string => {
  if (!raw || raw === "--") return "--";
  if (/^\d{2}:\d{2}/.test(raw)) return raw;
  const d = dayjs(raw);
  return d.isValid() ? d.format("HH:mm:ss") : raw;
};

// Map raw API history records → modal items
const mapHistoryRecordsToItems = (
  records: ShipmentStatusHistoryRecord[],
): StatusHistoryItem[] =>
  records.map((rec) => {
    const r = rec as unknown as Record<string, unknown>;
    const shipDetails = (r?.shipmentDetail ||
      r?.ShipmentDetail ||
      {}) as Record<string, unknown>;
    const rawDate = getVal(
      shipDetails,
      "shipmentStatusDate",
      "ShipmentStatusDate",
    );
    const rawTime = getVal(
      shipDetails,
      "shipmentStatusTime",
      "ShipmentStatusTime",
    );
    const rawEta = getVal(
      shipDetails,
      "shipmentStatusDate",
      "ShipmentStatusDate",
    );
    const rawEtaTime = getVal(
      shipDetails,
      "shipmentStatusTime",
      "ShipmentStatusTime",
    );

    const parent = (shipDetails?.parent || shipDetails?.Parent || {}) as Record<
      string,
      unknown
    >;
    const parent2 = (parent?.parent || parent?.Parent || {}) as Record<
      string,
      unknown
    >;
    const weightData = (parent?.shipmentWeightDataAssignedNo ||
      parent?.ShipmentWeightDataAssignedNo ||
      {}) as Record<string, unknown>;
    const currentWeightData = (weightData?.current ||
      weightData?.Current ||
      weightData) as Record<string, unknown>;
    const notesVal =
      parent?.shipmentRemarkAssignedNo || parent?.ShipmentRemarkAssignedNo;

    const propertyLocs =
      shipDetails?.shipmentRealPropertyLoc ||
      shipDetails?.ShipmentRealPropertyLoc;
    const propertyLoc = Array.isArray(propertyLocs)
      ? propertyLocs[0]
      : (propertyLocs as { List?: unknown[] })?.List?.[0] || undefined;
    const shipmentContainerOwners =
      shipDetails?.shipmentContainerOwners ||
      shipDetails?.ShipmentContainerOwners;
    const shipContOwnr = Array.isArray(shipmentContainerOwners)
      ? shipmentContainerOwners[0]
      : (shipmentContainerOwners as { List?: unknown[] })?.List?.[0] ||
        undefined;
    return {
      statusCode: getVal(
        shipDetails,
        "shipmentStatusCode",
        "ShipmentStatusCode",
      ),
      statusDesc: getVal(r, "statusDescription", "StatusDescription"),
      statusDate: rawDate !== "--" ? formatStatusDate(rawDate) : "--",
      statusTime: rawTime !== "--" ? formatStatusTime(rawTime) : "--",
      reasonCode: getVal(
        shipDetails,
        "shipmentReasonCode",
        "ShipmentReasonCode",
      ),
      reasonDesc: getVal(r, "reasonDescription", "ReasonDescription"),
      notes:
        !Array.isArray(notesVal) || notesVal.length === 0
          ? "Null"
          : `${getVal(notesVal[0] as Record<string, unknown>, "remark1")}  ${getVal(notesVal[0] as Record<string, unknown>, "remark2")}`,
      detail: {
        shipmentNumber: getVal(
          parent2,
          "shipmentIdentificationNumber",
          "ShipmentIdentificationNumber",
        ),
        scac: getVal(parent2, "scac", "Scac"),
        statusCode: getVal(
          shipDetails,
          "shipmentStatusCode",
          "ShipmentStatusCode",
        ),
        statusDate: rawDate !== "--" ? formatStatusDate(rawDate) : "--",
        statusTime: rawTime !== "--" ? formatStatusTime(rawTime) : "--",
        poNo: getVal(
          parent2,
          "shipmentIdentificationNumber",
          "ShipmentIdentificationNumber",
        ),
        probillNo: getVal(parent2, "extra2", "Extra2"),
        orderNumber: getVal(parent2, "extra4", "Extra4"),
        account: getVal(parent2, "extra1", "Extra1"),
        tradingPartnerName: getVal(
          parent2,
          "primaryReceiverId",
          "PrimaryReceiverId",
        ),
        // tradingPartnerName: getVal(
        //   parent?.shipmentRemarkAssignedNo as
        //     | Record<string, unknown>
        //     | undefined,
        //   "remark1",
        // ),
        bolNumber: getVal(
          parent2,
          "shipmentStatusRefId",
          "ShipmentStatusRefId",
        ),
        equipment: getVal(shipContOwnr, "equipmentNumber", "EquipmentNumber"),
        longitudeCode: getVal(
          propertyLoc,
          "propertyLongitudeCode",
          "PropertyLongitudeCode",
        ),
        latitudeCode: getVal(
          propertyLoc,
          "propertyLatitudeCode",
          "PropertyLatitudeCode",
        ),
        directionIdentifierCode: getVal(
          propertyLoc,
          "propertyDirectionId1",
          "PropertyDirectionId1",
        ),
        appointmentCode: getVal(
          r,
          "appoinmentDescription",
          "AppoinmentDescription",
        ),
        reasonCode: getVal(
          shipDetails,
          "shipmentReasonCode",
          "ShipmentReasonCode",
        ),
        reasonDescription: getVal(r, "reasonDescription", "ReasonDescription"),
        eta: rawEta !== "--" ? formatStatusDate(rawEta) : "--",
        etaTime: rawEtaTime !== "--" ? formatStatusTime(rawEtaTime) : "--",
        quantity: getVal(weightData, "shipmentLadingQty", "ShipmentLadingQty"),
        quantityUnit: getVal(
          weightData,
          "shipmentLadingQtyUnitCode",
          "ShipmentLadingQtyUnitCode",
        ),
        weight: getVal(currentWeightData, "shipmentWeight", "ShipmentWeight"),
        weightUnit: getVal(
          currentWeightData,
          "shipmentWeightUnitCode",
          "ShipmentWeightUnitCode",
        ),
      },
    };
  });

// ─── Component ────────────────────────────────────────────────────────────────

const ShipmentStatus: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const subOrgLocId = useAppSelector(selectSolocId);
  const roleType = useAppSelector(selectUserRole);

  // List data
  const [statusItems, setStatusItems] = useState<ShipmentStatusRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History modal
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState<StatusHistoryItem[]>([]);
  const [historyShipmentNo, setHistoryShipmentNo] = useState<string>("");

  // ─── Fetch shipment status list ─────────────────────────────────────────

  const fetchStatusList = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await logisticsService.getShipmentStatus(
        id,
        subOrgLocId,
        roleType || "Admin",
      );

      let rawList: ShipmentStatusRecord[] = [];

      const raw = response as unknown as Record<string, unknown>;
      const dataObj = (raw?.data ??
        raw?.Data ??
        (raw?.Response as Record<string, unknown>)?.Data ??
        response) as Record<string, unknown>;

      if (Array.isArray(dataObj)) {
        rawList = dataObj as ShipmentStatusRecord[];
      } else if (Array.isArray(dataObj?.List)) {
        rawList = dataObj.List as ShipmentStatusRecord[];
      } else if (Array.isArray(raw?.data)) {
        rawList = raw.data as ShipmentStatusRecord[];
      } else if (Array.isArray(raw?.Data)) {
        rawList = raw.Data as ShipmentStatusRecord[];
      }
      setStatusItems(rawList);
    } catch (err) {
      console.error("Error fetching shipment status:", err);
      setError("Failed to load shipment status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, subOrgLocId, roleType]);

  useEffect(() => {
    fetchStatusList();
  }, [fetchStatusList]);

  // ─── Fetch status history ────────────────────────────────────────────────

  const handleViewHistory = async (shipmentNo: string) => {
    setHistoryShipmentNo(shipmentNo);
    setIsHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryItems([]);
    try {
      const response = await logisticsService.getShipmentStatusHistory(
        shipmentNo || id || "",
        subOrgLocId,
        roleType || "Admin",
      );

      let rawList: ShipmentStatusHistoryRecord[] = [];
      const raw = response as unknown;
      if (Array.isArray(raw)) {
        rawList = raw as ShipmentStatusHistoryRecord[];
      } else if (raw && typeof raw === "object") {
        const rec = raw as Record<string, unknown>;
        const listCandidate =
          (rec?.data as Record<string, unknown>)?.List ||
          (rec?.Data as Record<string, unknown>)?.List ||
          (rec?.Response as Record<string, unknown>)?.Data;
        if (Array.isArray(listCandidate)) {
          rawList = listCandidate as ShipmentStatusHistoryRecord[];
        } else if (
          Array.isArray((listCandidate as { List?: unknown[] })?.List)
        ) {
          rawList = (listCandidate as { List: ShipmentStatusHistoryRecord[] })
            .List;
        } else if (Array.isArray(rec.data)) {
          rawList = rec.data as ShipmentStatusHistoryRecord[];
        } else if (Array.isArray(rec.Data)) {
          rawList = rec.Data as ShipmentStatusHistoryRecord[];
        } else if (Array.isArray(rec.result)) {
          rawList = rec.result as ShipmentStatusHistoryRecord[];
        } else if (Array.isArray(rec.Result)) {
          rawList = rec.Result as ShipmentStatusHistoryRecord[];
        }
      }

      setHistoryItems(mapHistoryRecordsToItems(rawList));
    } catch (err) {
      console.error("Error fetching status history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUpdateStatus = (shipmentNo?: string, rawItem?: unknown) => {
    navigate(
      `/logistics/load-tenders/shipment-status/${shipmentNo || id}/update`,
      { state: { shipmentData: rawItem } },
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading shipment status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  // If no API records yet, show default item
  const displayItems =
    statusItems.length > 0
      ? statusItems
      : [
          {
            probillNo: null,
            shipmentNo: id ?? null,
            currentStatus: null,
            currentStatusDesc: null,
            currentStatusDate: null,
            currentStatusTime: null,
            scac: null,
            tradingPartnerName: null,
            poNo: null,
            orderNumber: null,
            account: null,
            bolNumber: null,
            equipment: null,
          },
        ];

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
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
            cursor: "pointer",
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
            cursor: "pointer",
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
          {id ? `Shipment Status - ${id}` : "Shipment Status"}
        </Typography>
      </Breadcrumbs>

      {displayItems.map((rawItem, index) => {
        const item = rawItem as unknown as Record<string, unknown>;
        const header = (item.header || item.Header || item) as Record<
          string,
          unknown
        >;
        const assignedObj =
          header.shipmentAssignedNumber || header.ShipmentAssignedNumber;
        const assignedList = Array.isArray(assignedObj)
          ? assignedObj
          : (assignedObj as { List?: Array<Record<string, unknown>> })?.List ||
            [];
        const firstAssigned = (assignedList[0] || {}) as Record<
          string,
          unknown
        >;
        const detailsObj =
          firstAssigned.shipmentStatusDetail ||
          firstAssigned.ShipmentStatusDetail;
        const detailsList = Array.isArray(detailsObj)
          ? detailsObj
          : (detailsObj as { List?: Array<Record<string, unknown>> })?.List ||
            [];
        const shipmentStatusDetail = detailsList[0] as
          | Record<string, unknown>
          | undefined;

        const shipmentNo = getVal(
          header,
          "shipmentIdentificationNumber",
          "ShipmentIdentificationNumber",
        );
        const probillNo = getVal(header, "extra2", "Extra2");
        const currentStatusDesc = getVal(
          item,
          "statusDescription",
          "StatusDescription",
        );
        const currentStatus = getVal(
          shipmentStatusDetail,
          "shipmentStatusCode",
          "ShipmentStatusCode",
        );
        const currentStatusDate = getVal(
          shipmentStatusDetail,
          "shipmentStatusDate",
          "ShipmentStatusDate",
        );
        const currentStatusTime = getVal(
          shipmentStatusDetail,
          "shipmentStatusTime",
          "ShipmentStatusTime",
        );
        const hasHistory =
          currentStatus !== "--" && currentStatus !== "PENDING";
        const completed = currentStatus === "D1";

        return (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                Status Details {completed && "| Completed Shipping"}
              </h3>
              <div className={styles.buttonGroup}>
                {hasHistory && (
                  <Button
                    title="View Status History"
                    icon={
                      <AppImage
                        iconPath={icons.viewStatHisPrim}
                        height="18px"
                        width="18px"
                      />
                    }
                    color="primary"
                    className={styles.actionButton}
                    onClick={() =>
                      handleViewHistory(
                        probillNo !== "--" ? probillNo : shipmentNo || id || "",
                      )
                    }
                  />
                )}
                {!completed && (
                  <Button
                    title="Update Status"
                    icon={
                      <AppImage
                        iconPath={icons.updateStatPrim}
                        height="18px"
                        width="18px"
                      />
                    }
                    color="primary"
                    className={styles.actionButton}
                    onClick={() =>
                      handleUpdateStatus(
                        shipmentNo !== "--" ? shipmentNo : id,
                        rawItem,
                      )
                    }
                  />
                )}
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Probill No.</span>
                <span className={styles.fieldValue}>{probillNo}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Shipment No.</span>
                <span className={styles.fieldValue}>
                  {shipmentNo !== "--" ? shipmentNo : id || "--"}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Current Status Desc</span>
                <span className={styles.fieldValue}>{currentStatusDesc}</span>
              </div>
            </div>

            {currentStatus !== "PENDING" && (
              <>
                <hr className={styles.divider} />
                <div className={styles.grid3}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Current Status</span>
                    <span className={styles.fieldValue}>{currentStatus}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      Current Status Date
                    </span>
                    <span className={styles.fieldValue}>
                      {formatStatusDate(currentStatusDate)}
                    </span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                      Current Status Time
                    </span>
                    <span className={styles.fieldValue}>
                      {formatStatusTime(currentStatusTime)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Status History Modal */}
      <StatusHistoryModal
        open={isHistoryOpen}
        historyList={historyLoading ? [] : historyItems}
        loading={historyLoading}
        shipmentNo={historyShipmentNo}
        onClose={() => {
          setIsHistoryOpen(false);
          setHistoryItems([]);
        }}
      />
    </div>
  );
};

export default ShipmentStatus;
