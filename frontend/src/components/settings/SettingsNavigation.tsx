import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface SettingsNavigationProps {
  items: NavigationItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  items,
  activeSection,
  onSectionChange,
  className
}) => {
  return (
    <aside className={cn("w-80 bg-warm-cream/80 backdrop-blur-lg border-r border-white/20 min-h-screen sticky top-0", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-8">الإعدادات</h1>
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-right",
                  isActive
                    ? 'bg-deep-teal text-white shadow-lg transform scale-105'
                    : 'text-text-secondary hover:bg-deep-teal/5 hover:text-deep-teal'
                )}
                aria-label={`الانتقال إلى ${item.label}`}
              >
                <Icon size={20} />
                <div className="flex-1 text-right">
                  <span className="block">{item.label}</span>
                  {item.description && (
                    <span className="text-xs opacity-75 block mt-1">{item.description}</span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SettingsNavigation; 