import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { AppointmentsView } from './components/AppointmentsView';
import { SummaryView } from './components/SummaryView';
import { Appointment } from './components/AppointmentCard';

// Mock appointment data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'María García',
    time: '09:00',
    service: 'Manicure Semipermanente',
    employee: 'Carmen López',
    isPast: true,
  },
  {
    id: '2',
    clientName: 'Laura Martínez',
    time: '10:00',
    service: 'Uñas Acrílicas',
    employee: 'Ana Rodríguez',
    isPast: true,
  },
  {
    id: '3',
    clientName: 'Sofia Hernández',
    time: '11:30',
    service: 'Manicure Básica',
    employee: 'Carmen López',
    isPast: false,
  },
  {
    id: '4',
    clientName: 'Elena Ruiz',
    time: '13:00',
    service: 'Pedicure Spa',
    employee: 'Ana Rodríguez',
    isPast: false,
  },
  {
    id: '5',
    clientName: 'Isabel Torres',
    time: '14:30',
    service: 'Manicure Semipermanente',
    employee: 'Carmen López',
    isPast: false,
  },
  {
    id: '6',
    clientName: 'Patricia Gómez',
    time: '16:00',
    service: 'Uñas en Gel',
    employee: 'Ana Rodríguez',
    isPast: false,
  },
  {
    id: '7',
    clientName: 'Carmen Silva',
    time: '17:30',
    service: 'Manicure Básica',
    employee: 'Carmen López',
    isPast: false,
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<'appointments' | 'summary'>('appointments');

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <main className="flex-1 overflow-hidden">
        {activeView === 'appointments' ? (
          <AppointmentsView appointments={mockAppointments} />
        ) : (
          <SummaryView appointments={mockAppointments} />
        )}
      </main>
      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
