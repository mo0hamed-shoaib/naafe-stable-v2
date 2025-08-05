import React from 'react';

const RespondToJobInstructions: React.FC = () => (
  <div className="w-full max-w-3xl mx-auto space-y-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-deep-teal mb-3">كيف تعمل الطلبات</h1>
      <p className="text-lg text-text-secondary">ملخص مرئي سريع لعملية العمل على نافع</p>
    </div>
    
    <div className="relative">
      <div className="absolute right-6 top-6 h-[calc(100%-3rem)] w-1 bg-gradient-to-b from-deep-teal to-soft-teal" />
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">1</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">ينشر العميل طلب خدمة</h3>
            <p className="text-text-secondary leading-relaxed">يصف العميل الخدمة التي يحتاجها، وتصبح متاحة لمزودي الخدمة المؤهلين مثل نفسك.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">2</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">استجب بعرضك التنافسي</h3>
            <p className="text-text-secondary leading-relaxed">تشاهد طلب الخدمة ويمكنك الرد بعرض تنافسي لخدماتك مع تحديد السعر والتفاصيل.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">3</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">الدردشة والتأكيد</h3>
            <p className="text-text-secondary leading-relaxed">عندما يبدي العميل اهتمامه، يمكنك الدردشة مباشرة لتأكيد التفاصيل وإنهاء الاتفاق.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-deep-teal text-white shadow-lg">
            <span className="font-bold text-lg">4</span>
          </div>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-deep-teal mb-2">استلم أموالك بأمان</h3>
            <p className="text-text-secondary leading-relaxed">بعد إتمام الخدمة وتأكيد العميل، تستلم أموالك بأمان عبر المنصة المضمونة.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 flex items-center">
      <span className="text-green-600 text-2xl ml-3">🔒</span>
      <div>
        <p className="text-base font-semibold text-green-800">حماية خصوصيتك</p>
        <p className="text-sm text-green-700">رقم هاتفك لا يُشارك أبداً. الدردشة تبقى على نافع.</p>
      </div>
    </div>
  </div>
);

export default RespondToJobInstructions; 