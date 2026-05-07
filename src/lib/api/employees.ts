import { apiFetch } from "./client";
import type { EmployeeCreate, EmployeeRead, EmployeeUpdate } from "./types";

export const listEmployees = () => apiFetch<EmployeeRead[]>("/employees");

export const getEmployee = (employeeId: number) =>
  apiFetch<EmployeeRead>(`/employees/${employeeId}`);

export const createEmployee = (payload: EmployeeCreate) =>
  apiFetch<EmployeeRead>("/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateEmployee = (employeeId: number, payload: EmployeeUpdate) =>
  apiFetch<EmployeeRead>(`/employees/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteEmployee = (employeeId: number) =>
  apiFetch<null>(`/employees/${employeeId}`, { method: "DELETE" });
