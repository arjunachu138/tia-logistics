import { lazy } from "react";

export const LoadTenders = lazy(
  () => import("../modules/logistics/page/load-tender"),
);
export const Probills = lazy(
  () => import("../modules/logistics/page/probills"),
);

export const LogisticsInvoices = lazy(
  () => import("../modules/logistics/page/logistics-invoices"),
);

export const LogisticsInvoicesDetails = lazy(
  () => import("../modules/logistics/page/logistics-InvoiceDetails"),
);

export const Configuration = lazy(
  () => import("../modules/logistics/page/configuration"),
);

export const AddStatus = lazy(
  () => import("../modules/logistics/page/addStatus"),
);

export const ShipmentStatus = lazy(
  () => import("../modules/logistics/page/shipmentStatus"),
);
export const UpdateStatus = lazy(
  () => import("../modules/logistics/page/updateStatus"),
);

export const Login = lazy(() => import("../modules/login/pages/login"));

export const LogisticsInvoiceDetails = lazy(
  () => import("../modules/logistics/page/logistics-InvoiceDetails"),
);
