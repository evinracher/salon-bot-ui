import { Clock, User, Sparkles } from 'lucide-react';
import type { ReactNode } from "react";
import type { AppointmentRead } from "@/lib/api/types";

interface AppointmentCardProps {
  appointment: AppointmentRead;
  employeeName: string;
  serviceName: string;
  actions?: ReactNode;
}

export function AppointmentCard({
  appointment,
  employeeName,
  serviceName,
  actions,
}: AppointmentCardProps) {
  const start = new Date(appointment.start_time);
  const end = new Date(appointment.end_time);
  const isPast = end.getTime() < Date.now();
  const time = `${start.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div
      className={`bg-card rounded-lg p-4 border border-border transition-all ${
        isPast ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-foreground mb-1">{appointment.client_name}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{time}</span>
          </div>
        </div>
        {!isPast && (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
            {appointment.status}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-foreground">{serviceName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{employeeName}</span>
        </div>
        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>
    </div>
  );
}
