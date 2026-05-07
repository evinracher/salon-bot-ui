import { Navigate, Route, Routes } from "react-router";
import { Navigation } from "./components/Navigation";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AvailabilityPage } from "./pages/AvailabilityPage";
import { EmployeeServicesPage } from "./pages/EmployeeServicesPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { ServicesPage } from "./pages/ServicesPage";
import { SummaryPage } from "./pages/SummaryPage";

export default function App() {
  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/citas" replace />} />
          <Route path="/citas" element={<AppointmentsPage />} />
          <Route path="/empleadas" element={<EmployeesPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/asignaciones" element={<EmployeeServicesPage />} />
          <Route path="/disponibilidad" element={<AvailabilityPage />} />
          <Route path="/resumen" element={<SummaryPage />} />
        </Routes>
      </main>
      <Navigation />
    </div>
  );
}
