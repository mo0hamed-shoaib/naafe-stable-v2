import { Shield } from 'lucide-react';

interface TopRatedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TopRatedBadge = ({ className = '', size = 'md' }: TopRatedBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      bg-gradient-to-r from-teal-500 to-teal-600
      text-white shadow-lg border border-teal-400
      ${sizeClasses[size]}
      ${className}
    `}>
      <Shield className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
      <span>الأعلى تقييماً</span>
    </div>
  );
};

export default TopRatedBadge; 