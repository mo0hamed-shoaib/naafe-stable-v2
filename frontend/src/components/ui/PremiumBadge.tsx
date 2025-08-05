import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PremiumBadge = ({ className = '', size = 'md' }: PremiumBadgeProps) => {
  const sizeClasses = {
    sm: 'text-sm px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500
      text-white shadow-lg border border-yellow-300
      ${sizeClasses[size]}
      ${className}
    `}>
      <Crown className={`${size === 'md' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
      <span>مميز</span>
    </div>
  );
};

export default PremiumBadge; 