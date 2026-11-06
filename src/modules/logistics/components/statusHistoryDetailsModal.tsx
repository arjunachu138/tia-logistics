import React from "react";
import styles from "./statusHistoryDetailsModal.module.css";
import { AppImage, Button } from "../../../components";
import { icons } from "../../../assets/icons";

export interface StatusHistoryDetailData {
  shipmentNumber: string;
  scac: string;
  statusCode: string;
  statusDate: string;
  statusTime: string;
  poNo: string;
  probillNo: string;
  orderNumber: string;
  account: string;
  tradingPartnerName: string;
  bolNumber: string;
  equipment: string;
  longitudeCode: string;
  latitudeCode: string;
  directionIdentifierCode: string;
  appointmentCode: string;
  reasonCode: string;
  reasonDescription: string;
  eta: string;
  etaTime: string;
  quantity: string | number;
  quantityUnit: string;
  weight: string | number;
  weightUnit: string;
}

interface StatusHistoryDetailsModalProps {
  open: boolean;
  data?: Partial<StatusHistoryDetailData>;
  onClose: () => void;
}

const defaultDetailData: StatusHistoryDetailData = {
  shipmentNumber: "311968256",
  scac: "WKTV",
  statusCode: "D1",
  statusDate: "Jun 01, 2026",
  statusTime: "14:20:09",
  poNo: "31152548",
  probillNo: "32514",
  orderNumber: "20155",
  account: "7",
  tradingPartnerName: "BRP EDI",
  bolNumber: "RR2552551",
  equipment: "Truck",
  longitudeCode: "--",
  latitudeCode: "--",
  directionIdentifierCode: "--",
  appointmentCode: "--",
  reasonCode: "NS",
  reasonDescription: "Normal Status",
  eta: "Jun 01, 2026",
  etaTime: "14:20:09",
  quantity: "10",
  quantityUnit: "Numbers",
  weight: "100",
  weightUnit: "KG",
};

const StatusHistoryDetailsModal: React.FC<StatusHistoryDetailsModalProps> = ({
  open,
  data,
  onClose,
}) => {
  if (!open) return null;

  const detail = { ...defaultDetailData, ...data };

  const fields: { label: string; value: string | number }[] = [
    // Row 1
    { label: "Shipment Number", value: detail.shipmentNumber },
    { label: "SCAC", value: detail.scac },
    { label: "Status Code", value: detail.statusCode },
    { label: "Status Date", value: detail.statusDate },
    { label: "Status Time", value: detail.statusTime },
    { label: "Po No", value: detail.poNo },

    // Row 2
    { label: "Probill No", value: detail.probillNo },
    { label: "Order Number", value: detail.orderNumber },
    { label: "Account", value: detail.account },
    { label: "Trading Partner Name", value: detail.tradingPartnerName },
    { label: "Bol Number", value: detail.bolNumber },
    { label: "Equipment", value: detail.equipment },

    // Row 3
    { label: "Longitude Code", value: detail.longitudeCode },
    { label: "Latitude Code", value: detail.latitudeCode },
    {
      label: "Direction Identifier Code",
      value: detail.directionIdentifierCode,
    },
    { label: "Appointment Code", value: detail.appointmentCode },
    { label: "Reason Code", value: detail.reasonCode },
    { label: "Reason Description", value: detail.reasonDescription },

    // Row 4
    { label: "ETA", value: detail.eta },
    { label: "ETA Time", value: detail.etaTime },
    { label: "Quantity", value: detail.quantity },
    { label: "Quantity Unit", value: detail.quantityUnit },
    { label: "Weight", value: detail.weight },
    { label: "Weight Unit", value: detail.weightUnit },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}># Status History</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.grid}>
            {fields.map((f, index) => (
              <div key={index} className={styles.item}>
                <span className={styles.itemLabel}>{f.label}</span>
                <span className={styles.itemValue}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            title="Cancel"
            icon={
              <AppImage
                iconPath={icons.CancelIcon}
                height="14px"
                width="14px"
              />
            }
            type="button"
            color="outline"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryDetailsModal;
