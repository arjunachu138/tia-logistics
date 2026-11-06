import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts";

import {
  Login,
  LoadTenders,
  Probills,
  LogisticsInvoices,
  LogisticsInvoicesDetails,
  ShipmentStatus,
  UpdateStatus,
  Configuration,
  AddStatus,
} from "./lazy-pages";

import { SuspenseRoute } from "./suspense-route";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <SuspenseRoute Component={Login} />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/logistics/load-tenders" replace />,
          },
          {
            path: "logistics",
            children: [
              {
                path: "load-tenders",
                element: <SuspenseRoute Component={LoadTenders} />,
              },
              {
                path: "load-tenders/probills/:id",
                element: <SuspenseRoute Component={Probills} />,
              },
              {
                path: "load-tenders/shipment-status/:id",
                element: <SuspenseRoute Component={ShipmentStatus} />,
              },
              {
                path: "load-tenders/shipment-status/:id/update",
                element: <SuspenseRoute Component={UpdateStatus} />,
              },
              {
                path: "invoices",
                element: <SuspenseRoute Component={LogisticsInvoices} />,
              },
              {
                path: "invoices/:id",
                element: <SuspenseRoute Component={LogisticsInvoicesDetails} />,
              },
              {
                path: "configuration",
                element: <SuspenseRoute Component={Configuration} />,
              },
              {
                path: "configuration/add-status",
                element: <SuspenseRoute Component={AddStatus} />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/logistics/load-tenders" replace />,
  },
]);

export default router;
