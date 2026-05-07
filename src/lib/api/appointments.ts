import { apiFetch, qs } from "./client";
import type {
  AppointmentCreate,
  AppointmentRead,
  AppointmentStatus,
  AppointmentUpdate,
} from "./types";

export interface AppointmentsFilters {
  employee_id?: number;
  status?: AppointmentStatus;
  from?: string;
  to?: string;
}

export const listAppointments = (filters?: AppointmentsFilters) =>
  apiFetch<AppointmentRead[]>(`/appointments${qs(filters ?? {})}`);

export const getAppointment = (appointmentId: number) =>
  apiFetch<AppointmentRead>(`/appointments/${appointmentId}`);

export const createAppointment = (payload: AppointmentCreate) =>
  apiFetch<AppointmentRead>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAppointment = (appointmentId: number, payload: AppointmentUpdate) =>
  apiFetch<AppointmentRead>(`/appointments/${appointmentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteAppointment = (appointmentId: number) =>
  apiFetch<null>(`/appointments/${appointmentId}`, { method: "DELETE" });
