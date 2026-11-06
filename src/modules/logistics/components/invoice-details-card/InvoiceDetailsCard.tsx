import React from "react";
import styles from "./InvoiceDetailsCard.module.css";
import { icons } from "../../../../assets/icons";
import { AppImage } from "../../../../components";

export interface InvoiceDetailsData {
  Division: string;
  TradingPartner: string;
  AccountName: string;
  Quantity: string;
  TotalCharge: string;
  TotalAmount: string;
  Currency: string;
  BolNo: string;
  OrderNo: string;
  Description: string;
}

interface OrderDetailsCardProps {
  data: InvoiceDetailsData;
}

const InvoiceDetailsCard: React.FC<OrderDetailsCardProps> = ({ data }) => {
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>
          <AppImage
            iconPath={icons.ClipboardGreen}
            width="24px"
            height="24px"
          />
        </span>

        <span className={styles.cardTitle}>Invoice Details</span>
      </div>

      {/* Invoice Information */}
      <div className={styles.section}>
        <div className={styles.infoGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Division</span>
            <span className={styles.fieldValue}>{data.Division}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Trading Partner</span>
            <span className={styles.fieldValue}>{data.TradingPartner}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Account Name</span>
            <span className={styles.fieldValue}>{data.AccountName}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Payment Terms */}
      <div className={styles.section}>
        <div className={styles.infoGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Quantity</span>
            <span className={styles.fieldValue}>{data.Quantity}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Total Charge</span>
            <span className={styles.fieldValue}>{data.TotalCharge}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Total Amount</span>
            <span className={styles.fieldValue}>{data.TotalAmount}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Payment Terms */}
      <div className={styles.section}>
        <div className={styles.infoGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Currency</span>
            <span className={styles.fieldValue}>{data.Currency}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Bol No</span>
            <span className={styles.fieldValue}>{data.BolNo}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Order No</span>
            <span className={styles.fieldValue}>{data.OrderNo}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Payment Terms */}
      <div className={styles.section}>
        <div className={styles.infoGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Description</span>
            <span className={styles.fieldValue}>{data.Description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsCard;
