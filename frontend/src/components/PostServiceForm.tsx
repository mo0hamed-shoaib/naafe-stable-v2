import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Button from './ui/Button';
import BaseCard from './ui/BaseCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormInput, FormTextarea, AIAssistant, PricingGuidance } from './ui';
import UnifiedSelect from './ui/UnifiedSelect';
import { Sparkles } from 'lucide-react';
import { EGYPT_GOVERNORATES, EGYPT_CITIES } from '../utils/constants';
import { TimePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import arEG from 'antd/locale/ar_EG';

interface PostServiceFormData {
  serviceTitle: string;
  category: string;
  serviceDescription: string;
  minBudget: string;
  maxBudget: string;
  government: string;
  city: string;
  tags: string;
  workingDays?: string[];
  startTime?: string;
  endTime?: string;
}

interface AddressFields {
  government: string;
  city: string;
  street: string;
  apartmentNumber: string;
  additionalInformation: string;
}

interface ValidationErrors {
  serviceTitle?: string;
  category?: string;
  serviceDescription?: string;
  minBudget?: string;
  maxBudget?: string;
  government?: string;
  city?: string;
  workingDays?: string;
  startTime?: string;
  endTime?: string;
}

const PostServiceForm: React.FC = () => {
  const { accessToken, user } = useAuth();
  const [formData, setFormData] = useState<PostServiceFormData>({
    serviceTitle: '',
    category: '',
    serviceDescription: '',
    minBudget: '',
    maxBudget: '',
    government: '',
    city: '',
    tags: '',
    workingDays: [],
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [providerSkills, setProviderSkills] = useState<string[]>([]);
  const [profileAddress, setProfileAddress] = useState<AddressFields | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Update city list when governorate changes
  const cityOptions = selectedGovernorate
    ? [...(EGYPT_CITIES[selectedGovernorate] || []), 'أخرى']
    : [];

  // Validation function
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Service Title validation
    if (!formData.serviceTitle.trim()) {
      errors.serviceTitle = 'عنوان الخدمة مطلوب';
    } else if (formData.serviceTitle.length < 10) {
      errors.serviceTitle = 'عنوان الخدمة يجب أن يكون 10 أحرف على الأقل';
    } else if (formData.serviceTitle.length > 100) {
      errors.serviceTitle = 'عنوان الخدمة لا يمكن أن يتجاوز 100 حرف';
    }

    // Category validation
    if (!formData.category.trim()) {
      errors.category = 'الفئة مطلوبة';
    }

    // Service Description validation
    if (!formData.serviceDescription.trim()) {
      errors.serviceDescription = 'وصف الخدمة مطلوب';
    } else if (formData.serviceDescription.length < 20) {
      errors.serviceDescription = 'وصف الخدمة يجب أن يكون 20 حرف على الأقل';
    } else if (formData.serviceDescription.length > 2000) {
      errors.serviceDescription = 'وصف الخدمة لا يمكن أن يتجاوز 2000 حرف';
    }

    // Budget validation
    if (!formData.minBudget.trim()) {
      errors.minBudget = 'السعر الأدنى مطلوب';
    } else if (Number(formData.minBudget) < 0) {
      errors.minBudget = 'السعر الأدنى يجب أن يكون رقم موجب';
    }

    if (!formData.maxBudget.trim()) {
      errors.maxBudget = 'السعر الأقصى مطلوب';
    } else if (Number(formData.maxBudget) < 0) {
      errors.maxBudget = 'السعر الأقصى يجب أن يكون رقم موجب';
    }

    if (formData.minBudget && formData.maxBudget && Number(formData.minBudget) > Number(formData.maxBudget)) {
      errors.maxBudget = 'السعر الأقصى يجب أن يكون أكبر من السعر الأدنى';
    }

    // Location validation
    if (!formData.government.trim()) {
      errors.government = 'المحافظة مطلوبة';
    }

    if (!formData.city.trim()) {
      errors.city = 'المدينة مطلوبة';
    }

    // Working days validation
    if (!formData.workingDays || formData.workingDays.length === 0) {
      errors.workingDays = 'يجب اختيار أيام العمل على الأقل';
    }

    // Time validation
    if (!(formData.startTime ?? '').trim()) {
      errors.startTime = 'وقت البداية مطلوب';
    }

    if (!(formData.endTime ?? '').trim()) {
      errors.endTime = 'وقت النهاية مطلوب';
    }

    if ((formData.startTime ?? '') && (formData.endTime ?? '') && (formData.startTime ?? '') >= (formData.endTime ?? '')) {
      errors.endTime = 'وقت النهاية يجب أن يكون بعد وقت البداية';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Remove unused clearFieldError function

  // Remove the real-time validation effect that runs on every formData change
  // useEffect(() => {
  //   // Only validate if user has started interacting with the form
  //   const hasInteracted = formData.serviceTitle || formData.category || formData.serviceDescription || 
  //                        formData.minBudget || formData.maxBudget || formData.government || 
  //                        formData.city || (formData.workingDays && formData.workingDays.length > 0) ||
  //                        (formData.startTime ?? '') || (formData.endTime ?? '');
  //   
  //   if (hasInteracted) {
  //     validateForm();
  //   }
  // }, [formData]);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories.map((cat: { name: string }) => cat.name));
        } else {
          setCategoriesError('فشل تحميل الفئات');
        }
      })
      .catch(() => setCategoriesError('فشل تحميل الفئات'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch provider skills on mount
  useEffect(() => {
    fetch('/api/users/me/skills', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setProviderSkills(data.data.skills || []);
      });
  }, [accessToken]);

  useEffect(() => {
    fetch('/api/users/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.user?.profile?.location) {
          setProfileAddress(data.data.user.profile.location);
        }
      });
  }, [accessToken]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    // Validate only this specific field when it's blurred
    validateField(name as keyof ValidationErrors);
  };

  const validateField = (fieldName: keyof ValidationErrors) => {
    const errors: ValidationErrors = {};
    
    // Validate only the specific field
    switch (fieldName) {
      case 'serviceTitle':
        if (!formData.serviceTitle.trim()) {
          errors.serviceTitle = 'عنوان الخدمة مطلوب';
        } else if (formData.serviceTitle.length < 10) {
          errors.serviceTitle = 'عنوان الخدمة يجب أن يكون 10 أحرف على الأقل';
        } else if (formData.serviceTitle.length > 100) {
          errors.serviceTitle = 'عنوان الخدمة لا يمكن أن يتجاوز 100 حرف';
        }
        break;
      case 'category':
        if (!formData.category.trim()) {
          errors.category = 'الفئة مطلوبة';
        }
        break;
      case 'serviceDescription':
        if (!formData.serviceDescription.trim()) {
          errors.serviceDescription = 'وصف الخدمة مطلوب';
        } else if (formData.serviceDescription.length < 20) {
          errors.serviceDescription = 'وصف الخدمة يجب أن يكون 20 حرف على الأقل';
        } else if (formData.serviceDescription.length > 2000) {
          errors.serviceDescription = 'وصف الخدمة لا يمكن أن يتجاوز 2000 حرف';
        }
        break;
      case 'minBudget':
        if (!formData.minBudget.trim()) {
          errors.minBudget = 'السعر الأدنى مطلوب';
        } else if (Number(formData.minBudget) < 0) {
          errors.minBudget = 'السعر الأدنى يجب أن يكون رقم موجب';
        }
        break;
      case 'maxBudget':
        if (!formData.maxBudget.trim()) {
          errors.maxBudget = 'السعر الأقصى مطلوب';
        } else if (Number(formData.maxBudget) < 0) {
          errors.maxBudget = 'السعر الأقصى يجب أن يكون رقم موجب';
        }
        if (formData.minBudget && formData.maxBudget && Number(formData.minBudget) > Number(formData.maxBudget)) {
          errors.maxBudget = 'السعر الأقصى يجب أن يكون أكبر من السعر الأدنى';
        }
        break;
      case 'government':
        if (!formData.government.trim()) {
          errors.government = 'المحافظة مطلوبة';
        }
        break;
      case 'city':
        if (!formData.city.trim()) {
          errors.city = 'المدينة مطلوبة';
        }
        break;
      case 'workingDays':
        if (!formData.workingDays || formData.workingDays.length === 0) {
          errors.workingDays = 'يجب اختيار أيام العمل على الأقل';
        }
        break;
      case 'startTime':
        if (!(formData.startTime ?? '').trim()) {
          errors.startTime = 'وقت البداية مطلوب';
        }
        break;
      case 'endTime':
        if (!(formData.endTime ?? '').trim()) {
          errors.endTime = 'وقت النهاية مطلوب';
        }
        if ((formData.startTime ?? '') && (formData.endTime ?? '') && (formData.startTime ?? '') >= (formData.endTime ?? '')) {
          errors.endTime = 'وقت النهاية يجب أن يكون بعد وقت البداية';
        }
        break;
    }
    
    // Update only the specific field error
    setValidationErrors(prev => ({ ...prev, [fieldName]: errors[fieldName] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAISuggestion = (field: string, value: string) => {
    if (field === 'title') {
      setFormData(prev => ({ ...prev, serviceTitle: value }));
    } else if (field === 'description') {
      // Ensure AI suggestions don't exceed 2000 characters
      const truncatedValue = value.length > 2000 ? value.substring(0, 2000) : value;
      setFormData(prev => ({ ...prev, serviceDescription: truncatedValue }));
    } else if (field === 'keywords') {
      setFormData(prev => ({ ...prev, tags: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePricingApply = (min: number, max: number) => {
    setFormData(prev => ({ 
      ...prev, 
      minBudget: min.toString(),
      maxBudget: max.toString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    // Mark all fields as touched ON SUBMIT ONLY
    setTouchedFields({
      serviceTitle: true,
      category: true,
      serviceDescription: true,
      minBudget: true,
      maxBudget: true,
      government: true,
      city: true,
      workingDays: true,
      startTime: true,
      endTime: true,
    });
    // Validate form before submission
    if (!validateForm()) {
      setError('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        title: formData.serviceTitle,
        description: formData.serviceDescription,
        category: formData.category,
        budget: {
          min: Number(formData.minBudget),
          max: Number(formData.maxBudget),
          currency: 'EGP',
        },
        location: {
          government: formData.government,
          city: formData.city,
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        attachments: [],
        workingDays: formData.workingDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };
      const res = await fetch('/api/listings/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to post service');
      }
      setSuccess(true);
      setTimeout(() => navigate('/search/providers?category=' + encodeURIComponent(formData.category)), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Helper to decide if error should be shown
  const shouldShowError = (field: keyof ValidationErrors) => {
    return (touchedFields[field] || submitAttempted) && validationErrors[field];
  };

  // Helper to check if form is valid for submit button
  const isFormValid = (): boolean => {
    // Check if all required fields are filled
    const hasRequiredFields = 
      formData.serviceTitle.trim() &&
      formData.category.trim() &&
      formData.serviceDescription.trim() &&
      formData.minBudget.trim() &&
      formData.maxBudget.trim() &&
      formData.government.trim() &&
      formData.city.trim() &&
      (formData.workingDays && formData.workingDays.length > 0) &&
      (formData.startTime ?? '').trim() &&
      (formData.endTime ?? '').trim();

    // Check if there are no validation errors
    const hasNoErrors = Object.keys(validationErrors).length === 0;

    return hasRequiredFields && hasNoErrors;
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* AI Form Section */}
          <div>
            <BaseCard className="p-6 md:sticky md:top-24">
              <h2 className="text-xl font-bold text-deep-teal mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#F5A623]" />
                أدوات الذكاء الاصطناعي
              </h2>
              <AIAssistant
                formType="service"
                category={formData.category}
                currentFields={formData as unknown as Record<string, unknown>}
                onSuggestionApply={handleAISuggestion}
                inputPlaceholder="مثال: أعلن عن خدمة تنظيف منازل باحترافية..."
                skills={providerSkills}
                className="mb-4"
                rating={user?.providerProfile?.rating}
              />
              <PricingGuidance
                formType="service"
                category={formData.category}
                location={formData.government}
                userBudget={formData.minBudget && formData.maxBudget ? {
                  min: Number(formData.minBudget),
                  max: Number(formData.maxBudget)
                } : null}
                onPricingApply={handlePricingApply}
                skills={providerSkills}
                rating={user?.providerProfile?.rating}
              />
            </BaseCard>
          </div>

          {/* Main Form Section */}
          <div>
          <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <h1 className="text-3xl font-extrabold text-[#0e1b18] text-center mb-8">نشر خدمة</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="serviceTitle">عنوان الخدمة</label>
                  <FormInput
                    type="text"
                    id="serviceTitle"
                    name="serviceTitle"
                    value={formData.serviceTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="عنوان الخدمة"
                    required
                    size="md"
                    error={shouldShowError('serviceTitle') ? validationErrors.serviceTitle : undefined}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="category">الفئة</label>
                  <UnifiedSelect
                    value={formData.category}
                    onChange={val => {
                      setFormData(prev => ({ ...prev, category: val }));
                    }}
                    options={categories.map((cat: string) => ({ value: cat, label: cat }))}
                    placeholder="اختر الفئة"
                    required
                    disabled={categoriesLoading}
                    size="md"
                    error={shouldShowError('category') ? validationErrors.category : undefined}
                  />
                  {categoriesError && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{categoriesError}</div>}
                  {validationErrors.category && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{validationErrors.category}</div>}
                </div>
              </div>
                {/* Service Description Field */}
              <div>
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="serviceDescription">
                  وصف الخدمة
                  <span className="text-gray-500 text-xs mr-2">
                    ({formData.serviceDescription.length}/2000)
                  </span>
                </label>
                <FormTextarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="اكتب وصفاً مفصلاً للخدمة التي تقدمها..."
                  required
                  size="md"
                  error={shouldShowError('serviceDescription') ? validationErrors.serviceDescription : undefined}
                  maxLength={2000}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">المحافظة</label>
                    <UnifiedSelect
                      value={selectedGovernorate}
                      onChange={val => {
                        setSelectedGovernorate(val);
                        setSelectedCity('');
                        setCustomCity('');
                        setFormData(prev => ({ ...prev, government: EGYPT_GOVERNORATES.find(g => g.id === val)?.name || '' }));
                        clearFieldError('government');
                      }}
                      options={EGYPT_GOVERNORATES.map(g => ({ value: g.id, label: g.name }))}
                      placeholder="اختر المحافظة"
                      isSearchable
                      searchPlaceholder="ابحث عن محافظة..."
                      required
                      size="md"
                      error={shouldShowError('government') ? validationErrors.government : undefined}
                    />
                    {validationErrors.government && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{validationErrors.government}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">المدينة</label>
                    <UnifiedSelect
                      value={selectedCity}
                      onChange={val => {
                        setSelectedCity(val);
                        setCustomCity('');
                        setFormData(prev => ({ ...prev, city: val === 'أخرى' ? '' : val }));
                        clearFieldError('city');
                      }}
                      options={cityOptions.map(city => ({ value: city, label: city }))}
                      placeholder="اختر المدينة"
                      isSearchable
                      searchPlaceholder="ابحث عن مدينة..."
                      required
                      size="md"
                      disabled={!selectedGovernorate}
                      error={shouldShowError('city') ? validationErrors.city : undefined}
                    />
                    {selectedCity === 'أخرى' && (
                      <FormInput
                        type="text"
                        value={customCity}
                        onChange={e => {
                          setCustomCity(e.target.value);
                          setFormData(prev => ({ ...prev, city: e.target.value }));
                          clearFieldError('city');
                        }}
                        placeholder="أدخل اسم المدينة"
                        size="md"
                        className="mt-2"
                        required
                        onBlur={handleBlur}
                        error={shouldShowError('city') ? validationErrors.city : undefined}
                      />
                    )}
                    {validationErrors.city && selectedCity !== 'أخرى' && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{validationErrors.city}</div>}
                  </div>
                </div>
                {profileAddress && (
                  <div className="mb-4 flex items-center gap-4">
                    <button
                      type="button"
                      className="bg-bright-orange text-white font-semibold py-2 px-6 rounded-xl hover:bg-bright-orange/90 transition-all duration-300 shadow"
                      onClick={() => {
                        const govId = EGYPT_GOVERNORATES.find(g => g.name === profileAddress.government)?.id || '';
                        setSelectedGovernorate(govId);
                        setSelectedCity(profileAddress.city || '');
                        setCustomCity(profileAddress.city && !EGYPT_CITIES[govId]?.includes(profileAddress.city) ? profileAddress.city : '');
                        setFormData(prev => ({
                          ...prev,
                          government: profileAddress.government || '',
                          city: profileAddress.city || ''
                        }));
                        clearFieldError('government');
                        clearFieldError('city');
                      }}
                    >
                      استخدم العنوان المحفوظ
                    </button>
                  </div>
                )}
                {/* Budget Fields - move above availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="minBudget">يبدأ من (جنيه)</label>
                    <FormInput
                      type="number"
                      id="minBudget"
                      name="minBudget"
                      value={formData.minBudget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="مثال: 100"
                      min="0"
                      required
                      size="md"
                      error={shouldShowError('minBudget') ? validationErrors.minBudget : undefined}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="maxBudget">إلى (جنيه)</label>
                    <FormInput
                      type="number"
                      id="maxBudget"
                      name="maxBudget"
                      value={formData.maxBudget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="مثال: 500"
                      min="0"
                      required
                      size="md"
                      error={shouldShowError('maxBudget') ? validationErrors.maxBudget : undefined}
                    />
                  </div>
                </div>
                {/* Availability Section (مواعيد التوفر (أيام وساعات العمل)) */}
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2">مواعيد التوفر (أيام وساعات العمل)</label>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Working Days Checkboxes - horizontal row */}
                    <div className="flex flex-row flex-wrap gap-2 md:gap-3">
                      {[
                        { value: 'saturday', label: 'السبت' },
                        { value: 'sunday', label: 'الأحد' },
                        { value: 'monday', label: 'الاثنين' },
                        { value: 'tuesday', label: 'الثلاثاء' },
                        { value: 'wednesday', label: 'الأربعاء' },
                        { value: 'thursday', label: 'الخميس' },
                        { value: 'friday', label: 'الجمعة' }
                      ].map(day => (
                        <label
                          key={day.value}
                          className={
                            `flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors cursor-pointer select-none
                            ${formData.workingDays?.includes(day.value)
                              ? 'bg-deep-teal/90 border-deep-teal text-white'
                              : 'bg-white border-gray-300 text-deep-teal hover:bg-deep-teal/10'}
                            text-base font-semibold`
                          }
                          style={{ minWidth: '90px' }}
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#2D5D4F] border-2 border-gray-400 rounded focus:ring-2 focus:ring-accent focus:ring-offset-2"
                            style={{ accentColor: formData.workingDays?.includes(day.value) ? '#fff' : '#2D5D4F' }}
                            checked={formData.workingDays?.includes(day.value) || false}
                            onChange={e => {
                              setFormData(prev => ({
                                ...prev,
                                workingDays: e.target.checked
                                  ? [...(prev.workingDays || []), day.value]
                                  : (prev.workingDays || []).filter(d => d !== day.value)
                              }));
                              clearFieldError('workingDays');
                            }}
                            onBlur={handleBlur}
                          />
                          <span className="ml-1">{day.label}</span>
                        </label>
                      ))}
                    </div>
                    {/* Time Pickers - inline with checkboxes */}
                    <div className="flex gap-2 items-center">
                      <div className="w-full">
                        <ConfigProvider locale={arEG}>
                          <TimePicker.RangePicker
                            format={value => {
                              if (!value) return '';
                              const hour = value.hour();
                              const minute = value.minute().toString().padStart(2, '0');
                              const isAM = hour < 12;
                              let displayHour = hour % 12;
                              if (displayHour === 0) displayHour = 12;
                              return `${displayHour}:${minute} ${isAM ? 'ص' : 'م'}`;
                            }}
                            use12Hours
                            showSecond={false}
                            value={formData.startTime && formData.endTime ? [dayjs(formData.startTime, 'HH:mm'), dayjs(formData.endTime, 'HH:mm')] : null}
                            onChange={(val) => {
                              setFormData(prev => ({
                                ...prev,
                                startTime: val && val[0] ? val[0].format('HH:mm') : '',
                                endTime: val && val[1] ? val[1].format('HH:mm') : '',
                              }));
                              clearFieldError('startTime');
                              clearFieldError('endTime');
                            }}
                            disabled={false}
                            size="large"
                            className="bg-white border-2 border-gray-300 rounded-lg py-2 pr-3 pl-3 focus:ring-2 focus:ring-accent focus:border-accent text-right text-black custom-timepicker-contrast"
                            placeholder={["من", "إلى"]}
                            minuteStep={5}
                            allowClear
                            classNames={{ popup: { root: 'rtl' } }}
                            style={{ direction: 'rtl' }}
                          />
                        </ConfigProvider>
                      </div>
                    </div>
                  </div>
                  {/* Validation errors for availability */}
                  {(validationErrors.workingDays || validationErrors.startTime || validationErrors.endTime) && (
                    <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">
                      {validationErrors.workingDays && <div>{validationErrors.workingDays}</div>}
                      {validationErrors.startTime && <div>{validationErrors.startTime}</div>}
                      {validationErrors.endTime && <div>{validationErrors.endTime}</div>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="tags">الوسوم (افصل بينها بفاصلة)</label>
                  <FormInput
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="مثال: تنظيف, سباكة, كهرباء"
                    size="md"
                  />
              </div>
              {error && <div className="text-red-600 text-sm text-right bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
              {success && <div className="text-green-600 text-sm text-right bg-green-50 p-3 rounded-lg border border-green-200">تم إرسال الطلب بنجاح!</div>}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="rounded-xl"
                disabled={!isFormValid()}
              >
                إرسال الطلب
              </Button>
            </form>
          </BaseCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostServiceForm; 