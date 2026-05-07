import { useMemo, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
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
import { useAvailability, useEmployees, useServices } from "@/lib/api/hooks";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function AvailabilityPage() {
  const { data: services } = useServices();
  const { data: employees } = useEmployees();
  const [serviceId, setServiceId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("all");
  const [date, setDate] = useState<string>(todayIsoDate());
  const [duration, setDuration] = useState<string>("");

  const params = useMemo(
    () => ({
      service_id: serviceId ? Number(serviceId) : undefined,
      date,
      employee_id: employeeId === "all" ? undefined : Number(employeeId),
      duration_minutes: duration ? Number(duration) : undefined,
    }),
    [serviceId, employeeId, date, duration],
  );
  const { data, isLoading } = useAvailability(params);

  const employeeNames = useMemo(
    () => new Map((employees ?? []).map((item) => [item.id, item.name])),
    [employees],
  );

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4 space-y-3">
        <h1 className="text-foreground">Disponibilidad</h1>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Duracion (min)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Empleada (opcional)</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquiera</SelectItem>
              {(employees ?? []).map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : data ? (
          data.slots.length ? (
            data.slots.map((slot) => (
              <Card key={`${slot.start}-${slot.end}`}>
                <CardHeader className="pb-0">
                  <CardTitle>
                    {new Date(slot.start).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(slot.end).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {slot.employee_ids.map((id) => (
                    <Badge key={id} variant="outline">
                      {employeeNames.get(id) ?? `Empleado #${id}`}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No hay slots disponibles para ese filtro.</p>
          )
        ) : (
          <p className="text-muted-foreground text-sm">Selecciona servicio y fecha para consultar.</p>
        )}
      </div>
    </div>
  );
}
