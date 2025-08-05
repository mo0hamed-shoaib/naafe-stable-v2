import React, { useState, useEffect } from 'react';
import { Star, Grid3X3, X, CheckCircle, TrendingUp, Target, Upload, MapPin, Users } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput, FormTextarea } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { adPlacements, getPlacementByLocation } from '../data/adPlacements';

// Ad plan data structure
const adPlans = [
  {
    id: 'featured',
    icon: Star,
    title: 'إعلان مميز بالأعلى',
    description: 'الظهور في أعلى نتائج البحث لضمان أقصى مشاهدة.',
    pricing: {
      daily: 35,
      weekly: 200,
      monthly: 750
    }
  },
  {
    id: 'sidebar',
    icon: Grid3X3,
    title: 'إعلان بالمنتصف',
    description: 'يظهر بين مجموعة من البطاقات في المنتصف.',
    pricing: {
      daily: 25,
      weekly: 150,
      monthly: 500
    }
  },
  {
    id: 'banner',
    icon: Grid3X3,
    title: 'إعلان بالأسفل',
    description: 'اعرض خدمتك في البانر الإعلاني أسفل الصفحة.',
    pricing: {
      daily: 15,
      weekly: 90,
      monthly: 300
    }
  }
];

// FAQ data structure
const faqData = [
  {
    id: 1,
    question: 'هل يمكنني تعديل إعلاني بعد نشره؟',
    answer: 'نعم، يمكنك تعديل محتوى إعلانك في أي وقت من خلال لوحة التحكم الخاصة بك.'
  },
  {
    id: 2,
    question: 'كيف يمكنني تتبع أداء إعلاني؟',
    answer: 'نوفر لك إحصائيات مفصلة تشمل عدد المشاهدات والنقرات على إعلانك.'
  },
  {
    id: 3,
    question: 'هل هناك أي عقود طويلة الأمد؟',
    answer: 'لا، جميع خططنا مرنة ويمكنك إيقافها أو تجديدها حسب رغبتك.'
  },
  {
    id: 4,
    question: 'كيف يتم الاستهداف الجغرافي؟',
    answer: 'يمكنك تحديد المناطق التي تريد الوصول إليها، وسيظهر إعلانك للمستخدمين في تلك المناطق.'
  }
];

// Payment steps data
const paymentSteps = [
  {
    step: 1,
    title: 'اختر الخطة',
    description: 'حدد نوع الإعلان والمدة التي تناسبك.'
  },
  {
    step: 2,
    title: 'أكمل الدفع',
    description: 'ادفع بأمان باستخدام Stripe.'
  },
  {
    step: 3,
    title: 'تم التفعيل!',
    description: 'يبدأ إعلانك في الظهور فورًا.'
  }
];

const AdvertisePage: React.FC = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const [adFormData, setAdFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    location: '',
    type: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imageUploading, setImageUploading] = useState(false);

  // Handle pre-selected placement from navigation
  useEffect(() => {
    if (location.state?.selectedPlacement) {
      const placement = adPlacements.find(p => p.id === location.state.selectedPlacement);
      if (placement) {
        setSelectedPlacement(placement.id);
        setAdFormData(prev => ({
          ...prev,
          location: placement.location,
          type: placement.type
        }));
        setShowAdForm(true);
      }
    }
  }, [location.state]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowAdForm(true);
    // Clear form errors when opening new form
    setFormErrors({});
  };

  // Validation functions
  const validateTitle = (title: string): string => {
    if (!title.trim()) {
      return 'عنوان الإعلان مطلوب';
    }
    if (title.trim().length < 5) {
      return 'عنوان الإعلان يجب أن يكون 5 أحرف على الأقل';
    }
    if (title.trim().length > 100) {
      return 'عنوان الإعلان يجب أن يكون أقل من 100 حرف';
    }
    // Check for invalid special characters (only allow Arabic, English, numbers, spaces, and basic punctuation)
    const validPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\-_.,!?()]+$/;
    if (!validPattern.test(title.trim())) {
      return 'عنوان الإعلان يحتوي على رموز غير مسموحة';
    }
    return '';
  };

  const validateDescription = (description: string): string => {
    if (!description.trim()) {
      return 'وصف الإعلان مطلوب';
    }
    if (description.trim().length < 10) {
      return 'وصف الإعلان يجب أن يكون 10 أحرف على الأقل';
    }
    if (description.trim().length > 300) {
      return 'وصف الإعلان يجب أن يكون أقل من 300 حرف';
    }
    // Check for invalid special characters
    const validPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\-_.,!?()\n\r]+$/;
    if (!validPattern.test(description.trim())) {
      return 'وصف الإعلان يحتوي على رموز غير مسموحة';
    }
    return '';
  };

  const validateTargetUrl = (url: string): string => {
    if (url && url.trim()) {
      try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          return 'الرابط يجب أن يبدأ بـ http:// أو https://';
        }
      } catch {
        return 'الرابط غير صحيح';
      }
    }
    return '';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    const titleError = validateTitle(adFormData.title);
    if (titleError) errors.title = titleError;
    
    const descriptionError = validateDescription(adFormData.description);
    if (descriptionError) errors.description = descriptionError;
    
    const targetUrlError = validateTargetUrl(adFormData.targetUrl);
    if (targetUrlError) errors.targetUrl = targetUrlError;
    
    if (!adFormData.location || !adFormData.type) {
      errors.placement = 'يرجى اختيار موقع الإعلان';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('يرجى اختيار ملف صورة صحيح');
      }

      const formData = new FormData();
      formData.append('image', file);

      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!imgbbApiKey) {
        // Fallback: use a placeholder image
        setAdFormData(prev => ({ 
          ...prev, 
          imageUrl: 'https://via.placeholder.com/300x200/2D5D4F/FFFFFF?text=صورة+الإعلان' 
        }));
        console.log('ImgBB key not available, using placeholder image');
        return;
      }

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`خطأ في الخادم: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAdFormData(prev => ({ ...prev, imageUrl: data.data.url }));
        console.log('Image uploaded successfully:', data.data.url);
      } else {
        throw new Error(data.error?.message || 'فشل في رفع الصورة');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setImageUploading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan || !accessToken) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    // Validate form data
    if (!validateForm()) {
      // Show first error message
      const firstError = Object.values(formErrors)[0];
      if (firstError) {
        alert(firstError);
      }
      return;
    }

    try {
      // Get placement configuration
      const placement = selectedPlacement ? 
        adPlacements.find(p => p.id === selectedPlacement) : 
        getPlacementByLocation(adFormData.location, adFormData.type);

      if (!placement) {
        alert('يرجى اختيار موقع الإعلان');
        return;
      }

      // Create the ad with form data
      const adData = {
        type: selectedPlan,
        title: adFormData.title,
        description: adFormData.description,
        imageUrl: adFormData.imageUrl || 'https://via.placeholder.com/300x200',
        targetUrl: adFormData.targetUrl || 'https://example.com', // Changed from '/categories' to a proper external URL
        duration: selectedDuration,
        placement: {
          id: placement.id,
          location: placement.location,
          type: placement.type
        },
        targeting: {
          locations: [placement.location],
          categories: [],
          keywords: []
        }
      };

      const createResponse = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(adData),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error?.message || 'فشل في إنشاء الإعلان');
      }

      // Then create checkout session
      const checkoutResponse = await fetch(`/api/ads/${createData.data._id}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.success && checkoutData.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutData.data.url;
      } else {
        throw new Error(checkoutData.error?.message || 'فشل في إنشاء جلسة الدفع');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('حدث خطأ أثناء إنشاء الإعلان. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <PageLayout
      title="روّج خدمتك، ووصل لأكبر عدد من المستخدمين"
      subtitle="الإعلانات المميزة تضمن لك الظهور الأول في نتائج البحث، وزيادة فرصك في الحصول على عملاء جدد"
      breadcrumbItems={[
        { label: 'الرئيسية', href: '/' },
        { label: 'أعلن معنا', active: true }
      ]}
      showHeader
      showFooter
      showBreadcrumb
      className="font-cairo"
    >
      <div dir="rtl" className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-deep-teal/10 px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-deep-teal" />
            <span className="text-sm font-semibold text-deep-teal">
              الإعلانات المميزة
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-teal mb-6">
            روّج خدمتك، ووصل
            <span className="block text-accent">لأكبر عدد من المستخدمين</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
            الإعلانات المميزة تضمن لك الظهور الأول في نتائج البحث، وزيادة فرصك في الحصول على عملاء جدد
          </p>
        </section>

        {/* Ad Plan Cards Section */}
        <section id="plans" className="mb-16">
          <h2 className="text-3xl font-bold text-deep-teal text-center mb-12">
            اختر الخطة الإعلانية الأنسب لك
          </h2>
          
          {/* Duration Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <div className="flex">
                {(['daily', 'weekly', 'monthly'] as const).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      selectedDuration === duration
                        ? 'bg-deep-teal text-white'
                        : 'text-text-secondary hover:text-deep-teal'
                    }`}
                  >
                    {duration === 'daily' ? 'يومي' : duration === 'weekly' ? 'أسبوعي' : 'شهري'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {adPlans.map((plan) => {
              const IconComponent = plan.icon;
              const price = plan.pricing[selectedDuration];
              return (
                <BaseCard
                  key={plan.id}
                  className={`relative p-8 transition-all duration-300 hover:scale-105 flex flex-col h-full ${
                    selectedPlan === plan.id ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-deep-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-deep-teal" />
                    </div>
                    <h3 className="text-2xl font-bold text-deep-teal mb-2">{plan.title}</h3>
                    <p className="text-text-secondary">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6 flex-grow">
                    <div className="text-3xl font-bold text-deep-teal mb-2">
                      {price} جنيه
                    </div>
                    <div className="text-sm text-text-secondary">
                      {selectedDuration === 'daily' ? 'يومياً' : selectedDuration === 'weekly' ? 'أسبوعياً' : 'شهرياً'}
                    </div>
                  </div>

                  <Button
                    variant={selectedPlan === plan.id ? "primary" : "outline"}
                    size="lg"
                    className="w-full mt-auto"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'محدد' : 'اشتر الآن'}
                  </Button>
                </BaseCard>
              );
            })}
          </div>
        </section>

        {/* Ad Placement Preview Section */}
        <section className="bg-light-cream rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-deep-teal text-center mb-12">
            شاهد كيف ستبدو إعلاناتك على الموقع
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Ad Preview */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col h-full">
              <h3 className="font-bold text-deep-teal mb-4 text-center">إعلان مميز</h3>
              <div className="relative flex-grow">
                {/* Website Header Mockup */}
                <div className="bg-deep-teal text-white p-3 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white rounded"></div>
                      <span className="font-bold">نافع</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                      <div className="w-4 h-4 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Featured Ad Banner */}
                <div className="bg-gradient-to-r from-accent to-deep-teal p-4 text-white text-center relative">
                  <div className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded text-xs">
                    إعلان مميز
                  </div>
                  <div className="text-sm font-bold">تصميم شعار احترافي</div>
                  <div className="text-xs opacity-90">يبدأ من 50 جنيه</div>
                </div>
                
                {/* Website Content Mockup */}
                <div className="bg-gray-50 p-4 rounded-b-lg">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-text-secondary mt-auto">
                يظهر في أعلى نتائج البحث
              </p>
            </div>

            {/* Middle Ad Preview */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col h-full">
              <h3 className="font-bold text-deep-teal mb-4 text-center">إعلان بالمنتصف</h3>
              <div className="relative flex-grow">
                {/* Website Content Mockup */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    {/* First card */}
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    
                    {/* Second card */}
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    
                    {/* Ad Banner in Middle */}
                    <div className="bg-gradient-to-r from-deep-teal to-accent p-3 rounded-lg text-white text-center relative">
                      <div className="absolute top-1 right-1 bg-white/20 px-2 py-1 rounded text-xs">
                        إعلان
                      </div>
                      <div className="text-sm font-bold">تصميم احترافي</div>
                      <div className="text-xs opacity-90">يبدأ من 25 جنيه</div>
                    </div>
                    
                    {/* Third card */}
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    
                    {/* Fourth card */}
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-text-secondary mt-auto">
                يظهر بين مجموعة من البطاقات في المنتصف
              </p>
            </div>

            {/* Banner Ad Preview */}
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col h-full">
              <h3 className="font-bold text-deep-teal mb-4 text-center">إعلان بالأسفل</h3>
              <div className="relative flex-grow">
                {/* Website Content Mockup */}
                <div className="bg-gray-50 p-4 rounded-t-lg">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                
                {/* Banner Ad */}
                <div className="bg-gradient-to-r from-deep-teal to-accent p-4 text-white text-center relative">
                  <div className="absolute top-2 left-2 bg-white/20 px-2 py-1 rounded text-xs">
                     بالأسفل
                  </div>
                  <div className="text-sm font-bold"> تصميم احترافي</div>
                  <div className="text-xs opacity-90">احصل على عرض خاص اليوم</div>
                </div>
                
                {/* Website Footer Mockup */}
                <div className="bg-deep-teal text-white p-3 rounded-b-lg">
                  <div className="flex justify-center gap-4 text-sm">
                    <span>الرئيسية</span>
                    <span>الخدمات</span>
                    <span>تواصل معنا</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-text-secondary mt-auto">
                يظهر أسفل الصفحة
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
              <h4 className="text-lg font-bold text-deep-teal mb-3">
                لماذا هذه المواقع مثالية لإعلاناتك؟
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="font-semibold text-deep-teal">ظهور عالي</div>
                  <div className="text-text-secondary">أول ما يراه الزوار</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-semibold text-deep-teal">استهداف دقيق</div>
                  <div className="text-text-secondary">للعملاء المهتمين</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="font-semibold text-deep-teal">نتائج مضمونة</div>
                  <div className="text-text-secondary">زيادة في المبيعات</div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Payment Steps Section */}
        <section className="bg-light-cream rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-deep-teal mb-4">
              الدفع والتفعيل في 3 خطوات بسيطة
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            {paymentSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-deep-teal mb-2">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Refund Policy Section */}
        <section className="bg-white rounded-2xl p-8 mb-16 shadow-md">
          <h2 className="text-2xl font-bold text-deep-teal text-center mb-8">سياسة الاسترداد</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-teal mb-1">استرداد كامل خلال 24 ساعة</h3>
                    <p className="text-text-secondary text-sm">يمكنك إلغاء إعلانك واسترداد المبلغ كاملاً خلال 24 ساعة من بدء الإعلان</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-teal mb-1">إلغاء في أي وقت</h3>
                    <p className="text-text-secondary text-sm">يمكنك إيقاف إعلانك في أي وقت من لوحة التحكم الخاصة بك</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-teal mb-1">استرداد جزئي</h3>
                    <p className="text-text-secondary text-sm">بعد 24 ساعة، يتم استرداد المبلغ المتبقي من المدة المتبقية</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-teal mb-1">دعم مخصص</h3>
                    <p className="text-text-secondary text-sm">فريق الدعم متاح لمساعدتك في أي استفسارات حول الاسترداد</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-deep-teal/10 rounded-lg border border-deep-teal/20">
              <h4 className="font-bold text-deep-teal mb-2">ملاحظة مهمة:</h4>
              <p className="text-text-secondary text-sm">
                يتم احتساب المدة المستخدمة من وقت بدء الإعلان. في حالة الإلغاء المبكر، 
                يتم استرداد المبلغ المتبقي تلقائياً.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section - Unified with Pricing Page */}
        <section className="bg-light-cream rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-deep-teal text-center mb-8">الأسئلة الشائعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqData.map((faq) => (
              <BaseCard key={faq.id} className="p-6">
                <h3 className="font-bold text-deep-teal mb-2 text-lg">{faq.question}</h3>
                <p className="text-text-primary text-sm">{faq.answer}</p>
              </BaseCard>
            ))}
          </div>
        </section>

        {/* Contact Section removed */}
      </div>

      {/* Ad Form Modal */}
      {showAdForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-deep-teal">إنشاء إعلان جديد</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAdForm(false);
                  setFormErrors({});
                }}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5 text-deep-teal" />
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <FormInput
                  label="عنوان الإعلان *"
                  value={adFormData.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setAdFormData(prev => ({ ...prev, title: newTitle }));
                    // Clear error when user starts typing
                    if (formErrors.title) {
                      setFormErrors(prev => ({ ...prev, title: '' }));
                    }
                  }}
                  onBlur={() => {
                    const error = validateTitle(adFormData.title);
                    setFormErrors(prev => ({ ...prev, title: error }));
                  }}
                  placeholder="أدخل عنوان الإعلان (5-100 حرف)"
                  required
                  error={formErrors.title}
                />
                
                <FormTextarea
                  label="وصف الإعلان *"
                  value={adFormData.description}
                  onChange={(e) => {
                    const newDescription = e.target.value;
                    setAdFormData(prev => ({ ...prev, description: newDescription }));
                    // Clear error when user starts typing
                    if (formErrors.description) {
                      setFormErrors(prev => ({ ...prev, description: '' }));
                    }
                  }}
                  onBlur={() => {
                    const error = validateDescription(adFormData.description);
                    setFormErrors(prev => ({ ...prev, description: error }));
                  }}
                  placeholder="أدخل وصف الإعلان (10-300 حرف)"
                  rows={3}
                  required
                  error={formErrors.description}
                />

                {/* Placement Selection */}
                <div>
                  <label className="block text-base font-semibold text-deep-teal mb-3">
                    موقع الإعلان *
                  </label>
                  {formErrors.placement && (
                    <div className="text-red-600 text-sm mb-2">{formErrors.placement}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adPlacements.map((placement) => (
                      <div
                        key={placement.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          adFormData.location === placement.location && adFormData.type === placement.type
                            ? 'border-deep-teal bg-deep-teal/10'
                            : 'border-gray-300 hover:border-deep-teal/50 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setAdFormData(prev => ({
                            ...prev,
                            location: placement.location,
                            type: placement.type
                          }));
                          // Clear placement error when user selects a placement
                          if (formErrors.placement) {
                            setFormErrors(prev => ({ ...prev, placement: '' }));
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-deep-teal" />
                          <span className="font-bold text-base text-deep-teal">{placement.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-deep-teal/80">
                          <span>يبدأ من {placement.pricing[selectedDuration]} جنيه</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {placement.maxAds} إعلان
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-base font-semibold text-deep-teal mb-3">
                    صورة الإعلان
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-deep-teal transition-colors">
                    {adFormData.imageUrl ? (
                      <div className="space-y-3">
                        <img 
                          src={adFormData.imageUrl} 
                          alt="Ad preview" 
                          className="w-full h-32 object-cover rounded-lg mx-auto"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: '' }))}
                          className="text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white"
                        >
                          تغيير الصورة
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-10 h-10 text-deep-teal/60 mx-auto mb-3" />
                        <p className="text-base text-deep-teal/80 mb-3 font-medium">
                          {imageUploading ? 'جاري رفع الصورة...' : 'اضغط لرفع صورة الإعلان (اختياري)'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="block w-full text-sm text-deep-teal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-deep-teal file:text-white hover:file:bg-deep-teal/90 cursor-pointer"
                          disabled={imageUploading}
                          title="اختر صورة الإعلان"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <FormInput
                  label="رابط الوجهة (اختياري)"
                  type="url"
                  value={adFormData.targetUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setAdFormData(prev => ({ ...prev, targetUrl: newUrl }));
                    // Clear error when user starts typing
                    if (formErrors.targetUrl) {
                      setFormErrors(prev => ({ ...prev, targetUrl: '' }));
                    }
                  }}
                  onBlur={() => {
                    const error = validateTargetUrl(adFormData.targetUrl);
                    setFormErrors(prev => ({ ...prev, targetUrl: error }));
                  }}
                  placeholder="https://example.com"
                  error={formErrors.targetUrl}
                />
                
                {/* Order Summary - Enhanced */}
                <div className="bg-gradient-to-r from-deep-teal/10 to-accent/10 rounded-lg p-6 border-2 border-deep-teal/30">
                  <h4 className="font-bold text-deep-teal mb-4 text-center text-lg">ملخص الطلب</h4>
                  <div className="space-y-3 text-base">
                    <div className="flex justify-between items-center py-3 border-b border-deep-teal/20">
                      <span className="font-semibold text-deep-teal/80">نوع الإعلان:</span>
                      <span className="font-bold text-deep-teal">
                        {selectedPlan === 'featured' ? 'مميز' : selectedPlan === 'sidebar' ? 'جانبي' : 'بانر'}
                      </span>
                    </div>
                    {adFormData.location && adFormData.type && (
                      <div className="flex justify-between items-center py-3 border-b border-deep-teal/20">
                        <span className="font-semibold text-deep-teal/80">الموقع:</span>
                        <span className="font-bold text-deep-teal">
                          {adPlacements.find(p => p.location === adFormData.location && p.type === adFormData.type)?.name || 'غير محدد'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-deep-teal/20">
                      <span className="font-semibold text-deep-teal/80">المدة:</span>
                      <span className="font-bold text-deep-teal">
                        {selectedDuration === 'daily' ? 'يومي' : selectedDuration === 'weekly' ? 'أسبوعي' : 'شهري'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="font-semibold text-deep-teal/80">السعر:</span>
                      <span className="font-bold text-xl text-accent">
                        {adFormData.location && adFormData.type ? 
                          adPlacements.find(p => p.location === adFormData.location && p.type === adFormData.type)?.pricing[selectedDuration] :
                          adPlans.find(p => p.id === selectedPlan)?.pricing[selectedDuration]
                        } جنيه
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setShowAdForm(false);
                      setFormErrors({});
                    }}
                    className="flex-1 text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white font-semibold"
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePurchase}
                    className="flex-1 font-bold text-lg"
                    disabled={!adFormData.title || !adFormData.description || Object.keys(formErrors).length > 0}
                  >
                    اشتري الإعلان
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdvertisePage; 