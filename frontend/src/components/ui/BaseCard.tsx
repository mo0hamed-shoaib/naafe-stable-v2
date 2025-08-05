
import { cn } from '../../utils/helpers';

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

const BaseCard = ({
  children,
  className,
  onClick,
  hover = false,
  padding = 'md',
  shadow = 'sm'
}: BaseCardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl overflow-hidden transition-all duration-300',
        shadowClasses[shadow],
        hover && 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BaseCard; 