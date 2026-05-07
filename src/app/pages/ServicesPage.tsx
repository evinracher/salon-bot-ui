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
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/lib/api/hooks";
import type { ServiceRead } from "@/lib/api/types";

export function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ServiceRead | null>(null);
  const [deleting, setDeleting] = useState<ServiceRead | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("0");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDuration("60");
    setPrice("0");
    setOpenForm(true);
  };

  const openEdit = (service: ServiceRead) => {
    setEditing(service);
    setName(service.name);
    setDuration(String(service.duration_minutes));
    setPrice(service.price);
    setOpenForm(true);
  };

  const submit = async () => {
    if (!name.trim()) return;
    const payload = {
      name,
      duration_minutes: Number(duration),
      price,
    };
    if (editing) {
      await updateService.mutateAsync({ id: editing.id, payload });
    } else {
      await createService.mutateAsync(payload);
    }
    setOpenForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4 flex items-center justify-between">
        <h1 className="text-foreground">Servicios</h1>
        <Button onClick={openCreate}>Nuevo servicio</Button>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          services?.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-0">
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Duracion: {service.duration_minutes} min
                </p>
                <p className="text-sm text-muted-foreground">Precio: ${service.price}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(service)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleting(service)}
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
            <DialogTitle>{editing ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nombre</Label>
              <Input id="service-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-duration">Duracion (min)</Label>
              <Input
                id="service-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-price">Precio</Label>
              <Input id="service-price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={submit}
              disabled={createService.isPending || updateService.isPending}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                await deleteService.mutateAsync(deleting.id);
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
