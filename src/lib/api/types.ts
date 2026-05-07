export interface EmployeeRead {
  id: number;
  name: string;
  phone: string;
}

export interface EmployeeCreate {
  name: string;
  phone: string;
}

export interface EmployeeUpdate {
  name?: string | null;
  phone?: string | null;
}

export interface ServiceRead {
  id: number;
  name: string;
  duration_minutes: number;
  price: string;
}

export interface ServiceCreate {
  name: string;
  duration_minutes: number;
  price: string | number;
}

export interface ServiceUpdate {
  name?: string | null;
  duration_minutes?: number | null;
  price?: string | number | null;
}

export interface EmployeeServiceRead {
  id: number;
  employee_id: number;
  service_id: number;
}

export interface EmployeeServiceCreate {
  employee_id: number;
  service_id: number;
}

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AppointmentRead {
  id: number;
  employee_id: number;
  service_id: number;
  client_name: string;
  client_phone: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}

export interface AppointmentCreate {
  employee_id: number;
  service_id: number;
  client_name: string;
  client_phone: string;
  start_time: string;
  end_time: string;
  status?: AppointmentStatus;
}

export interface AppointmentUpdate {
  employee_id?: number | null;
  service_id?: number | null;
  client_name?: string | null;
  client_phone?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: AppointmentStatus | null;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  employee_ids: number[];
}

export interface AvailabilityResponse {
  service_id: number;
  employee_id: number | null;
  date: string;
  timezone: string;
  slot_interval_minutes: number;
  service_duration_minutes: number;
  slots: AvailabilitySlot[];
}
