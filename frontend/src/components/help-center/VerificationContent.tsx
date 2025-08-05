import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VerificationContentProps {
  onBack?: () => void;
}

const VerificationContent: React.FC<VerificationContentProps> = ({ onBack }) => {
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
      <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">كيفية التحقق من الهوية</h1>
      <p className="text-text-secondary mb-6">آخر تحديث: منذ يومين</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          التحقق من هويتك هو خطوة حاسمة لضمان أمان وموثوقية سوقنا. يساعدنا في حماية حسابك من الوصول غير المصرح به وتمكين الميزات التي تتطلب مستوى أعلى من الثقة.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">خطوات التحقق من هويتك:</h3>
        
        <ol className="list-decimal list-inside space-y-3 mt-4 text-text-primary">
          <li>انتقل إلى <strong>إعدادات ملفك الشخصي</strong>.</li>
          <li>انقر على تبويب <strong>التحقق</strong>.</li>
          <li>اتبع التعليمات على الشاشة لرفع صورة واضحة لبطاقة هوية صادرة عن الحكومة (مثل جواز السفر، بطاقة الهوية الوطنية، رخصة القيادة).</li>
          <li>قد يُطلب منك أيضًا التقاط صورة شخصية لمطابقتها مع صورة الهوية.</li>
        </ol>
        
        <p className="mt-6 text-text-primary leading-relaxed">
          سيراجع فريقنا طلبك، والذي يستغرق عادةً من 5 إلى 10 دقائق. ستتلقى إشعارًا عبر البريد الإلكتروني بمجرد اكتمال العملية.
        </p>
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

export default VerificationContent; 