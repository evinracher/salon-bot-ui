import { Calendar, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeView: 'citas' | 'resumen';
  onViewChange: (view: 'citas' | 'resumen') => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        <button
          onClick={() => onViewChange('citas')}
          className={`flex-1 flex flex-col items-center gap-1 py-4 transition-colors ${
            activeView === 'citas'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs">Citas</span>
        </button>
        <button
          onClick={() => onViewChange('resumen')}
          className={`flex-1 flex flex-col items-center gap-1 py-4 transition-colors ${
            activeView === 'resumen'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs">Resumen</span>
        </button>
      </div>
    </nav>
  );
}
