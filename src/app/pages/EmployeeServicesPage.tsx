import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
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
  useCreateEmployeeService,
  useDeleteEmployeeService,
  useEmployeeServices,
  useEmployees,
  useServices,
} from "@/lib/api/hooks";

export function EmployeeServicesPage() {
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [newEmployeeId, setNewEmployeeId] = useState<string>("");
  const [newServiceId, setNewServiceId] = useState<string>("");

  const employeeId = employeeFilter === "all" ? undefined : Number(employeeFilter);
  const serviceId = serviceFilter === "all" ? undefined : Number(serviceFilter);
  const { data: rows, isLoading } = useEmployeeServices({
    employee_id: employeeId,
    service_id: serviceId,
  });
  const { data: employees } = useEmployees();
  const { data: services } = useServices();
  const createEmployeeService = useCreateEmployeeService();
  const deleteEmployeeService = useDeleteEmployeeService();

  const employeeNames = useMemo(
    () => new Map((employees ?? []).map((item) => [item.id, item.name])),
    [employees],
  );
  const serviceNames = useMemo(
    () => new Map((services ?? []).map((item) => [item.id, item.name])),
    [services],
  );

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-foreground">Asignaciones</h1>
          <Button onClick={() => setOpenCreate(true)}>Asignar</Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las empleadas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empleadas</SelectItem>
              {(employees ?? []).map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los servicios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              {(services ?? []).map((service) => (
                <SelectItem key={service.id} value={String(service.id)}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          rows?.map((row) => (
            <Card key={row.id}>
              <CardHeader className="pb-0">
                <CardTitle>{employeeNames.get(row.employee_id) ?? `#${row.employee_id}`}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {serviceNames.get(row.service_id) ?? `#${row.service_id}`}
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteEmployeeService.mutate(row.id)}
                >
                  Quitar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva asignacion</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Empleada</Label>
              <Select value={newEmployeeId} onValueChange={setNewEmployeeId}>
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
              <Label>Servicio</Label>
              <Select value={newServiceId} onValueChange={setNewServiceId}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!newEmployeeId || !newServiceId || createEmployeeService.isPending}
              onClick={async () => {
                await createEmployeeService.mutateAsync({
                  employee_id: Number(newEmployeeId),
                  service_id: Number(newServiceId),
                });
                setNewEmployeeId("");
                setNewServiceId("");
                setOpenCreate(false);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
