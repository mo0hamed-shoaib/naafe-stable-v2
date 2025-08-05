import React from 'react';

const PaymentTips: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto space-y-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-deep-teal mb-3">نصائح الدفع الآمن</h1>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto">
        لضمان معاملات آمنة، ادفع دائماً لمزودي الخدمة من خلال تطبيق نافع. هذه الطريقة توفر الحماية والشفافية للطرفين.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
      <h3 className="text-2xl font-bold text-deep-teal text-center">كيفية الدفع بأمان</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center rounded-full bg-deep-teal text-white w-16 h-16 mb-4 shadow-lg">
            <span className="text-2xl">💳</span>
          </div>
          <h4 className="text-lg font-bold text-deep-teal mb-3">أضف وسيلة دفع</h4>
          <p className="text-text-secondary leading-relaxed">أضف بطاقتك البنكية أو خيارات أخرى مدعومة إلى حسابك في نافع.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center rounded-full bg-deep-teal text-white w-16 h-16 mb-4 shadow-lg">
            <span className="text-2xl">📱</span>
          </div>
          <h4 className="text-lg font-bold text-deep-teal mb-3">ادفع عبر التطبيق</h4>
          <p className="text-text-secondary leading-relaxed">بعد إتمام الخدمة، قم بالدفع للمزود مباشرة من خلال التطبيق.</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-center rounded-full bg-deep-teal text-white w-16 h-16 mb-4 shadow-lg">
            <span className="text-2xl">🧾</span>
          </div>
          <h4 className="text-lg font-bold text-deep-teal mb-3">راقب سجل المدفوعات</h4>
          <p className="text-text-secondary leading-relaxed">تابع جميع مدفوعاتك ومعاملاتك داخل التطبيق لإدارة سهلة وآمنة.</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center">
          <span className="text-red-600 text-2xl ml-3">⚠️</span>
          <div>
            <p className="text-base font-semibold text-red-800">تحذير مهم</p>
            <p className="text-sm text-red-700">تجنب الدفع المباشر خارج التطبيق للحفاظ على الأمان والوصول إلى الدعم عند الحاجة.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentTips; 