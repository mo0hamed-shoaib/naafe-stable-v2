import React from 'react';
import { User, Shield, CreditCard, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface GettingStartedContentProps {
  onBack?: () => void;
}

const GettingStartedContent: React.FC<GettingStartedContentProps> = ({ onBack }) => {
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
      <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">دليل البدء</h1>
      <p className="text-text-secondary mb-6">آخر تحديث: منذ يوم</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          مرحبًا بك في منصة نافع! هذا الدليل الشامل سيساعدك على البدء والاستفادة القصوى من تجربتك. 
          اتبع هذه الخطوات لإعداد حسابك والبدء في استخدام خدماتنا.
        </p>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">خطوات الإعداد السريع:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">1. إكمال ملفك الشخصي</h4>
            </div>
            <p className="text-text-secondary">
              أضف معلوماتك الشخصية وصورة شخصية وتفاصيل الاتصال لبناء الثقة مع المستخدمين الآخرين.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">2. التحقق من هويتك</h4>
            </div>
            <p className="text-text-secondary">
              ارفع بطاقة هوية صادرة عن الحكومة لفتح جميع ميزات المنصة وزيادة مصداقيتك.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">3. إعداد المدفوعات</h4>
            </div>
            <p className="text-text-secondary">
              أضف طرق الدفع والمعلومات البنكية للمعاملات السلسة.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">4. البدء في التواصل</h4>
            </div>
            <p className="text-text-secondary">
              تصفح الخدمات، تواصل مع مقدمي الخدمات، وابدأ رحلتك على منصتنا.
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">نصائح مهمة:</h3>
        
        <ul className="list-disc list-inside space-y-3 mt-4 text-text-primary">
          <li>احتفظ بمعلومات ملفك الشخصي محدثة للحصول على وضوح أفضل</li>
          <li>اقرأ قواعد منصتنا لفهم إرشادات المجتمع</li>
          <li>استخدم نظام الرسائل الخاص بنا لجميع الاتصالات</li>
          <li>أبلغ عن أي نشاط مشبوه لفريق الدعم لدينا</li>
          <li>استفد من خدمة العملاء لدينا إذا كنت بحاجة إلى مساعدة</li>
        </ul>
        
        <div className="bg-bright-orange/10 border border-bright-orange/20 rounded-xl p-6 mt-8">
          <h4 className="font-semibold text-lg text-text-primary mb-2">تحتاج مساعدة؟</h4>
          <p className="text-text-secondary">
            فريق الدعم لدينا متاح على مدار الساعة لمساعدتك. استخدم أداة الدردشة في الزاوية اليمنى السفلية 
            أو زر مركز الدعم للحصول على مساعدة فورية.
          </p>
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

export default GettingStartedContent; 