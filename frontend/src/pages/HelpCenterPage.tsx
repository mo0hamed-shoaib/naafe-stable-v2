import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  HelpCenterSearch,
  HelpCenterBreadcrumb,
  HelpCenterCategories,
  HelpCenterChat,
  GettingStartedContent,
  VerificationContent,
  PaymentsContent,
  PlatformRulesContent
} from '../components/help-center';
import { useHelpCenter, HelpSection } from '../hooks/useHelpCenter';
import { useAuth } from '../contexts/AuthContext';

const HelpCenterPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get('section') as HelpSection | null;
  const { user } = useAuth();
  
  const {
    activeSection,
    searchQuery,
    setActiveSection,
    setSearchQuery,
    getBreadcrumbItems
  } = useHelpCenter(sectionParam || undefined);

  // Sync URL with active section when it changes
  useEffect(() => {
    if (activeSection && sectionParam !== activeSection) {
      setSearchParams({ section: activeSection });
    }
    if (!activeSection && sectionParam) {
      setSearchParams({});
    }
  }, [activeSection, sectionParam, setSearchParams]);

  // Determine support email based on user role
  const supportEmail = user?.roles?.includes('admin')
    ? 'للتواصل مع الإدارة: mohamed.g.shoaib@gmail.com'
    : 'للتواصل مع الدعم: support@naafe.com';

  // Fix: always open content on card click, even if already on that section
  const handleSectionSelect = (section: HelpSection) => {
    setActiveSection(section);
  };

  const handleBack = () => setActiveSection(undefined as HelpSection | undefined);

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="min-h-screen flex flex-col bg-warm-cream" dir="rtl">
      <Header />
      
      <main className="pt-20 flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex-1 max-w-lg">
                <HelpCenterSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="البحث في مركز المساعدة..."
                />
              </div>
              
            </div>
            
            <HelpCenterBreadcrumb items={breadcrumbItems} />
          </header>

          {/* Content */}
          {!activeSection && searchQuery === '' ? (
            <HelpCenterCategories 
              onSectionSelect={handleSectionSelect} 
            />
          ) : (
            <>
              {activeSection === 'Getting Started' && (
                <GettingStartedContent onBack={handleBack} />
              )}
              {activeSection === 'Verification' && (
                <VerificationContent onBack={handleBack} />
              )}
              {activeSection === 'Payments' && (
                <PaymentsContent onBack={handleBack} />
              )}
              {activeSection === 'Platform Rules' && (
                <PlatformRulesContent onBack={handleBack} />
              )}
            </>
          )}
        </div>
      </main>
      
      <HelpCenterChat />
      <Footer />
    </div>
  );
};

export default HelpCenterPage; 