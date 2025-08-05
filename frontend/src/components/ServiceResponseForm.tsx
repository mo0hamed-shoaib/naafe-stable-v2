import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOfferContext } from '../contexts/OfferContext';
import { X, Star, Shield, Calendar, Clock } from 'lucide-react';
import Button from './ui/Button';
import BaseCard from './ui/BaseCard';
import Badge from './ui/Badge';

import { FormInput, FormTextarea, BudgetIndicator, NegotiationToggle, BudgetExplanationTextarea, ScheduleModal } from "./ui";
import UnifiedSelect from "./ui/UnifiedSelect";
import Header from './Header';
import Footer from './Footer';
import useSchedule from '../hooks/useSchedule';

interface FormData {
  timeline: string;
  duration: string;
  message: string;
  selectedScheduleItems: Array<{
    date: string;
    timeSlot: string;
    customTimeRange?: {
      startTime: string;
      endTime: string;
    };
  }>;
  agreedToTerms: boolean;
  negotiationAcknowledged: boolean;
  budgetExplanation: string;
}

interface ProviderData {
  name: { first: string; last: string };
  avatarUrl: string;
  providerProfile: {
    rating: number;
    reviewCount: number;
    verification: {
      status: string;
    };
  };
}

interface Offer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialties: string[];
  verified?: boolean;
  message?: string;
  estimatedTimeDays?: number;
  selectedScheduleItems?: Array<{
    date: string;
    timeSlot: string;
    customTimeRange?: {
      startTime: string;
      endTime: string;
    };
  }>;
  createdAt?: string;
}

const ServiceResponseForm: React.FC = () => {
  const { id: jobRequestId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { addNewOffer } = useOfferContext();
  
  const [formData, setFormData] = useState<FormData>({
    timeline: '',
    duration: '',
    message: '',
    selectedScheduleItems: [],
    agreedToTerms: false,
    negotiationAcknowledged: false,
    budgetExplanation: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [jobRequest, setJobRequest] = useState<{ title?: string; description?: string; category?: string; budget?: { min: number; max: number }; deadline?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Get provider's schedule
  const { schedule, loading: scheduleLoading, error: scheduleError } = useSchedule(user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job request details
        const jobRes = await fetch(`/api/requests/${jobRequestId}`);
        const jobData = await jobRes.json();
        if (!jobData.success) throw new Error('Failed to fetch job request');
        setJobRequest(jobData.data.jobRequest as { title?: string; description?: string; category?: string; budget?: { min: number; max: number }; deadline?: string });

        // Fetch current user's provider data
        if (accessToken) {
          const userRes = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
                  const userData = await userRes.json();
        if (userData.success) {
          setProviderData(userData.data.user as ProviderData);
        }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (jobRequestId) fetchData();
  }, [jobRequestId, accessToken]);

  const handleScheduleItemSelect = (scheduleItem: any) => {
    setFormData(prev => {
      const isAlreadySelected = prev.selectedScheduleItems.some(
        item => item.date === scheduleItem.date && item.timeSlot === scheduleItem.timeSlot
      );
      
      if (isAlreadySelected) {
        return {
          ...prev,
          selectedScheduleItems: prev.selectedScheduleItems.filter(
            item => !(item.date === scheduleItem.date && item.timeSlot === scheduleItem.timeSlot)
          )
        };
      } else {
        return {
          ...prev,
          selectedScheduleItems: [...prev.selectedScheduleItems, {
            date: scheduleItem.date,
            timeSlot: scheduleItem.timeSlot,
            customTimeRange: scheduleItem.customTimeRange
          }]
        };
      }
    });
  };

  const handleScheduleItemDeselect = (date: string, timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      selectedScheduleItems: prev.selectedScheduleItems.filter(
        item => !(item.date === date && item.timeSlot === timeSlot)
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const offerData = {
        message: formData.message,
        estimatedTimeDays: Number(formData.duration) || 1,
        selectedScheduleItems: formData.selectedScheduleItems
      };

      const res = await fetch(`/api/requests/${jobRequestId}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(offerData)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'Failed to submit offer');

      // Create new offer object for the details page
      const newOffer: Offer = {
        id: data.data._id || `temp-${Date.now()}`,
        name: providerData ? `${providerData.name.first} ${providerData.name.last}` : 'مستخدم',
        avatar: providerData?.avatarUrl || '',
        rating: providerData?.providerProfile?.rating || 0,
        specialties: [], // TODO: Get from provider profile
        verified: providerData?.providerProfile?.verification?.status === 'verified',
        message: formData.message,
        estimatedTimeDays: parseInt(formData.duration) || 1,
        selectedScheduleItems: formData.selectedScheduleItems,
        createdAt: new Date().toISOString(),
      };

      // Add the new offer to the context
      addNewOffer(newOffer);

      // Navigate back to job request details
      navigate(`/requests/${jobRequestId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };



  const getTimelineDisplay = () => {
    switch (formData.timeline) {
      case 'today': return 'اليوم';
      case 'tomorrow': return 'غداً';
      case 'this-week': return 'هذا الأسبوع';
      case 'next-week': return 'الأسبوع القادم';
      case 'flexible': return 'مرن';
      default: return 'غير محدد';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  if (!user || !user.roles.includes('provider')) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-cream">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-deep-teal text-lg text-center">
            يجب أن تكون مقدم خدمات لتقديم عرض على هذا الطلب.<br />
            <Button variant="primary" className="mt-4" onClick={() => navigate('/upgrade')}>ترقية حسابك</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Service Request Details Card */}
          {jobRequest && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-deep-teal/10">
              <h2 className="text-xl font-bold text-deep-teal mb-4 pb-2 border-b border-gray-200">
                تفاصيل طلب الخدمة
              </h2>
              
              {/* Header Section - Title and Category */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-xl font-bold text-deep-teal leading-tight flex-1">
                      {jobRequest.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-base text-text-secondary">
                    <span className="bg-soft-teal/20 text-deep-teal px-2 py-1 rounded-md text-sm font-medium">
                      {jobRequest.category || 'عام'}
                    </span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">
                      {new Date().toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-sm font-bold text-blue-600">
                    0
                  </div>
                  <div className="text-xs text-text-secondary">عرض</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-sm font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {jobRequest.deadline ? new Date(jobRequest.deadline).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) : 'مفتوح'}
                  </div>
                  <div className="text-xs text-text-secondary">موعد</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-base text-text-primary leading-relaxed">
                  {jobRequest.description || 'لا يوجد وصف متاح لهذا الطلب.'}
                </p>
              </div>

              {/* Budget - Only show if available */}
              {jobRequest.budget && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-bright-orange">
                      {jobRequest.budget.min} - {jobRequest.budget.max} جنيه
                    </div>
                    <div className="text-xs text-text-secondary">الميزانية المتوقعة</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Response Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-deep-teal/10">
            <header className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-deep-teal mb-1">
                  تقديم عرضك
                </h1>
                <p className="text-sm text-text-secondary">
                  قدم عرضك المناسب لهذا الطلب
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/requests/${jobRequestId}`)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Your Offer Section */}
              <div>
                <h2 className="text-lg font-semibold text-deep-teal mb-4 pb-2 border-b border-gray-200">
                  عرضك
                </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timeline" className="text-sm font-medium text-text-primary mb-2 block">
                    متى يمكنك البدء؟
                  </label>
                  <UnifiedSelect
                    value={formData.timeline} 
                    onChange={val => setFormData(prev => ({ ...prev, timeline: val }))}
                    options={[
                      { value: '', label: 'اختر التوقيت' },
                      { value: 'today', label: 'اليوم' },
                      { value: 'tomorrow', label: 'غداً' },
                      { value: 'this-week', label: 'هذا الأسبوع' },
                      { value: 'next-week', label: 'الأسبوع القادم' },
                      { value: 'flexible', label: 'مرن' },
                    ]}
                    required
                    className="w-full"
                    aria-label="اختر التوقيت"
                  />
                </div>
                
                <div>
                  <label htmlFor="duration" className="text-sm font-medium text-text-primary mb-2 block">
                    المدة المتوقعة (أيام)
                  </label>
                  <FormInput
                    id="duration"
                    type="number"
                    placeholder="مثال: 2 يوم"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-deep-teal bg-white text-text-primary placeholder-gray-500"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Schedule Selection Section */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-deep-teal flex items-center">
                  <Calendar className="h-5 w-5 ml-2" />
                  اختيار من الجدول الزمني
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  عرض الجدول الكامل
                </Button>
              </div>
              
              {scheduleLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal mx-auto mb-4"></div>
                  <p className="text-text-secondary">جاري تحميل الجدول الزمني...</p>
                </div>
              ) : scheduleError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{scheduleError}</p>
                </div>
              ) : schedule && schedule.length > 0 ? (
                <div className="space-y-4">
                  <div className="mb-4">
                    <p className="text-sm text-text-secondary mb-3">
                      اختر من الأوقات المتاحة في جدولك الزمني
                    </p>
                  </div>
                  
                  {/* Available Schedule Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {schedule
                      .filter(item => item.type === 'available')
                      .map((item, index) => {
                        const isSelected = formData.selectedScheduleItems.some(
                          selected => selected.date === item.date && selected.timeSlot === item.timeSlot
                        );
                        
                        const getTimeSlotLabel = (timeSlot: string, customTimeRange?: any) => {
                          if (timeSlot === 'custom' && customTimeRange) {
                            return `${customTimeRange.startTime} - ${customTimeRange.endTime}`;
                          }
                          switch (timeSlot) {
                            case 'morning': return 'صباحاً (8:00 ص - 12:00 م)';
                            case 'afternoon': return 'ظهراً (12:00 م - 4:00 م)';
                            case 'evening': return 'مساءً (4:00 م - 8:00 م)';
                            case 'full_day': return 'يوم كامل (8:00 ص - 8:00 م)';
                            default: return timeSlot;
                          }
                        };

                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-deep-teal bg-deep-teal/5' 
                                : 'border-gray-200 hover:border-deep-teal/50 hover:bg-gray-50'
                            }`}
                            onClick={() => handleScheduleItemSelect(item)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-text-primary">
                                  {new Date(item.date).toLocaleDateString('ar-EG', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {getTimeSlotLabel(item.timeSlot, item.customTimeRange)}
                                </p>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                isSelected 
                                  ? 'bg-deep-teal border-deep-teal' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="w-full h-full bg-deep-teal rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {/* Selected Items Summary */}
                  {formData.selectedScheduleItems.length > 0 && (
                    <div className="mt-4 p-4 bg-deep-teal/5 border border-deep-teal/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-deep-teal">
                          الأوقات المختارة ({formData.selectedScheduleItems.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, selectedScheduleItems: [] }))}
                          className="text-xs text-red-500 hover:text-red-700 underline"
                        >
                          مسح الكل
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.selectedScheduleItems.map((item, index) => {
                          const getTimeSlotLabel = (timeSlot: string, customTimeRange?: any) => {
                            if (timeSlot === 'custom' && customTimeRange) {
                              return `${customTimeRange.startTime} - ${customTimeRange.endTime}`;
                            }
                            switch (timeSlot) {
                              case 'morning': return 'صباحاً';
                              case 'afternoon': return 'ظهراً';
                              case 'evening': return 'مساءً';
                              case 'full_day': return 'يوم كامل';
                              default: return timeSlot;
                            }
                          };

                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm text-text-primary">
                                {new Date(item.date).toLocaleDateString('ar-EG', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })} - {getTimeSlotLabel(item.timeSlot, item.customTimeRange)}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleScheduleItemDeselect(item.date, item.timeSlot)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-text-secondary mb-2">لا توجد أوقات متاحة في جدولك الزمني</p>
                  <p className="text-xs text-text-secondary">
                    قم بإضافة أوقات توفر في صفحة الجدول الزمني أولاً
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/schedule')}
                    className="mt-3"
                  >
                    الذهاب إلى الجدول الزمني
                  </Button>
                </div>
              )}
            </div>

            {/* Message Section */}
            <div>
              <h2 className="text-lg font-semibold text-deep-teal mb-4 pb-2 border-b border-gray-200">
                رسالتك
              </h2>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-text-primary mb-2 block">
                  رسالة شخصية{' '}
                  <span className="text-text-secondary font-normal">(اختياري)</span>
                </label>
                <FormTextarea
                  id="message"
                  placeholder="أخبرهم لماذا أنت الشخص المناسب لهذا العمل..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  maxLength={300}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-deep-teal resize-none bg-white text-text-primary placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-text-secondary text-left">
                  {formData.message.length} / 300 حرف
                </p>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !formData.agreedToTerms}
                className="w-full h-14"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال ردك'}
              </Button>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                    className="rounded border-gray-300 text-deep-teal focus:ring-deep-teal"
                  />
                  <label htmlFor="terms" className="text-sm text-text-primary">
                    يمكنني إكمال هذه الخدمة كما هو موضح
                  </label>
                </div>
              </div>
            </div>
          </form>
          </div>

          {/* Live Preview Section */}
          <BaseCard className="mt-8 bg-[#FDF8F0] p-8">
          <h2 className="text-lg font-semibold text-deep-teal mb-6">معاينة مباشرة</h2>
          
          <BaseCard className="bg-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={providerData?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"}
                  alt="صورة المزود"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="mr-4">
                  <h3 className="font-bold text-text-primary">
                    {providerData ? `${providerData.name.first} ${providerData.name.last}` : 'اسمك'}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-text-secondary mr-1">
                      {providerData?.providerProfile?.rating || 0} ({providerData?.providerProfile?.reviewCount || 0} تقييم)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-text-secondary">تاريخ البدء</p>
                  <p className="text-text-primary">{getTimelineDisplay()}</p>
                </div>

                {formData.selectedScheduleItems.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-text-secondary">الأوقات المختارة ({formData.selectedScheduleItems.length})</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.selectedScheduleItems.slice(0, 5).map((item, index) => {
                        const getTimeSlotLabel = (timeSlot: string, customTimeRange?: any) => {
                          if (timeSlot === 'custom' && customTimeRange) {
                            return `${customTimeRange.startTime} - ${customTimeRange.endTime}`;
                          }
                          switch (timeSlot) {
                            case 'morning': return 'صباحاً';
                            case 'afternoon': return 'ظهراً';
                            case 'evening': return 'مساءً';
                            case 'full_day': return 'يوم كامل';
                            default: return timeSlot;
                          }
                        };

                        return (
                          <Badge key={index} variant="category" className="text-xs">
                            {new Date(item.date).toLocaleDateString('ar-EG', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })} - {getTimeSlotLabel(item.timeSlot, item.customTimeRange)}
                          </Badge>
                        );
                      })}
                      {formData.selectedScheduleItems.length > 5 && (
                        <Badge variant="category" className="text-xs">
                          +{formData.selectedScheduleItems.length - 5} أكثر
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-semibold text-text-secondary">مقتطف من الرسالة</p>
                  <p className="text-text-primary text-sm italic line-clamp-3">
                    {formData.message || "أخبرهم لماذا أنت الشخص المناسب لهذا العمل..."}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-text-secondary mb-2">
                    المهارات والتحقق
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {providerData?.providerProfile?.verification?.status === 'verified' && (
                      <Badge variant="top-rated">
                        <Shield className="h-3 w-3 ml-1" />
                        موثق
                      </Badge>
                    )}
                    <Badge variant="category">التصوير</Badge>
                    <Badge variant="category">التحرير</Badge>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Tips Section */}
          <BaseCard className="mt-6 bg-light-cream border-r-4 border-deep-teal">
            <div className="p-4">
              <p className="font-bold text-deep-teal mb-2">نصيحة لرد أفضل</p>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li>أضف رسالة شخصية</li>
                <li>اذكر خبرتك في هذا المجال</li>
                <li>ارفع أمثلة من أعمالك</li>
                <li>حدد تواريخ متاحة واضحة</li>
              </ul>
            </div>
          </BaseCard>
          </BaseCard>
        </div>
      </main>
      
      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        providerId={user?.id}
      />
      
      <Footer />
    </div>
  );
};

export default ServiceResponseForm; 