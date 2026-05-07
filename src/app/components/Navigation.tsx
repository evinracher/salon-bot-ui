import { BarChart3, Calendar, Link2, Sparkles, Users } from "lucide-react";
import { NavLink } from "react-router";

const links = [
  { to: "/citas", label: "Citas", icon: Calendar },
  { to: "/empleadas", label: "Empleadas", icon: Users },
  { to: "/servicios", label: "Servicios", icon: Sparkles },
  { to: "/asignaciones", label: "Asign.", icon: Link2 },
  { to: "/resumen", label: "Resumen", icon: BarChart3 },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-4 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
