import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { CitasView } from './components/CitasView';
import { ResumenView } from './components/ResumenView';
import { Appointment } from './components/AppointmentCard';

// Datos simulados de citas
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clienteName: 'María García',
    hora: '09:00',
    servicio: 'Manicure Semipermanente',
    empleada: 'Carmen López',
    isPast: true,
  },
  {
    id: '2',
    clienteName: 'Laura Martínez',
    hora: '10:00',
    servicio: 'Uñas Acrílicas',
    empleada: 'Ana Rodríguez',
    isPast: true,
  },
  {
    id: '3',
    clienteName: 'Sofia Hernández',
    hora: '11:30',
    servicio: 'Manicure Básica',
    empleada: 'Carmen López',
    isPast: false,
  },
  {
    id: '4',
    clienteName: 'Elena Ruiz',
    hora: '13:00',
    servicio: 'Pedicure Spa',
    empleada: 'Ana Rodríguez',
    isPast: false,
  },
  {
    id: '5',
    clienteName: 'Isabel Torres',
    hora: '14:30',
    servicio: 'Manicure Semipermanente',
    empleada: 'Carmen López',
    isPast: false,
  },
  {
    id: '6',
    clienteName: 'Patricia Gómez',
    hora: '16:00',
    servicio: 'Uñas en Gel',
    empleada: 'Ana Rodríguez',
    isPast: false,
  },
  {
    id: '7',
    clienteName: 'Carmen Silva',
    hora: '17:30',
    servicio: 'Manicure Básica',
    empleada: 'Carmen López',
    isPast: false,
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<'citas' | 'resumen'>('citas');

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <main className="flex-1 overflow-hidden">
        {activeView === 'citas' ? (
          <CitasView appointments={mockAppointments} />
        ) : (
          <ResumenView appointments={mockAppointments} />
        )}
      </main>
      <Navigation activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
