import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./addStatus.module.css";
import { icons } from "../../../assets/icons";
import { AppImage, Button } from "../../../components";
import { logisticsService } from "../../../services";
import { useSelector } from "react-redux";
import { selectSolocId } from "../../../store/user/userSelectors";
import { useToast } from "../../../components/toast/ToastProvider";
import type { ApiErrorResponse } from "../../../shared/types";

interface StatusOption {
  optionKey: string;
  wheelkingStatus: string;
  ediStatusCode: string;
  codeType: string;
  description: string;
  solocid: string | null;
}

interface CustomerStatus {
  id: number;
  tpStatuesId: number;
  createdDate: string;
  updatedDate: string;
  tpSolocID: string;
  sellerSolocID: string;
  shipmentStatusID: number;
  statusName: string;
  sequenceNumber: string;
  active: boolean;
  ediStatusCode: string;
}

interface AddStatusLocationState {
  partnerName?: string;
  subOrgLocId?: number | string;
}

const AddStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const routeState = location.state as AddStatusLocationState | null;
  const partnerName = routeState?.partnerName || "Trading Partner";
  const subOrgLocId = Number(routeState?.subOrgLocId);
  const sellerSolocId = useSelector(selectSolocId);

  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [statusLoadError, setStatusLoadError] = useState("");
  const [savedStatusesLoading, setSavedStatusesLoading] = useState(false);
  const [savedStatusesError, setSavedStatusesError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sequenceNumber, setSequenceNumber] = useState("");
  const [customerStatuses, setCustomerStatuses] = useState<CustomerStatus[]>(
    [],
  );
  const [nextId, setNextId] = useState(1);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(subOrgLocId) || subOrgLocId <= 0) {
      setStatusOptions([]);
      setStatusLoadError(
        "Trading partner location ID is missing. Open this page from Trading Partner Configuration.",
      );
      return;
    }

    let cancelled = false;

    const fetchStatusOptions = async () => {
      setLoadingOptions(true);
      setStatusLoadError("");

      try {
        const response = await logisticsService.getEDICodeToStatusMapping(
          "SC",
          subOrgLocId,
        );

        if (cancelled) return;

        const defaultStatuses = Array.isArray(response?.default)
          ? response.default
          : [];

        const partnerSpecificStatuses = Array.isArray(response?.tpSpecific)
          ? response.tpSpecific
          : [];

        const options: StatusOption[] = [
          ...defaultStatuses.map((status, index) => ({
            ...status,
            optionKey: `default-${index}`,
          })),
          ...partnerSpecificStatuses.map((status, index) => ({
            ...status,
            optionKey: `partner-${index}`,
          })),
        ];

        setStatusOptions(options);

        if (options.length === 0) {
          setStatusLoadError("No shipment statuses are available.");
        }
      } catch (error) {
        console.error("Failed to fetch shipment status mappings:", error);

        if (!cancelled) {
          setStatusOptions([]);
          setStatusLoadError(
            "Failed to load shipment statuses. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      }
    };

    void fetchStatusOptions();

    return () => {
      cancelled = true;
    };
  }, [subOrgLocId]);

  useEffect(() => {
    if (!Number.isFinite(subOrgLocId) || subOrgLocId <= 0) {
      setCustomerStatuses([]);
      setSavedStatusesError(
        "Trading partner location ID is missing. Open this page from Trading Partner Configuration.",
      );
      return;
    }

    let cancelled = false;

    const fetchSavedStatuses = async () => {
      setSavedStatusesLoading(true);
      setSavedStatusesError("");

      try {
        const response =
          await logisticsService.getShipmentStatusesForTradingPartner(
            subOrgLocId,
          );

        if (cancelled) return;

        const savedStatuses = Array.isArray(response) ? response : [];

        const mappedStatuses: CustomerStatus[] = savedStatuses.map(
          (status) => ({
            id: status.tpStatuesId,
            tpStatuesId: status.tpStatuesId,
            createdDate: status.createdDate,
            updatedDate: status.updatedDate,
            tpSolocID: status.tpSolocID,
            sellerSolocID: status.sellerSolocID,
            shipmentStatusID: status.shipmentStatusID,
            statusName: status.shipmentStatusName,
            sequenceNumber:
              status.sequenceNo == null ? "" : String(status.sequenceNo),
            active: status.isActive,
            ediStatusCode: status.ediStatusCode,
          }),
        );

        setCustomerStatuses(mappedStatuses);

        setNextId(
          mappedStatuses.reduce(
            (maxId, status) => Math.max(maxId, status.id),
            0,
          ) + 1,
        );

        setCustomerStatuses(mappedStatuses);

        const nextAvailableId =
          mappedStatuses.reduce(
            (maxId, status) => Math.max(maxId, status.id),
            0,
          ) + 1;

        setNextId(nextAvailableId);
      } catch (error) {
        console.error("Failed to fetch saved trading partner statuses:", error);

        if (!cancelled) {
          setCustomerStatuses([]);
          setSavedStatusesError(
            "Failed to load saved statuses. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setSavedStatusesLoading(false);
        }
      }
    };

    void fetchSavedStatuses();

    return () => {
      cancelled = true;
    };
  }, [subOrgLocId]);

  const isStatusAlreadyAdded = (option: StatusOption) =>
    customerStatuses.some(
      (status) =>
        status.statusName.trim().toLowerCase() ===
          option.wheelkingStatus.trim().toLowerCase() ||
        status.ediStatusCode.trim().toLowerCase() ===
          option.ediStatusCode.trim().toLowerCase(),
    );

  const handleAddStatus = () => {
    const selectedOption = statusOptions.find(
      (option) => option.optionKey === selectedStatus,
    );

    if (!selectedOption) {
      setMessage("Please select a shipment status.");
      return;
    }

    if (isStatusAlreadyAdded(selectedOption)) {
      const errorMessage = `${selectedOption.wheelkingStatus} has already been added.`;

      setMessage(errorMessage);
      showToast(errorMessage, "error");
      setSelectedStatus("");
      return;
    }

    if (sequenceNumber.trim() && !/^\d+$/.test(sequenceNumber.trim())) {
      setMessage("Please enter a valid sequence number or leave it empty.");
      return;
    }

    const now = new Date().toISOString();

    const existingSellerSolocId = customerStatuses.find(
      (status) => status.sellerSolocID,
    )?.sellerSolocID;

    const currentSellerSolocId =
      Number(sellerSolocId) > 0 ? String(sellerSolocId) : "";

    setCustomerStatuses((current) => [
      ...current,
      {
        id: nextId,
        tpStatuesId: 0,
        createdDate: now,
        updatedDate: now,
        tpSolocID: String(subOrgLocId),
        sellerSolocID: existingSellerSolocId || currentSellerSolocId,
        shipmentStatusID: 0,
        statusName: selectedOption.wheelkingStatus,
        sequenceNumber: sequenceNumber.trim(),
        active: true,
        ediStatusCode: selectedOption.ediStatusCode,
      },
    ]);

    setNextId((current) => current + 1);
    setSelectedStatus("");
    setSequenceNumber("");
    setMessage("");
  };

  const handleSequenceChange = (id: number, value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) return;

    setCustomerStatuses((current) =>
      current.map((status) =>
        status.id === id ? { ...status, sequenceNumber: value } : status,
      ),
    );
  };

  const handleActiveChange = (id: number, active: boolean) => {
    setCustomerStatuses((current) =>
      current.map((status) =>
        status.id === id ? { ...status, active } : status,
      ),
    );
  };

  const handleSave = async () => {
    if (!Number.isFinite(subOrgLocId) || subOrgLocId <= 0) {
      setMessage("Trading partner location ID is missing.");
      return;
    }

    if (customerStatuses.length === 0) {
      setMessage("Add at least one status before saving.");
      return;
    }

    const hasInvalidSequence = customerStatuses.some(
      (status) =>
        status.sequenceNumber.trim() !== "" &&
        !/^\d+$/.test(status.sequenceNumber.trim()),
    );

    if (hasInvalidSequence) {
      setMessage("Enter a valid sequence number or leave it empty.");
      return;
    }

    const fallbackSellerSolocId =
      customerStatuses.find((status) => status.sellerSolocID.trim())
        ?.sellerSolocID ||
      (Number(sellerSolocId) > 0 ? String(sellerSolocId) : "");

    if (!fallbackSellerSolocId) {
      setMessage("Seller SOLoc ID is missing. Cannot save statuses.");
      return;
    }

    const now = new Date().toISOString();

    const payload = customerStatuses.map((status) => ({
      createdDate: status.createdDate || now,
      updatedDate: now,
      tpStatuesId: status.tpStatuesId,
      tpSolocID: String(subOrgLocId),
      sellerSolocID: status.sellerSolocID || fallbackSellerSolocId,
      shipmentStatusID: status.shipmentStatusID,
      shipmentStatusName: status.statusName,
      sequenceNo: status.sequenceNumber.trim()
        ? Number(status.sequenceNumber)
        : null,
      isActive: status.active,
      ediStatusCode: status.ediStatusCode,
    }));

    setIsSaving(true);
    setMessage("");

    try {
      const response = await logisticsService.addOrUpdateStatusConfig(payload);

      const successMessage =
        typeof response === "string" && response.trim()
          ? response
          : "Status configuration saved successfully.";

      showToast(successMessage, "success");

      try {
        const savedResponse =
          await logisticsService.getShipmentStatusesForTradingPartner(
            subOrgLocId,
          );

        const refreshedStatuses: CustomerStatus[] = savedResponse.map(
          (status) => ({
            id: status.tpStatuesId,
            tpStatuesId: status.tpStatuesId,
            createdDate: status.createdDate,
            updatedDate: status.updatedDate,
            tpSolocID: status.tpSolocID,
            sellerSolocID: status.sellerSolocID,
            shipmentStatusID: status.shipmentStatusID,
            statusName: status.shipmentStatusName,
            sequenceNumber:
              status.sequenceNo == null ? "" : String(status.sequenceNo),
            active: status.isActive,
            ediStatusCode: status.ediStatusCode,
          }),
        );

        setCustomerStatuses(refreshedStatuses);

        setNextId(
          refreshedStatuses.reduce(
            (maxId, status) => Math.max(maxId, status.id),
            0,
          ) + 1,
        );
      } catch (refreshError) {
        console.error("Failed to refresh saved statuses:", refreshError);
      }
    } catch (error: unknown) {
      console.error("Failed to save trading partner statuses:", error);

      const err = error as ApiErrorResponse;

      const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.data?.Response?.Description ??
        err?.message ??
        "Failed to save status configuration.";

      showToast(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to save status configuration.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <button type="button" onClick={() => navigate("/")}>
          Home
        </button>

        <span>/</span>

        <button type="button" onClick={() => navigate("/logistics")}>
          Logistics
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() => navigate("/logistics/configuration")}
        >
          Trading Partner Configuration
        </button>

        <span>/</span>
        <span className={styles.currentBreadcrumb}>Add Status</span>
      </nav>

      <h1 className={styles.pageTitle}>Add Status</h1>

      <section className={styles.card}>
        <h2 className={styles.customerName}>{partnerName}</h2>

        <div className={styles.content}>
          <div className={styles.addPanel}>
            <div className={styles.field}>
              <label htmlFor="shipmentStatus">Shipment Status Name</label>

              <select
                id="shipmentStatus"
                value={selectedStatus}
                disabled={loadingOptions || statusOptions.length === 0}
                onChange={(event) => {
                  setSelectedStatus(event.target.value);
                  setMessage("");
                }}
              >
                <option value="">
                  {loadingOptions ? "Loading statuses..." : "Select status"}
                </option>

                {statusOptions.map((option) => {
                  const alreadyAdded = isStatusAlreadyAdded(option);

                  return (
                    <option
                      key={option.optionKey}
                      value={option.optionKey}
                      disabled={alreadyAdded}
                    >
                      {option.wheelkingStatus}
                      {alreadyAdded ? " (Already added)" : ""}
                    </option>
                  );
                })}
              </select>

              {statusLoadError && <p role="alert">{statusLoadError}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="sequenceNumber">Sequence Number</label>

              <input
                id="sequenceNumber"
                type="number"
                min="0"
                step="1"
                value={sequenceNumber}
                onChange={(event) => {
                  setSequenceNumber(event.target.value);
                  setMessage("");
                }}
              />
            </div>

            <div className={styles.addButton}>
              <Button
                title="Add"
                color="outline"
                onClick={handleAddStatus}
                icon={
                  <AppImage
                    iconPath={icons.PurplePlusIcon}
                    width="16px"
                    height="16px"
                  />
                }
              />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.statusTable}>
            <div className={styles.tableHeader}>
              <span>Sequence No</span>
              <span>Shipment Status Name</span>
              <span>Active</span>
            </div>

            {savedStatusesLoading ? (
              <div className={styles.emptyState}>Loading saved statuses...</div>
            ) : savedStatusesError ? (
              <div className={styles.emptyState} role="alert">
                {savedStatusesError}
              </div>
            ) : customerStatuses.length === 0 ? (
              <div className={styles.emptyState}>
                No statuses added yet. Select a status and click Add.
              </div>
            ) : (
              <div className={styles.tableBody}>
                {customerStatuses.map((status) => (
                  <div className={styles.statusRow} key={status.id}>
                    <div>
                      <input
                        aria-label={`Sequence number for ${status.statusName}`}
                        type="number"
                        min="0"
                        step="1"
                        value={status.sequenceNumber}
                        disabled={!status.active}
                        onChange={(event) =>
                          handleSequenceChange(status.id, event.target.value)
                        }
                      />
                    </div>

                    <div className={styles.statusName}>
                      <span>{status.statusName}</span>
                    </div>

                    <div className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        aria-label={`Activate ${status.statusName}`}
                        checked={status.active}
                        onChange={(event) =>
                          handleActiveChange(status.id, event.target.checked)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.message} role="status" aria-live="polite">
            {message}
          </div>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddStatus;
