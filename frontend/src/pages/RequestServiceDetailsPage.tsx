import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ServiceDetailsContainer from '../components/ServiceDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../contexts/AuthContext';
import { useOfferContext } from '../contexts/OfferContext';
import { useToast } from '../contexts/ToastContext';
import ReportServiceModal from '../components/ui/ReportServiceModal';

interface BackendOffer {
  _id: string;
  provider?: {
    _id: string;
    name?: {
      first?: string;
      last?: string;
    } | string;
    avatarUrl?: string;
    isVerified?: boolean;
    isTopRated?: boolean;
    isPremium?: boolean;
    createdAt?: string;
    providerProfile?: {
      rating?: number;
      skills?: string[];
      totalJobsCompleted?: number;
    };
  };
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  message?: string;
  selectedScheduleItems?: Array<{
    date: string;
    timeSlot: string;
    customTimeRange?: {
      startTime: string;
      endTime: string;
    };
  }>;
  createdAt?: string;
  status?: string;
}

const RequestServiceDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { accessToken, user } = useAuth();
  const { offers, addNewOffer, setOffers } = useOfferContext();
  const { showSuccess, showError } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [service, setService] = useState<any>(null); // TODO: Replace 'any' with proper type after mapping
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch offers for this service
  const fetchOffers = useCallback(async () => {
    if (!id) return;
    
    try {
      const res = await fetch(`/api/requests/${id}/offers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Map the backend offers to frontend format
          const mappedOffers = (data.data.offers || []).map((offer: BackendOffer) => ({
            id: offer._id,
            name: offer.provider?.name ? 
              (typeof offer.provider.name === 'object' 
                ? `${offer.provider.name.first || ''} ${offer.provider.name.last || ''}`.trim()
                : offer.provider.name)
              : 'مستخدم غير معروف',
            avatar: offer.provider?.avatarUrl || '',
            rating: offer.provider?.providerProfile?.rating || 0,
            price: offer.budget?.min || 0,
            specialties: offer.provider?.providerProfile?.skills || [],
            verified: offer.provider?.isVerified || false,
                    message: offer.message || '',
        selectedScheduleItems: offer.selectedScheduleItems || [],
            createdAt: offer.createdAt,
            status: offer.status || 'pending',
            providerId: offer.provider?._id || offer.provider,
            jobRequestId: id,
            stats: {
              rating: offer.provider?.providerProfile?.rating || 0,
              completedJobs: offer.provider?.providerProfile?.totalJobsCompleted || 0,
              completionRate: 100, // Default value
              joinDate: offer.provider?.createdAt || '',
              isTopRated: offer.provider?.isTopRated || false,
              isPremium: offer.provider?.isPremium || false,
            }
          }));
          setOffers(mappedOffers);
        }
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  }, [id, accessToken, setOffers]);

  // Check if service is saved
  const checkIfSaved = useCallback(async () => {
    if (!id || !user || !accessToken) {
      console.log('🔍 checkIfSaved: Missing required data', { id, user: !!user, accessToken: !!accessToken });
      return;
    }
    
    console.log('🔍 checkIfSaved: Checking saved status for service', { id, userId: user.id });
    
    try {
      const res = await fetch(`/api/users/me/saved-services/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      console.log('🔍 checkIfSaved: Response status', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('🔍 checkIfSaved: Response data', data);
        const newIsSaved = data.isSaved || false;
        console.log('🔍 checkIfSaved: Setting isSaved to', newIsSaved);
        setIsSaved(newIsSaved);
      } else if (res.status === 404) {
        // Service not saved
        console.log('🔍 checkIfSaved: Service not saved (404)');
        setIsSaved(false);
      } else {
        console.error('Error checking saved status:', res.status);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    }
  }, [id, user, accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/requests/${id}`);
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch');
        
        // TODO: Map backend jobRequest to frontend service model as needed
        const mappedService = {
          ...data.data.jobRequest,
          postedBy: { 
            id: data.data.jobRequest.seeker?._id || data.data.jobRequest.seeker?.id || data.data.jobRequest.seeker, 
            name: data.data.jobRequest.seeker?.name ? 
              (typeof data.data.jobRequest.seeker.name === 'object' 
                ? `${data.data.jobRequest.seeker.name.first || ''} ${data.data.jobRequest.seeker.name.last || ''}`.trim()
                : data.data.jobRequest.seeker.name)
              : 'مستخدم غير معروف'
          },
          // Map location/address fields, images, requester, etc. as needed
          images: (data.data.jobRequest.attachments || []).map((a: { url: string }) => a.url),
          requester: data.data.jobRequest.seeker ? {
            id: data.data.jobRequest.seeker._id || data.data.jobRequest.seeker.id,
            name: typeof data.data.jobRequest.seeker.name === 'object'
              ? `${data.data.jobRequest.seeker.name.first || ''} ${data.data.jobRequest.seeker.name.last || ''}`.trim()
              : data.data.jobRequest.seeker.name || 'مستخدم غير معروف',
            avatar: data.data.jobRequest.seeker.avatarUrl || '',
            createdAt: data.data.jobRequest.seeker.createdAt,
          } : null,
          // Add comments: [] if not present
          comments: [],
          timeline: data.data.jobRequest.deadline ? new Date(data.data.jobRequest.deadline).toLocaleString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
        };
        
        setService(mappedService);
        
        // Fetch offers
        await fetchOffers();
        
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, accessToken, fetchOffers]);

  // Check saved status after service is loaded and user is authenticated
  useEffect(() => {
    console.log('🔄 useEffect checkIfSaved: Dependencies changed', { 
      service: !!service, 
      user: !!user, 
      accessToken: !!accessToken, 
      id 
    });
    
    if (service && user && accessToken && id) {
      console.log('🔄 useEffect checkIfSaved: Calling checkIfSaved');
      // Add a small delay to ensure authentication is properly established
      const timer = setTimeout(() => {
        console.log('🔄 useEffect checkIfSaved: Executing checkIfSaved after delay');
        checkIfSaved();
      }, 500); // Increased delay to ensure everything is loaded
      
      return () => clearTimeout(timer);
    } else {
      console.log('🔄 useEffect checkIfSaved: Not calling checkIfSaved - missing dependencies');
    }
  }, [service, user, accessToken, id, checkIfSaved]);

  // Log when isSaved state changes
  useEffect(() => {
    console.log('🔄 isSaved state changed:', isSaved);
  }, [isSaved]);

  // Handle Save/Unsave service
  const handleSave = async () => {
    if (!id || !user) {
      showError('يجب تسجيل الدخول أولاً');
      return;
    }

    console.log('🔍 handleSave: Starting save/unsave process', { id, isSaved, userId: user.id });

    try {
      const method = isSaved ? 'DELETE' : 'POST';
      console.log('🔍 handleSave: Making request', { method, url: `/api/users/me/saved-services/${id}` });
      
      const res = await fetch(`/api/users/me/saved-services/${id}`, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('🔍 handleSave: Response status', res.status);

      if (res.ok) {
        console.log('🔍 handleSave: Success, updating state from', isSaved, 'to', !isSaved);
        setIsSaved(!isSaved);
        showSuccess(isSaved ? 'تم إزالة الخدمة من المحفوظات' : 'تم حفظ الخدمة بنجاح');
      } else {
        const errorData = await res.json();
        console.error('🔍 handleSave: Error response', errorData);
        throw new Error(errorData.error?.message || 'Failed to save/unsave service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showError('حدث خطأ أثناء حفظ الخدمة');
    }
  };

  // Handle Share service
  const handleShare = async () => {
    if (!service) return;

    setIsSharing(true);
    try {
      const shareData = {
        title: service.title,
        text: service.description,
        url: window.location.href,
      };

      if (navigator.share) {
        // Use native sharing if available
        await navigator.share(shareData);
        showSuccess('تم مشاركة الخدمة بنجاح');
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('تم نسخ رابط الخدمة إلى الحافظة');
      }
    } catch (error) {
      console.error('Error sharing service:', error);
      showError('حدث خطأ أثناء مشاركة الخدمة');
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Report service
  const handleReport = () => {
    if (!id || !user) {
      showError('يجب تسجيل الدخول أولاً');
      return;
    }
    setShowReportModal(true);
  };

  // Handle Report submission
  const handleReportSubmit = async (problemType: string, description: string) => {
    if (!id || !user) {
      showError('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsReporting(true);
    try {
      const res = await fetch(`/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: 'service_request',
          targetId: id,
          reason: problemType,
          description: description,
        }),
      });

      if (res.ok) {
        showSuccess('تم إرسال البلاغ بنجاح');
        setShowReportModal(false);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error reporting service:', error);
      showError('حدث خطأ أثناء إرسال البلاغ');
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-cream">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal mx-auto mb-4"></div>
              <p className="text-deep-teal">جاري تحميل تفاصيل الخدمة...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-cream">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-red-800 mb-2">خطأ في تحميل البيانات</h2>
              <p className="text-red-600 mb-4">{error || 'فشل في تحميل تفاصيل الخدمة'}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1">
        {/* Back Button Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BackButton to={location.state?.from || '/search'} className="mb-4" />
        </div>
        
        {/* Service Details */}
        {(() => {
          try {
            return (
              <ServiceDetailsContainer
                service={service}
                offers={offers}
                onInterested={() => {}}
                onShare={handleShare}
                onBookmark={handleSave}
                onReport={handleReport}
                onOfferAdded={addNewOffer}
                onOffersRefresh={fetchOffers}
                isSaved={isSaved}
                isSharing={isSharing}
                isReporting={isReporting}
              />
            );
          } catch (error) {
            console.error('Error rendering ServiceDetailsContainer:', error);
            return (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <h2 className="text-xl font-bold text-red-800 mb-2">خطأ في عرض البيانات</h2>
                  <p className="text-red-600 mb-4">حدث خطأ أثناء عرض تفاصيل الخدمة</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    إعادة تحميل الصفحة
                  </button>
                </div>
              </div>
            );
          }
        })()}
      </main>
      <Footer />
      
             {/* Report Modal */}
       {service && (
         <ReportServiceModal
           isOpen={showReportModal}
           onClose={() => setShowReportModal(false)}
           onSubmit={handleReportSubmit}
           serviceTitle={service.title || 'خدمة غير محددة'}
           loading={isReporting}
         />
       )}
      

    </div>
  );
};

export default RequestServiceDetailsPage; 