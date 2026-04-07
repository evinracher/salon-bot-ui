import { Clock, User, Sparkles } from 'lucide-react';

export interface Appointment {
  id: string;
  clienteName: string;
  hora: string;
  servicio: string;
  empleada: string;
  isPast: boolean;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div
      className={`bg-card rounded-lg p-4 border border-border transition-all ${
        appointment.isPast ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-foreground mb-1">{appointment.clienteName}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{appointment.hora}</span>
          </div>
        </div>
        {!appointment.isPast && (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
            Programada
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-foreground">{appointment.servicio}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{appointment.empleada}</span>
        </div>
      </div>
    </div>
  );
}
