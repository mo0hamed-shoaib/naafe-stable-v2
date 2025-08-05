import BaseCard from '../../../components/ui/BaseCard';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: typeof LucideIcon;
  iconColor?: string;
}

const SummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-soft-teal' 
}: SummaryCardProps) => {
  return (
    <BaseCard className="bg-warm-cream hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-deep-teal">{title}</h3>
        <Icon className={`h-7 w-7 text-deep-teal`} />
      </div>
      <p className="mt-2 text-4xl font-bold text-deep-teal">{value}</p>
    </BaseCard>
  );
};

export default SummaryCard;