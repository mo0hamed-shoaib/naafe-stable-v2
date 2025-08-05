import React from 'react';
import { cn } from '../../utils/cn';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn("bg-light-cream rounded-2xl shadow-md p-6 lg:p-8", className)}>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-deep-teal mb-2">{title}</h3>
        {description && (
          <p className="text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default SettingsCard; 