import React from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PaymentsContentProps {
  onBack?: () => void;
}

const PaymentsContent: React.FC<PaymentsContentProps> = ({ onBack }) => {
  return (
    <article className="bg-light-cream p-4 lg:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      {onBack && (
        <button
          className="mb-6 px-6 py-2 rounded-full bg-deep-teal text-white font-semibold hover:bg-deep-teal/90 transition-colors duration-300"
          onClick={onBack}
        >
          العودة
        </button>
      )}
      <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">طرق الدفع والأمان</h1>
      <p className="text-text-secondary mb-6">آخر تحديث: منذ 3 ساعات</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          تدعم منصتنا طرق دفع متعددة وآمنة لضمان المعاملات السلسة بين مقدمي الخدمات والعملاء. 
          تتم معالجة جميع المدفوعات من خلال قنوات مشفرة مع إجراءات أمان وفقًا لمعايير الصناعة.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">طرق الدفع المقبولة:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">البطاقات الائتمانية والمدى</h4>
            </div>
            <p className="text-text-secondary mb-3">
              نقبل جميع البطاقات الائتمانية والمدى الرئيسية بما في ذلك فيزا وماستركارد وأمريكان إكسبريس.
            </p>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">معالجة فورية</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">التحويل البنكي</h4>
            </div>
            <p className="text-text-secondary mb-3">
              التحويلات البنكية المباشرة للمعاملات الكبيرة مع رسوم معالجة منخفضة.
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">1-3 أيام عمل</span>
            </div>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">كيفية إضافة طريقة دفع:</h3>
        
        <ol className="list-decimal list-inside space-y-3 mt-4 text-text-primary">
          <li>اذهب إلى <strong>إعدادات الحساب</strong> من قائمة المستخدم</li>
          <li>اختر <strong>طرق الدفع</strong> من الشريط الجانبي</li>
          <li>انقر على <strong>إضافة طريقة دفع جديدة</strong></li>
          <li>اختر نوع الدفع المفضل وأدخل المعلومات المطلوبة</li>
          <li>تحقق من طريقة الدفع من خلال عملية التأكيد</li>
          <li>اضبطها كطريقة دفع افتراضية إذا رغبت</li>
        </ol>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-lg text-green-800">ميزات الأمان</h4>
          </div>
          <ul className="text-green-700 space-y-2">
            <li>• تشفير SSL 256 بت لجميع المعاملات</li>
            <li>• معالجة مدفوعات متوافقة مع PCI DSS</li>
            <li>• المصادقة الثنائية للوصول إلى الحساب</li>
            <li>• كشف الاحتيال والوقاية منه في الوقت الفعلي</li>
            <li>• تشفير آمن لمعلومات الدفع</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-center text-text-secondary font-medium mb-4">هل كان هذا مفيدًا؟</p>
        <div className="flex justify-center gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-green-300 bg-green-50 hover:bg-green-100 hover:scale-105 transition-all duration-300 shadow-sm"
            aria-label="نعم، هذا مفيد"
          >
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">نعم</span>
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 hover:scale-105 transition-all duration-300 shadow-sm"
            aria-label="لا، هذا غير مفيد"
          >
            <ThumbsDown className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-700">لا</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PaymentsContent; 