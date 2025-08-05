import React from 'react';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';

const testimonials = [
  {
    name: "أحمد محمد",
    serviceType: "سباكة",
    rating: 5,
    date: "منذ أسبوع",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "منصة رائعة! حصلت على عملاء جدد وزدت دخلي بشكل كبير. التطبيق سهل الاستخدام والدفع آمن.",
    ratingDetails: {
      quality: 5,
      punctuality: 5,
      communication: 5,
      value: 4
    }
  },
  {
    name: "فاطمة علي",
    serviceType: "تنظيف",
    rating: 5,
    date: "منذ 3 أيام",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    text: "أفضل قرار اتخذته! العملاء راضون والمنصة تدعمني في كل خطوة. أنصح جميع المحترفين بالتسجيل.",
    ratingDetails: {
      quality: 5,
      punctuality: 5,
      communication: 5,
      value: 5
    }
  },
  {
    name: "محمد حسن",
    serviceType: "كهرباء",
    rating: 4,
    date: "منذ يومين",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "منصة موثوقة وآمنة. العملاء يثقون بي أكثر وأحصل على تقييمات ممتازة. شكراً لكم!",
    ratingDetails: {
      quality: 5,
      punctuality: 4,
      communication: 5,
      value: 4
    }
  }
];

const Testimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-current text-accent' : 'text-gray-300'}`} 
      />
    ));
  };

  const renderRatingDetails = (details: {
    communication: number;
    quality: number;
    punctuality: number;
    value: number;
  }) => {
    const labels = {
      communication: 'التواصل',
      quality: 'الجودة',
      punctuality: 'الالتزام بالمواعيد',
      value: 'القيمة مقابل السعر'
    };

    return Object.entries(details).map(([key, value]) => (
      <div key={key} className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{labels[key as keyof typeof labels]}</span>
        <div className="flex gap-1">
          {renderStars(value)}
        </div>
      </div>
    ));
  };

  return (
    <section className="py-16 sm:py-24 bg-white font-arabic text-text-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">ما يقوله الناس</h2>
          <p className="text-lg text-text-secondary mt-2">قصص من مجتمعنا.</p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-warm-cream border-2 border-deep-teal/20 rounded-2xl p-8 flex flex-col h-full items-center text-center mx-auto transition-all duration-300 hover:border-deep-teal/40">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-accent mb-6 shadow-lg" 
              />
              <div className="flex flex-col items-center mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-extrabold text-deep-teal">{testimonial.name}</span>
                  <span className="px-4 py-2 bg-accent/20 text-accent text-sm rounded-full font-semibold">
                    {testimonial.serviceType}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-accent gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-text-secondary font-medium">({testimonial.rating}/5)</span>
                </div>
                <span className="text-sm text-text-secondary font-medium">{testimonial.date}</span>
              </div>
              <p className="text-lg text-text-secondary font-medium leading-relaxed mb-6 flex-1">
                "{testimonial.text}"
              </p>
              {/* Rating Details */}
              <div className="bg-white rounded-xl p-6 border-2 border-deep-teal/10 w-full max-w-xs mx-auto">
                <h4 className="font-bold text-deep-teal mb-4 text-base">تفاصيل التقييم</h4>
                <div className="space-y-1">
                  {renderRatingDetails(testimonial.ratingDetails)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Reviews Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/search?tab=reviews'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-teal text-white rounded-full hover:bg-deep-teal/90 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            شاهد المزيد من المراجعات
            <ThumbsUp className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-warm-cream rounded-xl p-6">
            <div className="text-3xl font-bold text-deep-teal mb-2">10K+</div>
            <div className="text-text-secondary">مراجعة إيجابية</div>
          </div>
          <div className="bg-warm-cream rounded-xl p-6">
            <div className="text-3xl font-bold text-deep-teal mb-2">4.8</div>
            <div className="text-text-secondary">متوسط التقييم</div>
          </div>
          <div className="bg-warm-cream rounded-xl p-6">
            <div className="text-3xl font-bold text-deep-teal mb-2">95%</div>
            <div className="text-text-secondary">عملاء راضون</div>
          </div>
          <div className="bg-warm-cream rounded-xl p-6">
            <div className="text-3xl font-bold text-deep-teal mb-2">24/7</div>
            <div className="text-text-secondary">دعم العملاء</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 