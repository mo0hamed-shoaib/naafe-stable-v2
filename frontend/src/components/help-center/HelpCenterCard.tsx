import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface HelpCenterCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HelpCenterCard: React.FC<HelpCenterCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  className,
  onClick
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-deep-teal/20 group",
        className
      )}
      aria-label={`الانتقال إلى ${title}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-deep-teal/10 rounded-lg flex items-center justify-center group-hover:bg-deep-teal/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-deep-teal" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-deep-teal transition-colors duration-300">
            {title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default HelpCenterCard; 