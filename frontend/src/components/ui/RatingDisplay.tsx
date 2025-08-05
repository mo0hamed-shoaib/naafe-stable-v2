
import { Star } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

const RatingDisplay = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  className
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={i} 
          className={cn(
            sizeClasses[size],
            'fill-bright-orange text-bright-orange'
          )} 
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <Star 
          key="half" 
          className={cn(
            sizeClasses[size],
            'fill-bright-orange/50 text-bright-orange'
          )} 
        />
      );
    }

    // Empty stars
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className={cn(
            sizeClasses[size],
            'text-gray-300'
          )} 
        />
      );
    }

    return stars;
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {renderStars()}
      {showNumber && (
        <span className="text-sm text-text-secondary ml-1">
          {rating}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay; 