import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
  type AppointmentsFilters,
} from "./appointments";
import { getAvailability, type AvailabilityParams } from "./availability";
import {
  createEmployeeService,
  deleteEmployeeService,
  getEmployeeService,
  listEmployeeServices,
  type EmployeeServicesFilters,
} from "./employeeServices";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from "./employees";
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "./services";
import type {
  AppointmentCreate,
  AppointmentUpdate,
  EmployeeCreate,
  EmployeeServiceCreate,
  EmployeeUpdate,
  ServiceCreate,
  ServiceUpdate,
} from "./types";

const qk = {
  employees: ["employees"] as const,
  services: ["services"] as const,
  employeeServices: (filters?: EmployeeServicesFilters) =>
    ["employee-services", filters ?? {}] as const,
  appointments: (filters?: AppointmentsFilters) => ["appointments", filters ?? {}] as const,
  availability: (params?: Partial<AvailabilityParams>) => ["availability", params ?? {}] as const,
};

function useMutationError() {
  return (error: unknown) => {
    toast.error(error instanceof Error ? error.message : "Ocurrio un error inesperado");
  };
}

export function useEmployees() {
  return useQuery({ queryKey: qk.employees, queryFn: listEmployees });
}

export function useEmployee(employeeId?: number) {
  return useQuery({
    queryKey: ["employees", employeeId],
    queryFn: () => getEmployee(employeeId as number),
    enabled: Boolean(employeeId),
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeCreate) => createEmployee(payload),
    onSuccess: () => {
      toast.success("Empleada creada");
      qc.invalidateQueries({ queryKey: qk.employees });
    },
    onError: useMutationError(),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EmployeeUpdate }) =>
      updateEmployee(id, payload),
    onSuccess: () => {
      toast.success("Empleada actualizada");
      qc.invalidateQueries({ queryKey: qk.employees });
    },
    onError: useMutationError(),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      toast.success("Empleada eliminada");
      qc.invalidateQueries({ queryKey: qk.employees });
      qc.invalidateQueries({ queryKey: ["employee-services"] });
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: useMutationError(),
  });
}

export function useServices() {
  return useQuery({ queryKey: qk.services, queryFn: listServices });
}

export function useService(serviceId?: number) {
  return useQuery({
    queryKey: ["services", serviceId],
    queryFn: () => getService(serviceId as number),
    enabled: Boolean(serviceId),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceCreate) => createService(payload),
    onSuccess: () => {
      toast.success("Servicio creado");
      qc.invalidateQueries({ queryKey: qk.services });
    },
    onError: useMutationError(),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ServiceUpdate }) =>
      updateService(id, payload),
    onSuccess: () => {
      toast.success("Servicio actualizado");
      qc.invalidateQueries({ queryKey: qk.services });
    },
    onError: useMutationError(),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      toast.success("Servicio eliminado");
      qc.invalidateQueries({ queryKey: qk.services });
      qc.invalidateQueries({ queryKey: ["employee-services"] });
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: useMutationError(),
  });
}

export function useEmployeeServices(filters?: EmployeeServicesFilters) {
  return useQuery({
    queryKey: qk.employeeServices(filters),
    queryFn: () => listEmployeeServices(filters),
  });
}

export function useEmployeeService(employeeServiceId?: number) {
  return useQuery({
    queryKey: ["employee-services", employeeServiceId],
    queryFn: () => getEmployeeService(employeeServiceId as number),
    enabled: Boolean(employeeServiceId),
  });
}

export function useCreateEmployeeService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeServiceCreate) => createEmployeeService(payload),
    onSuccess: () => {
      toast.success("Asignacion creada");
      qc.invalidateQueries({ queryKey: ["employee-services"] });
    },
    onError: useMutationError(),
  });
}

export function useDeleteEmployeeService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEmployeeService(id),
    onSuccess: () => {
      toast.success("Asignacion eliminada");
      qc.invalidateQueries({ queryKey: ["employee-services"] });
    },
    onError: useMutationError(),
  });
}

export function useAppointments(filters?: AppointmentsFilters) {
  return useQuery({
    queryKey: qk.appointments(filters),
    queryFn: () => listAppointments(filters),
  });
}

export function useAppointment(appointmentId?: number) {
  return useQuery({
    queryKey: ["appointments", appointmentId],
    queryFn: () => getAppointment(appointmentId as number),
    enabled: Boolean(appointmentId),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AppointmentCreate) => createAppointment(payload),
    onSuccess: () => {
      toast.success("Cita creada");
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: useMutationError(),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AppointmentUpdate }) =>
      updateAppointment(id, payload),
    onSuccess: () => {
      toast.success("Cita actualizada");
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: useMutationError(),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAppointment(id),
    onSuccess: () => {
      toast.success("Cita eliminada");
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: useMutationError(),
  });
}

export function useAvailability(params?: Partial<AvailabilityParams>) {
  return useQuery({
    queryKey: qk.availability(params),
    queryFn: () => getAvailability(params as AvailabilityParams),
    enabled: Boolean(params?.service_id && params?.date),
  });
}
