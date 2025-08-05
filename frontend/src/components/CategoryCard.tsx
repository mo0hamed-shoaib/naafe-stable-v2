
import { ServiceCategory } from '../types';
import BaseCard from './ui/BaseCard';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick?: (category: ServiceCategory) => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const { name, description, serviceCount, startingPrice, icon } = category;

  return (
    <BaseCard
      hover
      onClick={() => onClick?.(category)}
      className="bg-light-cream group overflow-hidden"
    >
      {/* Image/Icon Section - Made larger for better image display */}
      <div className="relative h-48 bg-gradient-to-br from-deep-teal/5 to-accent/5 flex items-center justify-center overflow-hidden">
        {typeof icon === 'string' ? (
          <img
            src={icon}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = '/default-category.png'; }}
          />
        ) : icon ? (
          <div className="flex items-center justify-center w-full h-full">
            <icon className="h-24 w-24 text-deep-teal transition-transform group-hover:scale-110" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="h-24 w-24 bg-deep-teal/10 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-deep-teal">{name.charAt(0)}</span>
            </div>
          </div>
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      
      {/* Content Section */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-text-primary group-hover:text-deep-teal transition-colors duration-300">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {description}
          </p>
        )}
        

        
        {/* Starting Price */}
        {startingPrice && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-text-secondary text-center">
              يبدأ من <span className="font-bold text-accent">{startingPrice} جنيه</span>
            </p>
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default CategoryCard;