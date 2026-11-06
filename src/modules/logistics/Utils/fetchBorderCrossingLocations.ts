import type { DropdownOption } from "../../../components/dropdown/dropdown";
import { logisticsService } from "../../../services";
interface BorderCrossingLocation {
  id: string;
  partyName1: string;
  partyName2?: string | null;
  partyId?: string | null;
  partyAddrLine1?: string | null;
  partyCity?: string | null;
  partyState?: string | null;
  partyCountry?: string | null;
}
interface BorderCrossingLocationResponse {
  stopOffAddrDetails?: unknown[];
  borderCrossingLocations?: BorderCrossingLocation[];
}

export const getBorderCrossingLocationOptions = async (
  shipmentNo: string,
): Promise<DropdownOption[]> => {
  const normalizedShipmentNo = shipmentNo.trim();

  if (!normalizedShipmentNo) return [];

  const response = (await logisticsService.getBorderCrossingLocation(
    normalizedShipmentNo,
  )) as BorderCrossingLocationResponse;
  console.log(response);

  const locations = response?.borderCrossingLocations ?? [];

  return locations
    .filter((location) => location.id && location.partyName1?.trim())
    .map((location) => ({
      label: location.partyName1.trim(),
      value: location.id,
    }));
};
