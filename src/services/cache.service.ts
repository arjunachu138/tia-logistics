import { useQuery } from "@tanstack/react-query";

import { logisticsService } from "./logistics.service";
import type { PartnerDetail } from "../shared/types";

export const usePartnerDetails = (soId: number) => {
  return useQuery<PartnerDetail[]>({
    queryKey: ["partnerDetails", soId],
    queryFn: () => logisticsService.getPartnerDetails(soId),
    enabled: !!soId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
