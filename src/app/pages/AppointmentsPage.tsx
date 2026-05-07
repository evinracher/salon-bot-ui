import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AppointmentCard } from "@/app/components/AppointmentCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  useAppointments,
  useAvailability,
  useCreateAppointment,
  useDeleteAppointment,
  useEmployees,
  useServices,
  useUpdateAppointment,
} from "@/lib/api/hooks";
import type { AppointmentRead, AppointmentStatus } from "@/lib/api/types";

const statusOptions: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

function dayBounds(dateStr: string) {
  const from = new Date(`${dateStr}T00:00:00`);
  const to = new Date(`${dateStr}T23:59:59`);
  return { from: from.toISOString(), to: to.toISOString() };
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AppointmentsPage() {
  const [date, setDate] = useState(todayIsoDate());
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<AppointmentRead | null>(null);
  const [deleting, setDeleting] = useState<AppointmentRead | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");

  const { from, to } = dayBounds(date);
  const employeeIdFilter = employeeFilter === "all" ? undefined : Number(employeeFilter);
  const status = statusFilter === "all" ? undefined : (statusFilter as AppointmentStatus);
  const { data: appointments, isLoading } = useAppointments({
    employee_id: employeeIdFilter,
    status,
    from,
    to,
  });
  const { data: employees } = useEmployees();
  const { data: services } = useServices();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const availability = useAvailability({
    service_id: serviceId ? Number(serviceId) : undefined,
    date: date || undefined,
    employee_id: employeeId ? Number(employeeId) : undefined,
  });

  const employeeNames = useMemo(
    () => new Map((employees ?? []).map((item) => [item.id, item.name])),
    [employees],
  );
  const serviceNames = useMemo(
    () => new Map((services ?? []).map((item) => [item.id, item.name])),
    [services],
  );

  const sortedAppointments = useMemo(
    () =>
      [...(appointments ?? [])].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      ),
    [appointments],
  );

  const openCreate = () => {
    setEditing(null);
    setClientName("");
    setClientPhone("");
    setServiceId("");
    setEmployeeId("");
    setSlotStart("");
    setSlotEnd("");
    setOpenForm(true);
  };

  const openEdit = (appointment: AppointmentRead) => {
    setEditing(appointment);
    setClientName(appointment.client_name);
    setClientPhone(appointment.client_phone);
    setServiceId(String(appointment.service_id));
    setEmployeeId(String(appointment.employee_id));
    setSlotStart(appointment.start_time);
    setSlotEnd(appointment.end_time);
    setOpenForm(true);
  };

  const save = async () => {
    if (!serviceId || !employeeId || !clientName.trim() || !clientPhone.trim()) return;
    const payload = {
      service_id: Number(serviceId),
      employee_id: Number(employeeId),
      client_name: clientName,
      client_phone: clientPhone,
      start_time: slotStart,
      end_time: slotEnd,
      status: editing?.status ?? "scheduled",
    } as const;

    if (editing) {
      await updateAppointment.mutateAsync({ id: editing.id, payload });
    } else {
      await createAppointment.mutateAsync(payload);
    }
    setOpenForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground">Citas</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/disponibilidad">Disponibilidad</Link>
            </Button>
            <Button onClick={openCreate}>Nueva cita</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Empleada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {(employees ?? []).map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statusOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : sortedAppointments.length ? (
          sortedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              employeeName={employeeNames.get(appointment.employee_id) ?? `#${appointment.employee_id}`}
              serviceName={serviceNames.get(appointment.service_id) ?? `#${appointment.service_id}`}
              actions={
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(appointment)}>
                    Editar
                  </Button>
                  <Select
                    value={appointment.status}
                    onValueChange={(value) =>
                      updateAppointment.mutate({
                        id: appointment.id,
                        payload: { status: value as AppointmentStatus },
                      })
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="destructive" onClick={() => setDeleting(appointment)}>
                    Eliminar
                  </Button>
                </div>
              }
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay citas para los filtros seleccionados.</p>
          </div>
        )}
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar cita" : "Nueva cita"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefono</Label>
              <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona servicio" />
                </SelectTrigger>
                <SelectContent>
                  {(services ?? []).map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Empleada</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona empleada" />
                </SelectTrigger>
                <SelectContent>
                  {(employees ?? []).map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slot (disponibilidad)</Label>
              {availability.data?.slots?.length ? (
                <div className="flex flex-wrap gap-2">
                  {availability.data.slots.map((slot) => {
                    const label = `${new Date(slot.start).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(slot.end).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                    const active = slotStart === slot.start && slotEnd === slot.end;
                    return (
                      <Badge
                        key={`${slot.start}-${slot.end}`}
                        variant={active ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setSlotStart(slot.start);
                          setSlotEnd(slot.end);
                        }}
                      >
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selecciona servicio/fecha para ver disponibilidad.
                </p>
              )}
            </div>
            {!slotStart || !slotEnd ? null : (
              <p className="text-sm text-muted-foreground">
                Seleccionado:{" "}
                {new Date(slotStart).toLocaleString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancelar
            </Button>
            <Button
              disabled={createAppointment.isPending || updateAppointment.isPending || !slotStart}
              onClick={save}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cita</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                await deleteAppointment.mutateAsync(deleting.id);
                setDeleting(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
