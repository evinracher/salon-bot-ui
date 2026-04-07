import { Calendar, TrendingUp, Users } from 'lucide-react';
import { Appointment } from './AppointmentCard';

interface SummaryViewProps {
  appointments: Appointment[];
}

export function SummaryView({ appointments }: SummaryViewProps) {
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.isPast).length;
  const pendingAppointments = totalAppointments - completedAppointments;

  const serviceCounts = appointments.reduce((acc, app) => {
    acc[app.service] = (acc[app.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

  const employeeCounts = appointments.reduce((acc, app) => {
    acc[app.employee] = (acc[app.employee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4">
        <h1 className="text-foreground">Resumen Semanal</h1>
        <p className="text-sm text-muted-foreground mt-1">Semana del 7 al 13 de Abril</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-24">
        {/* Main statistics */}
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

        {/* Most popular service */}
        {mostPopularService && (
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-foreground">Servicio más solicitado</h3>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="text-foreground mb-1">{mostPopularService[0]}</div>
              <div className="text-xs text-muted-foreground">
                {mostPopularService[1]} {mostPopularService[1] === 1 ? 'cita' : 'citas'}
              </div>
            </div>
          </div>
        )}

        {/* Distribution by employee */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-sm text-foreground">Citas por empleada</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(employeeCounts).map(([employee, count]) => (
              <div key={employee} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{employee}</span>
                <span className="text-sm text-muted-foreground">
                  {count} {count === 1 ? 'cita' : 'citas'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas citas */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-sm text-foreground">Próximas citas</h3>
          </div>
          <div className="space-y-3">
            {appointments
              .filter(a => !a.isPast)
              .slice(0, 3)
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm text-foreground">{appointment.clientName}</div>
                    <div className="text-xs text-muted-foreground">{appointment.service}</div>
                  </div>
                  <div className="text-sm text-primary">{appointment.time}</div>
                </div>
              ))}
            {appointments.filter(a => !a.isPast).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No hay citas pendientes
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
