import { apiFetch, qs } from "./client";
import type { EmployeeServiceCreate, EmployeeServiceRead } from "./types";

export interface EmployeeServicesFilters {
  employee_id?: number;
  service_id?: number;
}

export const listEmployeeServices = (filters?: EmployeeServicesFilters) =>
  apiFetch<EmployeeServiceRead[]>(`/employee-services${qs(filters ?? {})}`);

export const getEmployeeService = (employeeServiceId: number) =>
  apiFetch<EmployeeServiceRead>(`/employee-services/${employeeServiceId}`);

export const createEmployeeService = (payload: EmployeeServiceCreate) =>
  apiFetch<EmployeeServiceRead>("/employee-services", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteEmployeeService = (employeeServiceId: number) =>
  apiFetch<null>(`/employee-services/${employeeServiceId}`, {
    method: "DELETE",
  });
