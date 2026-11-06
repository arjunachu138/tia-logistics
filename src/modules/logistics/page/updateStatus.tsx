import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, CircularProgress, Link, Typography } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import {
  Input,
  DateInput,
  Dropdown,
  Button,
  AppImage,
} from "../../../components";
import type { DropdownOption } from "../../../components/dropdown/dropdown";
import AddLocationModal, {
  type LocationData,
} from "../components/addLocationModal";
import styles from "./updateStatus.module.css";
import { icons } from "../../../assets/icons";
import { logisticsService } from "../../../services";
import { useToast } from "../../../components/toast/ToastProvider";
import { useAppSelector } from "../../../store/hooks";
import {
  selectSolocId,
  selectUserRole,
} from "../../../store/user/userSelectors";
import type {
  BorderCrossingLocation,
  EDICodeToStatusMappingItem,
  Process214Payload,
} from "../../../shared/types/logistics";

// ─── Helper for Safe Value Extraction ────────────────────────────────────────

const extractVal = (
  obj: Record<string, unknown> | null | undefined,
  ...keys: string[]
): string => {
  if (!obj || typeof obj !== "object") return "";
  for (const k of keys) {
    if (
      obj[k] !== undefined &&
      obj[k] !== null &&
      String(obj[k]).trim() !== "" &&
      String(obj[k]).trim() !== "--"
    ) {
      return String(obj[k]).trim();
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
      String(obj[matchedKey]).trim() !== "" &&
      String(obj[matchedKey]).trim() !== "--"
    ) {
      return String(obj[matchedKey]).trim();
    }
  }
  return "";
};

// ─── Component ────────────────────────────────────────────────────────────────

const UpdateStatus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const subOrgLocId = useAppSelector(selectSolocId);
  const roleType = useAppSelector(selectUserRole);

  // ── Shipment Details ──────────────────────────────────────────────────────
  const [shipmentNumber, setShipmentNumber] = useState(id || "");
  const [scac, setScac] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [statusDate, setStatusDate] = useState<Dayjs | null>(dayjs());
  const [bolNumber, setBolNumber] = useState("");
  const [reasonCode, setReasonCode] = useState("");
  const [notes, setNotes] = useState("");

  // ── Border Crossing Event ─────────────────────────────────────────────────
  const [borderLocationOptions, setBorderLocationOptions] = useState<
    DropdownOption[]
  >([]);
  const [borderLocation, setBorderLocation] = useState("");
  const [isLoadingBorderLocations, setIsLoadingBorderLocations] =
    useState(false);
  const [selectedBorderLocation, setSelectedBorderLocation] =
    useState<BorderCrossingLocation>();

  const [borderCrossingLocations, setBorderCrossingLocations] = useState<
    BorderCrossingLocation[]
  >([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [finishDate, setFinishDate] = useState<Dayjs | null>(null);

  // ── Probill Details ───────────────────────────────────────────────────────
  const [probillNumber, setProbillNumber] = useState("");
  const [tradingPartner, setTradingPartner] = useState("");
  const [appointmentCode, setAppointmentCode] = useState("");
  const [equipment, setEquipment] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("");
  const [longitudeCode, setLongitudeCode] = useState("");
  const [latitudeCode, setLatitudeCode] = useState("");
  const [directionIdentifierCode, setDirectionIdentifierCode] = useState("");
  const [eta, setEta] = useState<Dayjs | null>(null);

  // ── Extra prefilled details for payload ──────────────────────────────────
  const [orderNumber, setOrderNumber] = useState("");
  const [accountId, setAccountId] = useState("");
  const [deliverName, setDeliverName] = useState("");
  const [deliverAdd, setDeliverAdd] = useState({
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [pickupName, setPickupName] = useState("");
  const [pickupAdd, setPickupAdd] = useState({
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // ── Dropdown Options ──────────────────────────────────────────────────────
  const [statusCodeOptions, setStatusCodeOptions] = useState<DropdownOption[]>(
    [],
  );
  const [reasonCodeOptions, setReasonCodeOptions] = useState<DropdownOption[]>(
    [],
  );
  const [appointmentCodeOptions, setAppointmentCodeOptions] = useState<
    DropdownOption[]
  >([]);

  // ── UI / Validation State ─────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─── Map and Prefill Data ─────────────────────────────────────────────────
  const applyPrefillData = useCallback((rawItem: Record<string, unknown>) => {
    const header = (rawItem.header || rawItem.Header || rawItem) as Record<
      string,
      unknown
    >;

    const headerWithPending = (rawItem.headerWithPendingStatus ||
      rawItem.HeaderWithPendingStatus ||
      {}) as Record<string, unknown>;

    const pendingLoc = (headerWithPending.pendingShipmentRealPropertyLocs ||
      headerWithPending.PendingShipmentRealPropertyLocs ||
      {}) as Record<string, unknown>;

    const pendingAddr = (headerWithPending.pendingShipmentAddrDetails ||
      headerWithPending.PendingShipmentAddrDetails ||
      {}) as Record<string, unknown>;

    const assignedObj =
      header.shipmentAssignedNumber || header.ShipmentAssignedNumber;
    const assignedList = Array.isArray(assignedObj)
      ? assignedObj
      : (assignedObj as { List?: Array<Record<string, unknown>> })?.List || [];
    const firstAssigned = (assignedList[0] || {}) as Record<string, unknown>;

    const detailsObj =
      firstAssigned.shipmentStatusDetail || firstAssigned.ShipmentStatusDetail;
    const detailsList = Array.isArray(detailsObj)
      ? detailsObj
      : (detailsObj as { List?: Array<Record<string, unknown>> })?.List || [];
    const firstStatus = (detailsList[0] || {}) as Record<string, unknown>;

    const weightsObj =
      firstAssigned.shipmentWeightDataAssignedNo ||
      firstAssigned.ShipmentWeightDataAssignedNo;
    const weightsList = Array.isArray(weightsObj)
      ? weightsObj
      : (weightsObj as { List?: Array<Record<string, unknown>> })?.List || [];
    const firstWeight = (weightsList[0] || {}) as Record<string, unknown>;

    const containerObj =
      firstStatus.shipmentContainerOwners ||
      firstStatus.ShipmentContainerOwners;
    const containers = Array.isArray(containerObj)
      ? containerObj
      : (containerObj as { List?: Array<Record<string, unknown>> })?.List || [];
    const firstContainer = (containers[0] || {}) as Record<string, unknown>;

    const propLocObj =
      firstStatus.shipmentRealPropertyLoc ||
      firstStatus.ShipmentRealPropertyLoc;
    const propLocs = Array.isArray(propLocObj)
      ? propLocObj
      : (propLocObj as { List?: Array<Record<string, unknown>> })?.List || [];
    const firstPropLoc = (propLocs[0] || {}) as Record<string, unknown>;

    // 1. Shipment Number
    const sNum = extractVal(
      header,
      "shipmentIdentificationNumber",
      "ShipmentIdentificationNumber",
    );
    if (sNum) setShipmentNumber(sNum);

    // 2. SCAC
    const scacVal = extractVal(header, "scac", "Scac");
    if (scacVal) setScac(scacVal);

    // 3. BOL Number
    const bolVal = extractVal(
      header,
      "shipmentStatusRefId",
      "ShipmentStatusRefId",
    );
    if (bolVal) setBolNumber(bolVal);

    // 4. Probill Number
    const probillVal = extractVal(header, "extra2", "Extra2");
    if (probillVal) setProbillNumber(probillVal);

    // 5. Trading Partner
    const tpVal = extractVal(header, "primaryReceiverId", "PrimaryReceiverId");
    if (tpVal) setTradingPartner(tpVal);

    // Extra Header properties
    const oNum = extractVal(header, "extra4", "Extra4");
    if (oNum) setOrderNumber(oNum);

    const accId = extractVal(header, "extra1", "Extra1");
    if (accId) setAccountId(accId);

    // Equipment
    const eqVal = extractVal(
      firstContainer,
      "equipmentNumber",
      "EquipmentNumber",
    );
    if (eqVal) setEquipment(eqVal);

    // Weight & Quantity
    // const rawWeight = extractVal(
    //   firstWeight,
    //   "shipmentWeight",
    //   "ShipmentWeight",
    // );
    // if (rawWeight && rawWeight !== "0.0000") setWeight(rawWeight);

    const wUnit = extractVal(
      firstWeight,
      "shipmentWeightUnitCode",
      "ShipmentWeightUnitCode",
    );
    if (wUnit) setWeightUnit(wUnit);

    const rawQty = extractVal(
      firstWeight,
      "shipmentLadingQty",
      "ShipmentLadingQty",
    );
    if (rawQty && rawQty !== "0.0000") setQuantity(rawQty);

    const qUnit = extractVal(
      firstWeight,
      "shipmentLadingQtyUnitCode",
      "ShipmentLadingQtyUnitCode",
    );
    if (qUnit) setQuantityUnit(qUnit);

    // Longitude / Latitude / Direction

    const lng = extractVal(
      firstPropLoc,
      "propertyLongitudeCode",
      "PropertyLongitudeCode",
    );
    if (lng) setLongitudeCode(lng);

    const lat = extractVal(
      firstPropLoc,
      "propertyLatitudeCode",
      "PropertyLatitudeCode",
    );
    if (lat) setLatitudeCode(lat);

    const dir = extractVal(
      firstPropLoc,
      "propertyDirectionId1",
      "PropertyDirectionId1",
    );
    if (dir) setDirectionIdentifierCode(dir);

    // Delivery Address
    const dName = extractVal(pendingAddr, "partyName1", "PartyName1");
    if (dName) setDeliverName(dName);
    setDeliverAdd({
      address1: extractVal(pendingAddr, "partyAddrLine1", "PartyAddrLine1"),
      city: extractVal(pendingAddr, "partyCity", "PartyCity"),
      state: extractVal(pendingAddr, "partyState", "PartyState"),
      postalCode: extractVal(pendingAddr, "partyPostalId", "PartyPostalId"),
      country: extractVal(pendingAddr, "partyCountry", "PartyCountry"),
    });

    // Pickup Address
    const pName = extractVal(pendingLoc, "partyName1", "PartyName1");
    if (pName) setPickupName(pName);
    setPickupAdd({
      address1: extractVal(pendingLoc, "partyAddrLine1", "PartyAddrLine1"),
      city: extractVal(
        pendingLoc,
        "propertyCityName",
        "PropertyCityName",
        "partyCity",
        "PartyCity",
      ),
      state: extractVal(
        pendingLoc,
        "propertyStateCode",
        "PropertyStateCode",
        "partyState",
        "PartyState",
      ),
      postalCode: extractVal(pendingLoc, "partyPostalId", "PartyPostalId"),
      country: extractVal(
        pendingLoc,
        "propertyCountryCode",
        "PropertyCountryCode",
        "partyCountry",
        "PartyCountry",
      ),
    });
  }, []);

  const fetchBorderCrossingLocations = useCallback(async () => {
    if (!shipmentNumber.trim()) {
      setBorderLocationOptions([]);
      return;
    }

    try {
      setIsLoadingBorderLocations(true);

      const response = await logisticsService.getBorderCrossingLocation(
        shipmentNumber.trim(),
      );

      const responseData = response as {
        borderCrossingLocations?: BorderCrossingLocation[];
      };

      const locations = responseData.borderCrossingLocations ?? [];

      setBorderCrossingLocations(locations);

      setBorderLocationOptions(
        locations.map((location) => ({
          label: location.partyName1,
          value: location.id,
        })),
      );
    } catch (error) {
      console.error("Failed to fetch border crossing locations:", error);

      setBorderLocationOptions([]);

      showToast("Failed to load border crossing locations.", "error");
    } finally {
      setIsLoadingBorderLocations(false);
    }
  }, [shipmentNumber]);

  const isBorderCrossing = Boolean(borderLocation?.trim());

  useEffect(() => {
    void fetchBorderCrossingLocations();
  }, [fetchBorderCrossingLocations]);
  // ─── Fetch Shipment Data if Not in State ─────────────────────────────────
  useEffect(() => {
    const stateData = (location.state as { shipmentData?: unknown })
      ?.shipmentData;

    if (stateData && typeof stateData === "object") {
      applyPrefillData(stateData as Record<string, unknown>);
      return;
    }

    // Fallback: fetch details by ID
    const fetchShipmentDetail = async () => {
      if (!id) return;
      try {
        const response = await logisticsService.getShipmentStatus(
          id,
          subOrgLocId,
          roleType || "Admin",
        );

        const raw = response as unknown as Record<string, unknown>;
        const dataObj = (raw?.data ??
          raw?.Data ??
          (raw?.Response as Record<string, unknown>)?.Data ??
          response) as Record<string, unknown>;

        let firstRecord: Record<string, unknown> | null = null;
        if (Array.isArray(dataObj) && dataObj.length > 0) {
          firstRecord = dataObj[0] as Record<string, unknown>;
        } else if (Array.isArray(dataObj?.List) && dataObj.List.length > 0) {
          firstRecord = dataObj.List[0] as Record<string, unknown>;
        } else if (Array.isArray(raw?.data) && raw.data.length > 0) {
          firstRecord = raw.data[0] as Record<string, unknown>;
        }

        if (firstRecord) {
          applyPrefillData(firstRecord);
        }
      } catch (err) {
        console.error("Error fetching shipment detail for prefill:", err);
      }
    };

    fetchShipmentDetail();
  }, [id, location.state, subOrgLocId, roleType, applyPrefillData]);

  // ─── Fetch Dropdowns from Memoized Status API ────────────────────────────
  useEffect(() => {
    const buildOptions = (
      items: EDICodeToStatusMappingItem[],
    ): DropdownOption[] => {
      const seen = new Set<string>();
      const list: DropdownOption[] = [];

      for (const item of items) {
        const val =
          item.codeType === "SC"
            ? item.wheelkingStatus.trim()
            : item.ediStatusCode;
        if (!val || seen.has(val.toLowerCase())) continue;
        seen.add(val.toLowerCase());

        const desc = (item.description || "").trim();
        const label =
          desc && !desc.toLowerCase().startsWith(val.toLowerCase())
            ? `${val} - ${desc}`
            : desc || val;

        list.push({ label, value: val });
      }
      return list;
    };

    const fetchCodeMappings = async () => {
      const solocNum = Number(subOrgLocId) || 0;

      // 1. Status Code (SC)
      try {
        const scRes = await logisticsService.getEDICodeToStatusMapping(
          "SC",
          solocNum,
        );

        const allSc = [
          ...(Array.isArray(scRes?.default) ? scRes.default : []),
          ...(Array.isArray(scRes?.tpSpecific) ? scRes.tpSpecific : []),
        ];
        const scOpts = buildOptions(allSc);
        if (scOpts.length > 0) setStatusCodeOptions(scOpts);
      } catch (err) {
        console.warn("Could not load SC mapping, using defaults:", err);
      }

      // 2. Reason Code (RC)
      try {
        const rcRes = await logisticsService.getEDICodeToStatusMapping(
          "RC",
          solocNum,
        );

        const allRc = [
          ...(Array.isArray(rcRes?.default) ? rcRes.default : []),
          ...(Array.isArray(rcRes?.tpSpecific) ? rcRes.tpSpecific : []),
        ];
        const rcOpts = buildOptions(allRc);
        if (rcOpts.length > 0) setReasonCodeOptions(rcOpts);
      } catch (err) {
        console.warn("Could not load RC mapping, using defaults:", err);
      }

      // 3. Appointment Code (AC)
      try {
        const acRes = await logisticsService.getEDICodeToStatusMapping(
          "AC",
          solocNum,
        );

        const allAc = [
          ...(Array.isArray(acRes?.default) ? acRes.default : []),
          ...(Array.isArray(acRes?.tpSpecific) ? acRes.tpSpecific : []),
        ];
        const acOpts = buildOptions(allAc);
        if (acOpts.length > 0) setAppointmentCodeOptions(acOpts);
      } catch (err) {
        console.warn("Could not load AC mapping, using defaults:", err);
      }
    };

    fetchCodeMappings();
  }, [subOrgLocId]);

  const handleSaveLocation = async (loc: LocationData) => {
    if (!loc.name1?.trim()) {
      showToast("Location name is required.", "error");
      return;
    }

    setIsAddLocationOpen(false);

    await fetchBorderCrossingLocations();

    showToast("Border locations refreshed successfully.", "success");
  };

  // ─── Clear Error Helper ───────────────────────────────────────────────────
  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // ─── Form Validation ──────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shipmentNumber.trim()) {
      newErrors.shipmentNumber = "Shipment Number is required.";
    }
    if (!scac.trim()) {
      newErrors.scac = "SCAC is required.";
    }
    if (!statusCode.trim()) {
      newErrors.statusCode = "Status Code is required.";
    }
    if (!statusDate) {
      newErrors.statusDate = "Status Date is required.";
    }
    if (!probillNumber.trim()) {
      newErrors.probillNumber = "Probill Number is required.";
    }
    if (!tradingPartner.trim()) {
      newErrors.tradingPartner = "Trading Partner is required.";
    }

    if (!equipment.trim()) {
      newErrors.equipment = "Equipment is required.";
    }

    // Notes are required only when a Reason Code is selected
    if (reasonCode.trim() && !notes.trim()) {
      newErrors.notes = "Notes are required when a Reason Code is selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Save / Submit ────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validateForm()) {
      setSaveError("Please fill in all required fields.");
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    const formattedDocDate = dayjs().format("YYYY-MM-DDTHH:mm:ss.0000000");
    const formattedStatusDate = statusDate
      ? statusDate.format("YYYY-MM-DDTHH:mm:ss.0000000")
      : formattedDocDate;
    const formattedEta = eta ? eta.format("YYYY-MM-DDTHH:mm:ss.0000000") : null;
    const formattedStartDate = startDate
      ? startDate.format("YYYY-MM-DDTHH:mm:ss.0000000")
      : null;
    const formattedFinishDate = finishDate
      ? finishDate.format("YYYY-MM-DDTHH:mm:ss.0000000")
      : null;

    const parsedWeight = Number(weight);
    const parsedQuantity = Number(quantity);
    const parsedProbillNumber = Number(probillNumber);
    const parsedOrderNumber = Number(orderNumber);
    const parsedAccountId = Number(accountId);

    // const payload: Process214Payload = [
    //   {
    //     EdiShipmentIDNumber: shipmentNumber.trim(),
    //     SCAC: scac.trim(),
    //     DocDate: formattedDocDate,
    //     Deliver: deliverName,
    //     DeliverAdd: {
    //       List: [
    //         {
    //           Address1: deliverAdd.address1,
    //           City: deliverAdd.city,
    //           State: deliverAdd.state,
    //           PostalCode: deliverAdd.postalCode,
    //           Contact: "",
    //           Phone: "",
    //           Fax: "",
    //           Country: deliverAdd.country,
    //           TimeZone: "",
    //           refQlf: "",
    //           refValue: "",
    //         },
    //       ],
    //     },
    //     Pickup: pickupName,
    //     PickupAdd: {
    //       List: [
    //         {
    //           Address1: pickupAdd.address1,
    //           City: pickupAdd.city,
    //           State: pickupAdd.state,
    //           PostalCode: pickupAdd.postalCode,
    //           Contact: "",
    //           Phone: "",
    //           Fax: "",
    //           Country: pickupAdd.country,
    //           TimeZone: "",
    //           refQlf: "",
    //           refValue: "",
    //         },
    //       ],
    //     },
    //     StatusCode: statusCode.trim(),
    //     StatusDate: formattedStatusDate,
    //     WeightUnit: weightUnit.trim(),
    //     Weight: weight.trim(),
    //     Quantity: quantity.trim(),
    //     QuantityUnit: quantityUnit.trim(),
    //     PoNo: shipmentNumber.trim(),
    //     BolNumber: bolNumber.trim(),
    //     ProbillNo: probillNumber.trim(),
    //     OrderNumber: orderNumber.trim(),
    //     AccountID: accountId.trim(),
    //     TradingPartnerName: tradingPartner.trim(),
    //     Equipment: equipment.trim(),
    //     TiaStatus: "Success",
    //     LongitudeCode: longitudeCode.trim(),
    //     LatitudeCode: latitudeCode.trim(),
    //     DirectionIdentifierCode: directionIdentifierCode.trim(),
    //     DelayCode: reasonCode.trim(),
    //     Eta: formattedEta,
    //     AppointmentCode: appointmentCode.trim(),
    // borderLocation: borderLocation.trim(),
    // borderStartDate: formattedStartDate,
    // borderFinishDate: formattedFinishDate,
    // isBorderCrossing: Boolean(borderLocation.trim()),
    //     Notes: notes.trim(),
    //   },
    // ];

    const payload: Process214Payload = [
      {
        ediShipmentIDNumber: shipmentNumber.trim(),
        SCAC: scac.trim(),
        docDate: formattedDocDate,
        deliver: isBorderCrossing
          ? (selectedBorderLocation?.partyName1 ?? "")
          : deliverName.trim(),
        deliverAdd: [
          isBorderCrossing
            ? {
                address1: selectedBorderLocation?.partyAddrLine1 ?? "",
                city: selectedBorderLocation?.partyCity ?? "",
                state: selectedBorderLocation?.partyState ?? "",
                postalCode: selectedBorderLocation?.partyPostalId ?? "",
                contact: "",
                phone: "",
                fax: "",
                Country: selectedBorderLocation?.partyCountry ?? "",
                timeZone: "ET",
              }
            : {
                address1: deliverAdd.address1.trim(),
                city: deliverAdd.city.trim(),
                state: deliverAdd.state.trim(),
                postalCode: deliverAdd.postalCode.trim(),
                contact: "",
                phone: "",
                fax: "",
                Country: deliverAdd.country.trim(),
                timeZone: "ET",
              },
        ],
        pickup: isBorderCrossing
          ? (selectedBorderLocation?.partyName1 ?? "")
          : pickupName.trim(),
        pickupAdd: [
          isBorderCrossing
            ? {
                address1: selectedBorderLocation?.partyAddrLine1 ?? "",
                city: selectedBorderLocation?.partyCity ?? "",
                state: selectedBorderLocation?.partyState ?? "",
                postalCode: selectedBorderLocation?.partyPostalId ?? "",
                contact: "",
                phone: "",
                fax: "",
                Country: selectedBorderLocation?.partyCountry ?? "",
                timeZone: "ET",
              }
            : {
                address1: pickupAdd.address1.trim(),
                city: pickupAdd.city.trim(),
                state: pickupAdd.state.trim(),
                postalCode: pickupAdd.postalCode.trim(),
                contact: "",
                phone: "",
                fax: "",
                Country: pickupAdd.country.trim(),
                timeZone: "ET",
              },
        ],
        // The API requirement is to send the selected status label, not only its value.
        statusCode: statusCode.trim(),
        statusDate: formattedStatusDate,
        weightUnit: weightUnit.trim(),
        weight:
          Number.isFinite(parsedWeight) && weight.trim() ? parsedWeight : 0,
        quantity:
          Number.isFinite(parsedQuantity) && quantity.trim()
            ? parsedQuantity
            : 0,
        quantityUnit: quantityUnit.trim(),
        poNo: shipmentNumber.trim(),
        bolNumber: bolNumber.trim(),
        probillNo: Number.isFinite(parsedProbillNumber)
          ? parsedProbillNumber
          : 0,
        orderNumber:
          Number.isFinite(parsedOrderNumber) && orderNumber.trim()
            ? parsedOrderNumber
            : 0,
        accountID:
          Number.isFinite(parsedAccountId) && accountId.trim()
            ? parsedAccountId
            : 0,
        TradingPartnerName: tradingPartner.trim(),
        equipment: equipment.trim(),
        TiaStatus: "Success",
        TiaErrorDesc: null,
        longitudeCode: longitudeCode.trim(),
        latitudeCode: latitudeCode.trim(),
        directionIdentifierCode: directionIdentifierCode.trim(),
        delayCode: reasonCode.trim(),
        eta: formattedEta,
        appointmentCode: appointmentCode.trim(),
        borderLocation: borderLocation.trim(),
        borderStartDate: formattedStartDate ?? undefined,
        borderFinishDate: formattedFinishDate ?? undefined,
        isBorderCrossing: isBorderCrossing,
      },
    ];

    try {
      await logisticsService.createShipmentStatus(payload);
      showToast("Shipment status updated successfully.", "success");
      navigate(
        `/logistics/load-tenders/shipment-status/${shipmentNumber || id}`,
      );
    } catch (err) {
      console.error("Error submitting status update:", err);
      const errMsg = "Failed to save status. Please try again.";
      setSaveError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/logistics/load-tenders/shipment-status/${id || shipmentNumber}`);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

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
        <Link
          onClick={() =>
            navigate(
              `/logistics/load-tenders/shipment-status/${id || shipmentNumber}`,
            )
          }
          underline="none"
          className={styles.breadcrumbLink}
          sx={{
            color: "#141414",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {id || shipmentNumber
            ? `Shipment Status - ${id || shipmentNumber}`
            : "Shipment Status"}
        </Link>
        <Typography
          sx={{
            color: "#7b7b7b",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Update Status
        </Typography>
      </Breadcrumbs>
      <div className={styles.saveContainer}>
        <Button
          title="Cancel"
          type="button"
          color="outline"
          onClick={handleCancel}
          icon={
            <AppImage iconPath={icons.CancelIcon} width="12px" height="12px" />
          }
        />

        <Button
          title={isSaving ? "Saving..." : "Save"}
          className={styles.saveButton}
          color="primary"
          disabled={isSaving}
          icon={
            isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AppImage
                iconPath={icons.savePrimary}
                width="22px"
                height="24px"
              />
            )
          }
          onClick={handleSave}
        />
      </div>
      {/* Card 1: Shipment Details */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Shipment Details</h3>
        <div className={styles.grid4}>
          <Input
            label="Shipment Number"
            required
            placeholder="Enter Shipment Number"
            value={shipmentNumber}
            error={errors.shipmentNumber}
            onChange={(e) => {
              setShipmentNumber(e.target.value);
              clearFieldError("shipmentNumber");
            }}
          />

          <Input
            label="SCAC"
            required
            placeholder="Enter SCAC"
            value={scac}
            error={errors.scac}
            onChange={(e) => {
              setScac(e.target.value);
              clearFieldError("scac");
            }}
          />

          <div className={styles.dropdownWrapper}>
            <Dropdown
              label="Status Code"
              required
              placeholder="Select"
              options={statusCodeOptions}
              value={statusCode}
              onSelect={(opt) => {
                setStatusCode(opt.value);
                clearFieldError("statusCode");
              }}
            />
            {errors.statusCode && (
              <span className={styles.fieldError}>{errors.statusCode}</span>
            )}
          </div>

          <DateInput
            label="Status Date"
            required
            placeholder="DD/MM/YYYY"
            value={statusDate}
            error={errors.statusDate}
            onChange={(val) => {
              setStatusDate(val);
              clearFieldError("statusDate");
            }}
            format="DD/MM/YYYY"
          />

          <Input
            label="BOL Number"
            placeholder="Enter BOL Number"
            value={bolNumber}
            onChange={(e) => setBolNumber(e.target.value)}
          />

          <div className={styles.dropdownWrapper}>
            <Dropdown
              label="Reason Code"
              placeholder="Select"
              options={reasonCodeOptions}
              value={reasonCode}
              onSelect={(opt) => {
                setReasonCode(opt.value);
                clearFieldError("notes");
              }}
            />
          </div>

          <div className={styles.notesSpan2}>
            <Input
              label="Notes"
              placeholder="Enter Notes"
              required={Boolean(reasonCode.trim)}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                clearFieldError("notes");
              }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Border Crossing Event */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Border Crossing Event</h3>
        <div className={styles.borderEventRow}>
          <Dropdown
            label="Border Location"
            placeholder="Select border location"
            options={borderLocationOptions}
            value={selectedBorderLocation?.id ?? ""}
            disabled={statusCode !== "BORDER" || isLoadingBorderLocations}
            onSelect={(option) => {
              const selectedLocation =
                borderCrossingLocations.find(
                  (location) => location.id === option.value,
                ) ?? null;

              setSelectedBorderLocation(selectedLocation ?? undefined);
              setBorderLocation(option.value);
            }}
          />

          <div className={styles.addLocationButtonWrapper}>
            <button
              type="button"
              className={styles.addLocationButton}
              onClick={() => setIsAddLocationOpen(true)}
            >
              + Add New Location
            </button>
          </div>

          <DateInput
            label="Start Date"
            disabled={statusCode !== "BORDER"}
            placeholder="DD/MM/YYYY"
            value={startDate}
            onChange={(val) => setStartDate(val)}
            format="DD/MM/YYYY"
          />

          <DateInput
            label="Finish Date"
            disabled={statusCode !== "BORDER"}
            placeholder="DD/MM/YYYY"
            value={finishDate}
            onChange={(val) => setFinishDate(val)}
            format="DD/MM/YYYY"
          />
        </div>
        {statusCode === "BORDER" && (
          <p style={{ padding: "10px 16px " }}>
            {`Default Address Selected : ${selectedBorderLocation?.partyName1 ?? ""} , 
            ${selectedBorderLocation?.partyAddrLine1 ?? ""}`}
          </p>
        )}
      </div>

      {/* Card 3: Probill Details */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Probill Details</h3>
        <div className={styles.grid4}>
          {/* Row 1 */}
          <Input
            label="Probill Number"
            required
            placeholder="Enter Probill Number"
            value={probillNumber}
            error={errors.probillNumber}
            onChange={(e) => {
              setProbillNumber(e.target.value);
              clearFieldError("probillNumber");
            }}
          />

          <Input
            label="Trading Partner"
            required
            placeholder="Enter Trading Partner"
            value={tradingPartner}
            error={errors.tradingPartner}
            onChange={(e) => {
              setTradingPartner(e.target.value);
              clearFieldError("tradingPartner");
            }}
          />

          <div className={styles.dropdownWrapper}>
            <Dropdown
              label="Appointment Code"
              placeholder="Select"
              options={appointmentCodeOptions}
              value={appointmentCode}
              onSelect={(opt) => {
                setAppointmentCode(opt.value);
              }}
            />
          </div>

          <Input
            label="Equipment"
            required
            placeholder="Enter Equipment"
            value={equipment}
            error={errors.equipment}
            onChange={(e) => {
              setEquipment(e.target.value);
              clearFieldError("equipment");
            }}
          />

          {/* Row 2 */}
          <Input
            label="Weight"
            placeholder="Enter Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <Input
            label="Weight Unit"
            placeholder="Enter Weight Unit"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
          />

          <Input
            label="Quantity"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Input
            label="Quantity Unit"
            placeholder="Enter Quantity Unit"
            value={quantityUnit}
            onChange={(e) => setQuantityUnit(e.target.value)}
          />

          {/* Row 3 */}
          <Input
            label="Longitude Code"
            placeholder="Enter Longitude Code"
            value={longitudeCode}
            onChange={(e) => setLongitudeCode(e.target.value)}
          />

          <Input
            label="Latitude Code"
            placeholder="Enter Latitude Code"
            value={latitudeCode}
            onChange={(e) => setLatitudeCode(e.target.value)}
          />

          <Input
            label="Direction Identifier Code"
            placeholder="Enter Direction Identifier Code"
            value={directionIdentifierCode}
            onChange={(e) => setDirectionIdentifierCode(e.target.value)}
          />

          <DateInput
            label="ETA"
            placeholder="DD/MM/YYYY"
            value={eta}
            onChange={(val) => setEta(val)}
            format="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* Error message */}
      {saveError && <div className={styles.errorMessage}>{saveError}</div>}

      {/* Add Location Modal */}
      <AddLocationModal
        open={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        onSave={handleSaveLocation}
      />
    </div>
  );
};

export default UpdateStatus;
