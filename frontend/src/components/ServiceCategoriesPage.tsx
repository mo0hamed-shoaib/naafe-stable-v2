import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import CategoryCard from './CategoryCard';
import { useAuth } from '../contexts/AuthContext';
import { ComponentType } from 'react';
import AdPlacement from './ui/AdPlacement';
import React from 'react';

interface Category {
  _id: string;
  id: string;
  name: string;
  description: string;
  icon: string | ComponentType<{ className?: string }>;
  serviceCount: number;
  avgServicePrice: number;
  numServices: number;
  numRequests: number;
  avgRequestPrice: number;
  startingPrice: number;
}

const ServiceCategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          // Ensure required fields are present with default values
          const validCategories = data.data.categories.map((cat: Partial<Category>) => ({
            _id: cat._id || cat.id || '',
            id: cat.id || cat._id || '',
            name: cat.name || '',
            description: cat.description || '',
            icon: cat.icon || '',
            serviceCount: cat.serviceCount || 0,
            avgServicePrice: cat.avgServicePrice || 0,
            numServices: cat.numServices || 0,
            numRequests: cat.numRequests || 0,
            avgRequestPrice: cat.avgRequestPrice || 0,
            startingPrice: cat.startingPrice || 0
          }));
          setCategories(validCategories);
        } else {
          setCategoriesError('فشل تحميل الفئات');
        }
      })
      .catch(() => setCategoriesError('فشل تحميل الفئات'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '#' },
    { label: 'جميع الخدمات', active: true },
  ];

  const handleCategoryClick = useCallback((category: Category) => {
    navigate(`/search/providers?category=${encodeURIComponent(category.name)}`);
  }, [navigate]);

  const handleSearch = useCallback((query: string) => {
    navigate(`/search/providers?query=${encodeURIComponent(query)}`);
  }, [navigate]);

  return (
    <PageLayout
      title="تصفح جميع الخدمات"
      subtitle="ابحث عن المساعدة التي تحتاجها من محترفينا المحليين الموثوقين."
      breadcrumbItems={breadcrumbItems}
      onSearch={handleSearch}
      user={user}
      onLogout={logout}
    >
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdPlacement location="categories" type="top" />
      </div>

      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-teal mb-4">جميع الفئات</h2>
          <p className="text-lg text-text-secondary">تصفح جميع فئات الخدمات المتاحة على منصتنا</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriesLoading ? (
          <div className="col-span-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : categoriesError ? (
          <div className="col-span-full">
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-lg mb-4">{categoriesError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-red-600 hover:text-red-700 underline text-sm"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : categories.length > 0 ? (
          <>
            {categories.map((category, index) => (
              <React.Fragment key={category._id || category.id || category.name}>
                <CategoryCard
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
                {/* Interstitial Ad every 4 categories */}
                {(index + 1) % 4 === 0 && index < categories.length - 1 && (
                  <div className="col-span-full my-6">
                    <AdPlacement location="categories" type="interstitial" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-text-secondary">لا توجد فئات متاحة حالياً.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Banner Ad */}
      <div className="mt-8">
        <AdPlacement location="categories" type="bottom" />
      </div>
    </PageLayout>
  );
};

export default ServiceCategoriesPage;