import { AppointmentCard, Appointment } from './AppointmentCard';

interface CitasViewProps {
  appointments: Appointment[];
}

export function CitasView({ appointments }: CitasViewProps) {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const timeA = a.hora.split(':').map(Number);
    const timeB = b.hora.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card border-b border-border px-5 py-4">
        <h1 className="text-foreground">Citas de Hoy</h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">{today}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-24">
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay citas programadas para hoy</p>
          </div>
        )}
      </div>
    </div>
  );
}
