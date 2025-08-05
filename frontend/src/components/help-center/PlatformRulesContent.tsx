import React from 'react';
import { Users, Shield, MessageSquare, Star, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PlatformRulesContentProps {
  onBack?: () => void;
}

const PlatformRulesContent: React.FC<PlatformRulesContentProps> = ({ onBack }) => {
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
      <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">قواعد المنصة والإرشادات</h1>
      <p className="text-text-secondary mb-6">آخر تحديث: منذ أسبوع</p>
      
      <div className="prose max-w-none text-text-primary">
        <p className="mb-6 leading-relaxed">
          تزدهر منصتنا على الثقة والاحترام والاحترافية. تضمن هذه القواعد تجربة آمنة وإيجابية لجميع المستخدمين. 
          باستخدام منصتنا، توافق على اتباع هذه الإرشادات والمساعدة في الحفاظ على معايير مجتمعنا.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h4 className="font-semibold text-lg text-red-800">إشعار مهم</h4>
          </div>
          <p className="text-red-700">
            قد تؤدي مخالفة هذه القواعد إلى تعليق الحساب أو الحظر الدائم من المنصة. 
            يرجى القراءة بعناية وضمان الامتثال في جميع الأوقات.
          </p>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">إرشادات المجتمع الأساسية:</h3>
        
        <div className="space-y-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">الاحترام والاحترافية</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• عامل جميع المستخدمين باحترام وأدب</li>
              <li>• استخدم لغة احترافية في جميع الاتصالات</li>
              <li>• لا مضايقة أو تمييز أو خطاب كراهية</li>
              <li>• احترم الاختلافات الثقافية والدينية</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">أمان الحساب</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• حساب واحد لكل شخص - لا حسابات مكررة</li>
              <li>• قدم معلومات دقيقة وصحيحة</li>
              <li>• احتفظ ببيانات تسجيل الدخول آمنة</li>
              <li>• أبلغ عن النشاط المشبوه فورًا</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">معايير الاتصال</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• استخدم نظام الرسائل الخاص بالمنصة لجميع الاتصالات</li>
              <li>• لا تشارك معلومات الاتصال الشخصية علنًا</li>
              <li>• رد على الرسائل خلال 24 ساعة عندما يكون ذلك ممكنًا</li>
              <li>• لا رسائل غير مرغوب فيها أو محتوى ترويجي</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-deep-teal/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-deep-teal" />
              </div>
              <h4 className="font-semibold text-lg">جودة الخدمة</h4>
            </div>
            <ul className="text-text-secondary space-y-2">
              <li>• قدم الخدمات كما هو موصوف ومتفق عليه</li>
              <li>• التزم بالمواعيد النهائية وتواصل أي تأخير فورًا</li>
              <li>• قدم تعليقات صادقة وبناءة</li>
              <li>• لا مراجعات مزيفة أو تلاعب في التقييمات</li>
            </ul>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">الأنشطة المحظورة:</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
          <ul className="text-red-700 space-y-3">
            <li>• <strong>الاحتيال أو الخداع:</strong> أي محاولة لخداع أو احتيال المستخدمين الآخرين</li>
            <li>• <strong>الأنشطة غير القانونية:</strong> استخدام المنصة لأي أغراض غير قانونية</li>
            <li>• <strong>انتهاك الملكية الفكرية:</strong> استخدام مواد محمية بحقوق النشر دون إذن</li>
            <li>• <strong>المعاملات خارج المنصة:</strong> إجراء أعمال خارج نظام الدفع الآمن لدينا</li>
            <li>• <strong>تلاعب الحساب:</strong> إنشاء حسابات مزيفة أو التلاعب في التقييمات</li>
            <li>• <strong>محتوى غير مناسب:</strong> مشاركة محتوى مسيء أو صريح أو ضار</li>
          </ul>
        </div>
        
        <h3 className="font-semibold text-xl mt-8 mb-4 text-text-primary">أفضل الممارسات:</h3>
        
        <ul className="list-disc list-inside space-y-3 mt-4 text-text-primary">
          <li>أكمل ملفك الشخصي بمعلومات دقيقة وصورة احترافية</li>
          <li>تحقق من هويتك لبناء الثقة مع المستخدمين الآخرين</li>
          <li>حافظ على معدل استجابة عالي وجودة خدمة عالية</li>
          <li>استخدم أوصاف خدمات واضحة ومفصلة وأسعار عادلة</li>
          <li>تواصل بصراحة وأمانة مع العملاء ومقدمي الخدمات</li>
          <li>اترك تعليقات بناءة لمساعدة تحسين المجتمع</li>
        </ul>
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

export default PlatformRulesContent; 