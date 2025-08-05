

import { serviceCategories } from '../data/categories';

const Footer = () => {
  // Get top categories for footer
  const topCategories = serviceCategories.slice(0, 4);
  
  const footerSections = [
    {
      title: 'الفئات',
      links: [
        ...topCategories.map(category => ({
          label: category.name,
          href: `/search?category=${category.id}`
        })),
        { label: 'جميع الفئات', href: '/search' },
      ],
    },
    {
      title: 'الخدمات',
      links: [
        { label: 'طلب خدمة', href: '/request-service' },
        { label: 'عرض خدمة', href: '/post-service' },
        { label: 'البحث عن خدمات', href: '/search' },
        { label: 'الإعلانات', href: '/advertise' },
      ],
    },
    {
      title: 'الدعم',
      links: [
        { label: 'مركز المساعدة', href: '/help' },
        { label: 'التحقق من الحساب', href: '/help?section=Verification' },
        { label: 'المدفوعات', href: '/help?section=Payments' },
        { label: 'قواعد المنصة', href: '/help?section=Platform Rules' },
      ],
    },
    {
      title: 'الحساب',
      links: [
        { label: 'تسجيل الدخول', href: '/login' },
        { label: 'إنشاء حساب', href: '/register' },
        { label: 'الإعدادات', href: '/settings' },
        { label: 'الملف الشخصي', href: '/profile' },
      ],
    },
  ];

  return (
    <footer className="footer bg-deep-teal text-white p-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <img 
                src="/images/logo-no-bg.png" 
                alt="شعار نافع" 
                className="h-12 w-auto brightness-0 invert"
              />
              <span>نافع</span>
            </div>
            <p className="text-sm text-accent"></p>
            <p className="text-sm text-light-cream">
              نربطك بالخدمات المحلية الموثوقة.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-sm text-light-cream hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="divider"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-light-cream">© 2024 نافع. جميع الحقوق محفوظة.</p>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <a
              href="/help?section=Platform Rules"
              className="text-sm text-light-cream hover:text-white transition-colors"
            >
              الشروط
            </a>
            <a
              href="/help?section=Platform Rules"
              className="text-sm text-light-cream hover:text-white transition-colors"
            >
              الخصوصية
            </a>
            <a
              href="/help"
              className="text-sm text-light-cream hover:text-white transition-colors"
            >
              المساعدة
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;