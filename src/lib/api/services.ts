import { apiFetch } from "./client";
import type { ServiceCreate, ServiceRead, ServiceUpdate } from "./types";

export const listServices = () => apiFetch<ServiceRead[]>("/services");

export const getService = (serviceId: number) =>
  apiFetch<ServiceRead>(`/services/${serviceId}`);

export const createService = (payload: ServiceCreate) =>
  apiFetch<ServiceRead>("/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateService = (serviceId: number, payload: ServiceUpdate) =>
  apiFetch<ServiceRead>(`/services/${serviceId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteService = (serviceId: number) =>
  apiFetch<null>(`/services/${serviceId}`, { method: "DELETE" });
