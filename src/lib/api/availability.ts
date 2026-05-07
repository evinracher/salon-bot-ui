import { apiFetch, qs } from "./client";
import type { AvailabilityResponse } from "./types";

export interface AvailabilityParams {
  service_id: number;
  date: string;
  employee_id?: number;
  duration_minutes?: number;
}

export const getAvailability = (params: AvailabilityParams) =>
  apiFetch<AvailabilityResponse>(`/availability${qs(params)}`);
