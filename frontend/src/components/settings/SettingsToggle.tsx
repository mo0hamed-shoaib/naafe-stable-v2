import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
  icon = <Bell size={20} />
}) => {
  return (
    <div className={cn("flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300", className)}>
      <div className="flex items-center gap-4">
        <div className="bg-deep-teal/10 p-3 rounded-full text-deep-teal">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">{label}</h4>
          {description && (
            <p className="text-text-secondary text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {/* Toggle Switch */}
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-deep-teal/50 px-1",
          checked ? 'bg-deep-teal' : 'bg-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={`${checked ? 'إيقاف' : 'تشغيل'} ${label}`}
      >
        {/* Toggle Circle */}
        <div
          className={cn(
            "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300",
            checked ? 'ml-auto' : 'mr-auto'
          )}
        />
      </button>
    </div>
  );
};

export default SettingsToggle; 