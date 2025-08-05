import React from 'react';

const PostJobInstructions: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto space-y-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-deep-teal mb-3">نشر طلب في 3 خطوات سهلة</h1>
      <p className="text-lg text-text-secondary">احصل على مهمتك من مزودي الخدمات المحليين الموثوقين</p>
    </div>
    
    <div className="relative">
      <div className="absolute right-6 top-6 h-[calc(100%-3rem)] w-1 bg-gradient-to-b from-deep-teal to-soft-teal" />
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">1</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">أعطِ طلبك عنواناً واضحاً</h3>
            <p className="text-text-secondary leading-relaxed">العنوان الواضح والموجز سيجذب المزودين المناسبين ويجعل طلبك يظهر في نتائج البحث.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">2</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">صف طلبك بالتفصيل</h3>
            <p className="text-text-secondary leading-relaxed">قدم أكبر قدر ممكن من المعلومات والحصول على عروض أسعار دقيقة من المزودين المؤهلين.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">3</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">حدد ميزانيتك</h3>
            <p className="text-text-secondary leading-relaxed">حدد ميزانيتك لمساعدة المزودين في تحديد ما إذا كانوا مناسبين لمشروعك.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="space-y-6 pt-8">
      <h2 className="text-center text-2xl font-bold text-deep-teal">معاينة الطلب</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 md:col-span-2">
            <h3 className="text-xl font-bold text-deep-teal mb-3">أحتاج سباك لإصلاح صنبور متسرب</h3>
            <p className="text-text-secondary leading-relaxed">لدي صنبور متسرب في المطبخ يحتاج إلى إصلاح. أبحث عن سباك يمكنه القدوم إلى منزلي وإصلاحه في أقرب وقت ممكن. الموقع: مدينة نصر، القاهرة.</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>💰 الميزانية: 200-300 جنيه</span>
              <span>📅 مطلوب: خلال 24 ساعة</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-deep-teal to-soft-teal flex items-center justify-center min-h-[150px]">
            <span className="text-6xl">🛠️</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PostJobInstructions; 