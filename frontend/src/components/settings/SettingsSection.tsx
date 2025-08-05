import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className
}) => {
  return (
    <section className={cn("space-y-8", className)}>
      <div>
        <h2 className="text-3xl lg:text-4xl font-semibold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary text-lg">{description}</p>
      </div>
      {children}
    </section>
  );
};

export default SettingsSection; 