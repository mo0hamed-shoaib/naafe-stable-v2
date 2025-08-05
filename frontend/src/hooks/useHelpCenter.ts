import { useState, useCallback, useEffect } from 'react';

export type HelpSection = 'Getting Started' | 'Verification' | 'Payments' | 'Platform Rules';

type HelpCenterState = {
  activeSection: HelpSection | undefined;
  searchQuery: string;
};

export const useHelpCenter = (initialSection?: HelpSection) => {
  const [state, setState] = useState<HelpCenterState>({
    activeSection: initialSection,
    searchQuery: ''
  });

  // Update active section when initialSection changes (from URL)
  useEffect(() => {
    if (initialSection !== undefined && initialSection !== state.activeSection) {
      setState(prev => ({ ...prev, activeSection: initialSection }));
    }
  }, [initialSection]);

  const setActiveSection = useCallback((section: HelpSection | undefined) => {
    setState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const getBreadcrumbItems = useCallback(() => {
    const baseItems = [{ label: 'مركز المساعدة', href: '/help' }];
    if (!state.activeSection) return baseItems;
    let sectionLabel = '';
    switch (state.activeSection) {
      case 'Getting Started':
        sectionLabel = 'البداية';
        break;
      case 'Payments':
        sectionLabel = 'المدفوعات';
        break;
      case 'Platform Rules':
        sectionLabel = 'قواعد المنصة';
        break;
      case 'Verification':
        sectionLabel = 'التحقق';
        break;
      default:
        sectionLabel = '';
    }
    return [
      ...baseItems,
      { label: sectionLabel }
    ];
  }, [state.activeSection]);

  const getRelatedArticles = useCallback(() => {
    switch (state.activeSection) {
      case 'Getting Started':
        return [
          {
            title: "كيفية إكمال ملفك الشخصي",
            description: "دليل خطوة بخطوة لإعداد ملفك الشخصي للحصول على أقصى وضوح.",
            href: "/help?section=Verification"
          },
          {
            title: "فهم ميزات منصتنا",
            description: "تعرف على جميع الأدوات والميزات المتاحة لمساعدتك على النجاح.",
            href: "/help?section=Platform Rules"
          }
        ];
      case 'Payments':
        return [
          {
            title: "كيفية سحب أرباحك",
            description: "تعرف على طرق السحب وأوقات المعالجة والرسوم.",
            href: "/help?section=Payments"
          },
          {
            title: "فهم رسوم المعاملات",
            description: "تفصيل شامل لجميع الرسوم المرتبطة بطرق الدفع المختلفة.",
            href: "/help?section=Payments"
          }
        ];
      case 'Platform Rules':
        return [
          {
            title: "كيفية الإبلاغ عن مستخدم",
            description: "دليل خطوة بخطوة للإبلاغ عن الانتهاكات والسلوك غير المناسب.",
            href: "/help?section=Platform Rules"
          },
          {
            title: "عملية الاستئناف لتقييد الحساب",
            description: "تعرف على كيفية استئناف تقييد الحساب وتقديم الأدلة الداعمة.",
            href: "/help?section=Platform Rules"
          }
        ];
      default:
        return [
          {
            title: "ما هي أشكال الهوية المقبولة؟",
            description: "تعرف على أنواع مختلفة من وثائق الهوية التي نقبلها للتحقق.",
            href: "/help?section=Verification"
          },
          {
            title: "لماذا تم رفض التحقق مني؟",
            description: "افهم الأسباب الشائعة لفشل التحقق وكيفية حلها.",
            href: "/help?section=Verification"
          }
        ];
    }
  }, [state.activeSection]);

  return {
    activeSection: state.activeSection,
    searchQuery: state.searchQuery,
    setActiveSection,
    setSearchQuery,
    getBreadcrumbItems,
    getRelatedArticles
  };
}; 