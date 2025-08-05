import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'premium' | 'top-rated' | 'category' | 'status' | 'urgency';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ 
  variant = 'category', 
  size = 'md', 
  icon: Icon, 
  children, 
  className = '' 
}: BadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2'
  };

  const variantClasses = {
    premium: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-lg border border-yellow-300',
    'top-rated': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg border border-teal-400',
    category: 'bg-light-cream text-text-secondary border border-gray-200',
    status: 'bg-blue-100 text-blue-800 border border-blue-200',
    urgency: 'bg-red-100 text-red-800 border border-red-200'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn(
      'inline-flex items-center rounded-full font-medium',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {Icon && <Icon className={iconSizes[size]} />}
      <span>{children}</span>
    </div>
  );
};

export default Badge; 