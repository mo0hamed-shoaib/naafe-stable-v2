import React from 'react';

const TrustTips: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto space-y-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-deep-teal mb-3">نصائح الأمان والثقة</h1>
      <p className="text-lg text-text-secondary">تعرف على كيفية بناء الثقة والحفاظ على الأمان على المنصة</p>
    </div>

    {/* Combined Tips Section */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">دردشة آمنة</h3>
        <p className="text-text-secondary leading-relaxed">تواصل مباشرة وبأمان عبر التطبيق. إبقاء المحادثات على نافع يحمي معلوماتك الشخصية.</p>
      </div>

      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">✔️</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">مستخدمون موثوقون</h3>
        <p className="text-text-secondary leading-relaxed">ابحث عن شارة التحقق في الملفات الشخصية. هذا يعني أن المزود أكمل عملية التحقق لدينا.</p>
      </div>

      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">الحصول على التحقق</h3>
        <p className="text-text-secondary leading-relaxed">احصل على شارة التحقق بتأكيد هويتك. هذه الخطوة تعزز ثقة العملاء بك بشكل كبير.</p>
      </div>

      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">أكمل ملفك الشخصي</h3>
        <p className="text-text-secondary leading-relaxed">املأ جميع أقسام ملفك الشخصي. أضف نماذج من أعمالك لعرض مهاراتك.</p>
      </div>

      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">🌟</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">احصل على تقييمات</h3>
        <p className="text-text-secondary leading-relaxed">التقييمات الإيجابية دليل اجتماعي على جودة عملك. شجع العملاء الراضين على ترك تقييمات.</p>
      </div>

      <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-deep-teal text-white shadow-lg mb-4">
          <span className="text-2xl">🤝</span>
        </div>
        <h3 className="text-xl font-bold text-deep-teal mb-3">حل النزاعات</h3>
        <p className="text-text-secondary leading-relaxed">إذا ظهرت أي مشاكل، فريق الدعم لدينا جاهز للوساطة. نضمن حلولاً عادلة للجميع.</p>
      </div>
    </div>

    <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-center">
        <span className="text-blue-600 text-2xl ml-3">💡</span>
        <div>
          <p className="text-base font-semibold text-blue-800">نصيحة مهمة</p>
          <p className="text-sm text-blue-700">كلما كان ملفك أكثر اكتمالاً، زادت فرصك في الحصول على عروض وبناء الثقة مع العملاء!</p>
        </div>
      </div>
    </div>
  </div>
);

export default TrustTips; 