import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types/Profile';

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  ratingDistribution: { [key: number]: number };
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  rating,
  reviewCount,
  reviews,
  ratingDistribution,
}) => {
  const StarRating = ({ rating, size = 'w-5 h-5' }: { rating: number; size?: string }) => {
    return (
      <div className={`flex gap-0.5 text-accent`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${i < rating ? 'fill-current' : 'fill-none'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-base-100 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-neutral mb-6 font-jakarta">Reviews & Ratings</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-5xl font-black text-neutral">{rating}</p>
          <StarRating rating={rating} size="w-6 h-6" />
          <p className="text-neutral/70 text-sm font-medium font-jakarta">
            Based on {reviewCount} reviews
          </p>
        </div>
        
        <div className="grid w-full flex-1 grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <React.Fragment key={stars}>
              <p className="text-neutral/70 text-sm font-medium">{stars}</p>
              <div className="h-2 rounded-full bg-base-200">
                <div
                  className="rounded-full bg-accent h-2 transition-all duration-300"
                  style={{ width: `${ratingDistribution[stars] || 0}%` }}
                />
              </div>
              <p className="text-neutral/70 text-sm font-medium text-right">
                {ratingDistribution[stars] || 0}%
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t border-base-300 pt-8 space-y-8">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${review.avatar})` }}
              />
              <div>
                <p className="font-semibold text-neutral font-jakarta">{review.author}</p>
                <p className="text-neutral/70 text-xs font-jakarta">{review.date}</p>
              </div>
              <div className="ml-auto">
                <StarRating rating={review.rating} />
              </div>
            </div>
            <p className="text-neutral/70 text-sm font-jakarta">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection; 