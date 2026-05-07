import { Calendar, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useAppointments, useEmployees, useServices } from "@/lib/api/hooks";

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  now.setDate(now.getDate() + diff);
  now.setHours(0, 0, 0, 0);
  return now;
}

function endOfWeek(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function SummaryPage() {
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek(weekStart);
  const { data: appointments, isLoading } = useAppointments({
    from: weekStart.toISOString(),
    to: weekEnd.toISOString(),
  });
  const { data: employees } = useEmployees();
  const { data: services } = useServices();

  const serviceName = useMemo(
    () => new Map((services ?? []).map((item) => [item.id, item.name])),
    [services],
  );
  const employeeName = useMemo(
    () => new Map((employees ?? []).map((item) => [item.id, item.name])),
    [employees],
  );

  const totalAppointments = appointments?.length ?? 0;
  const completedAppointments =
    appointments?.filter((a) => a.status === "completed").length ?? 0;
  const pendingAppointments = totalAppointments - completedAppointments;

  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (appointments ?? []).forEach((app) => {
      const label = serviceName.get(app.service_id) ?? `#${app.service_id}`;
      counts[label] = (counts[label] ?? 0) + 1;
    });
    return counts;
  }, [appointments, serviceName]);

  const mostPopularService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

  const employeeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (appointments ?? []).forEach((app) => {
      const label = employeeName.get(app.employee_id) ?? `#${app.employee_id}`;
      counts[label] = (counts[label] ?? 0) + 1;
    });
    return counts;
  }, [appointments, employeeName]);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4">
        <h1 className="text-foreground">Resumen Semanal</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {weekStart.toLocaleDateString("es-ES")} - {weekEnd.toLocaleDateString("es-ES")}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-24">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <div className="text-2xl text-primary mb-1">{totalAppointments}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <div className="text-2xl text-primary mb-1">{completedAppointments}</div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <div className="text-2xl text-primary mb-1">{pendingAppointments}</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </div>

            {mostPopularService && (
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-sm text-foreground">Servicio mas solicitado</h3>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="text-foreground mb-1">{mostPopularService[0]}</div>
                  <div className="text-xs text-muted-foreground">{mostPopularService[1]} citas</div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm text-foreground">Citas por empleada</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(employeeCounts).map(([employee, count]) => (
                  <div key={employee} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{employee}</span>
                    <span className="text-sm text-muted-foreground">{count} citas</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-sm text-foreground">Proximas citas</h3>
              </div>
              <div className="space-y-3">
                {(appointments ?? [])
                  .filter((item) => new Date(item.start_time).getTime() > Date.now())
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <div className="text-sm text-foreground">{appointment.client_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {serviceName.get(appointment.service_id) ?? `#${appointment.service_id}`}
                        </div>
                      </div>
                      <div className="text-sm text-primary">
                        {new Date(appointment.start_time).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                {!appointments?.length && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No hay citas en esta semana
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
