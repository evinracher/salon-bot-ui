import { useState } from "react";
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
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useUpdateEmployee,
} from "@/lib/api/hooks";
import type { EmployeeRead } from "@/lib/api/types";

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<EmployeeRead | null>(null);
  const [deleting, setDeleting] = useState<EmployeeRead | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setPhone("");
    setOpenForm(true);
  };

  const openEdit = (employee: EmployeeRead) => {
    setEditing(employee);
    setName(employee.name);
    setPhone(employee.phone);
    setOpenForm(true);
  };

  const submit = async () => {
    if (!name.trim() || !phone.trim()) return;
    if (editing) {
      await updateEmployee.mutateAsync({ id: editing.id, payload: { name, phone } });
    } else {
      await createEmployee.mutateAsync({ name, phone });
    }
    setOpenForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4 flex items-center justify-between">
        <h1 className="text-foreground">Empleadas</h1>
        <Button onClick={openCreate}>Nueva empleada</Button>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : (
          employees?.map((employee) => (
            <Card key={employee.id}>
              <CardHeader className="pb-0">
                <CardTitle>{employee.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{employee.phone}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(employee)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleting(employee)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar empleada" : "Nueva empleada"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Nombre</Label>
              <Input id="employee-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-phone">Telefono</Label>
              <Input id="employee-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={submit}
              disabled={createEmployee.isPending || updateEmployee.isPending}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar empleada</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                await deleteEmployee.mutateAsync(deleting.id);
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
