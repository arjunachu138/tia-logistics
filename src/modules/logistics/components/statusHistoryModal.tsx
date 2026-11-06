import React, { useState } from "react";
import styles from "./statusHistoryModal.module.css";
import StatusHistoryDetailsModal, {
  type StatusHistoryDetailData,
} from "./statusHistoryDetailsModal";
import { AppImage, Button } from "../../../components";
import { icons } from "../../../assets/icons";

export interface StatusHistoryItem {
  statusCode: string;
  statusDesc: string;
  statusDate: string;
  statusTime: string;
  reasonCode: string;
  reasonDesc: string;
  notes: string;
  detail?: Partial<StatusHistoryDetailData>;
}

interface StatusHistoryModalProps {
  open: boolean;
  historyList?: StatusHistoryItem[];
  loading?: boolean;
  shipmentNo?: string;
  onClose: () => void;
}

const StatusHistoryModal: React.FC<StatusHistoryModalProps> = ({
  open,
  historyList = [],
  loading = false,
  onClose,
}) => {
  const [selectedDetail, setSelectedDetail] =
    useState<Partial<StatusHistoryDetailData> | null>(null);
  console.log(historyList);

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Status History</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <AppImage iconPath={icons.CloseBlue} width="14px" height="14px" />
            </button>
          </div>

          <div className={styles.tableWrapper}>
            {loading ? (
              <div className={styles.loadingRow}>Loading status history...</div>
            ) : historyList.length === 0 ? (
              <div className={styles.emptyRow}>No history records found.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Status Code</th>
                    <th>Status Desc</th>
                    <th>Status Date</th>
                    <th>Status time</th>
                    <th>Reason Code</th>
                    <th>Reason Desc</th>
                    <th className={styles.detailsCol}>Details</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.statusCode}</td>
                      <td>{item.statusDesc}</td>
                      <td>{item.statusDate}</td>
                      <td>{item.statusTime}</td>
                      <td>{item.reasonCode}</td>
                      <td>{item.reasonDesc}</td>
                      <td className={styles.detailsCol}>
                        <button
                          type="button"
                          className={styles.infoButton}
                          title="View Status Details"
                          onClick={() => setSelectedDetail(item.detail || {})}
                        >
                          <AppImage
                            iconPath={icons.InfoIcon}
                            width="16px"
                            height="16px"
                          />
                        </button>
                      </td>
                      <td>{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Status History Details Modal */}
      <StatusHistoryDetailsModal
        open={Boolean(selectedDetail)}
        data={selectedDetail || undefined}
        onClose={() => setSelectedDetail(null)}
      />
    </>
  );
};

export default StatusHistoryModal;
