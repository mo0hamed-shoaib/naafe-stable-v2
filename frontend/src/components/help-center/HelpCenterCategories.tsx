import React from 'react';
import { Lightbulb, Shield, CreditCard, Sun, Mail } from 'lucide-react';
import { HelpSection } from '../../hooks/useHelpCenter';
import HelpCenterCard from './HelpCenterCard';

interface HelpCenterCategoriesProps {
  onSectionSelect: (section: HelpSection) => void;
  className?: string;
}

const HelpCenterCategories: React.FC<HelpCenterCategoriesProps> = ({
  onSectionSelect,
  className
}) => {
  const categories = [
    {
      title: 'البداية',
      description: 'دليل شامل للبدء في استخدام منصتنا والاستفادة من جميع الميزات المتاحة',
      icon: Lightbulb,
      section: 'Getting Started' as HelpSection
    },
    {
      title: 'التحقق',
      description: 'تعرف على كيفية التحقق من هويتك وبناء الثقة مع المستخدمين الآخرين',
      icon: Shield,
      section: 'Verification' as HelpSection
    },
    {
      title: 'المدفوعات',
      description: 'طرق الدفع الآمنة وكيفية إدارة المعاملات المالية على المنصة',
      icon: CreditCard,
      section: 'Payments' as HelpSection
    },
    {
      title: 'قواعد المنصة',
      description: 'إرشادات المجتمع والقواعد المهمة لضمان تجربة آمنة وإيجابية',
      icon: Sun,
      section: 'Platform Rules' as HelpSection
    }
  ];

  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
          كيف يمكننا مساعدتك؟
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          اختر الموضوع الذي تريد معرفة المزيد عنه أو استخدم البحث للعثور على إجابات سريعة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCenterCard
            key={category.section}
            title={category.title}
            description={category.description}
            icon={category.icon}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSectionSelect(category.section);
            }}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-text-secondary mb-4">
          لا تجد ما تبحث عنه؟
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="bg-white border border-accent rounded-xl px-6 py-4 flex items-center gap-4 shadow max-w-md w-full">
            <Mail className="w-7 h-7 text-accent" />
            <div className="text-right">
              <div className="font-bold text-deep-teal text-lg mb-1">للتواصل مع الإدارة</div>
              <a href="mailto:mohamed.g.shoaib@gmail.com" className="text-text-secondary text-base break-all underline hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent" tabIndex={0} aria-label="راسل الإدارة عبر البريد الإلكتروني">mohamed.g.shoaib@gmail.com</a>
            </div>
          </div>
          <div className="bg-white border border-accent rounded-xl px-6 py-4 flex items-center gap-4 shadow max-w-md w-full">
            <Mail className="w-7 h-7 text-accent" />
            <div className="text-right">
              <div className="font-bold text-deep-teal text-lg mb-1">للتواصل مع الدعم</div>
              <a href="mailto:support@naafe.com" className="text-text-secondary text-base break-all underline hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent" tabIndex={0} aria-label="راسل الدعم عبر البريد الإلكتروني">support@naafe.com</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenterCategories; 