import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle, Star, Shield, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferContext } from '../../contexts/OfferContext';
import NegotiationSummary from '../ui/NegotiationSummary';
import { useNavigate } from 'react-router-dom';

interface Response {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price?: number;
  specialties: string[];
  verified?: boolean;
  completedJobs?: number;
  responseTime?: string;
  completionRate?: number;
  joinDate?: string;
  isTopRated?: boolean;
  isPremium?: boolean;
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
  jobRequestSeekerId?: string;
  status?: string; // 'pending', 'accepted', 'rejected'
  providerId?: string; // Provider's user ID for profile navigation
  stats?: {
    rating: number;
    completedJobs: number;
    completionRate: number;
    joinDate: string;
    isTopRated: boolean;
    isPremium: boolean;
  };
  jobRequestId?: string; // Added for chat functionality
}

interface ResponsesSectionProps {
  responses: Response[];
  onOffersRefresh?: () => Promise<void>;
  jobRequestStatus?: string; // 'open', 'assigned', 'in_progress', 'completed'
  jobRequestId: string;
  seekerId: string;
}

const ResponsesSection: React.FC<ResponsesSectionProps> = ({ 
  responses, 
  onOffersRefresh,
  jobRequestStatus = 'open',
  jobRequestId,
  seekerId
}) => {
  // Helper function to convert 24-hour time to 12-hour format with Arabic AM/PM
  const formatTimeTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours < 12 ? 'ص' : 'م';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  const { user, accessToken } = useAuth();
  const { negotiationState, fetchNegotiation, confirmNegotiation, resetNegotiation } = useOfferContext();
  const navigate = useNavigate();
  const [conversationMap, setConversationMap] = useState<Record<string, string | null>>({}); // offerId -> conversationId or null

  // Fetch conversation existence and negotiation state for each offer on mount
  React.useEffect(() => {
    if (responses && responses.length > 0 && user) {
      responses.forEach(async (resp) => {
        // Only fetch conversation if current user is the seeker (job request owner)
        if (resp.id && resp.jobRequestId && resp.providerId && user.id === resp.jobRequestSeekerId) {
          // Check if conversation exists
          const res = await fetch(`/api/chat/job-requests/${resp.jobRequestId}/conversation`, {
            headers: { 
              'Authorization': accessToken ? `Bearer ${accessToken}` : '',
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          setConversationMap(prev => ({ ...prev, [resp.id]: data.success && data.data && data.data._id ? data.data._id : null }));
          if (data.success && data.data && data.data._id) {
            fetchNegotiation(resp.id);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses, user]);
  if (!responses || responses.length === 0) return null;

  // Safe property access for responses
  const safeResponses = responses.map(resp => ({
    ...resp,
    name: resp.name || 'مستخدم غير معروف',
    avatar: resp.avatar || '',
    rating: resp.rating || 0,
    price: resp.price,
    specialties: resp.specialties || [],
    message: resp.message || '',
            selectedScheduleItems: resp.selectedScheduleItems || [],
    status: resp.status || 'pending',
    providerId: resp.providerId || '',
    jobRequestSeekerId: seekerId, // Always set from prop
    stats: resp.stats || {
      rating: 0,
      completedJobs: 0,
      completionRate: 0,
      joinDate: '',
      isTopRated: false,
      isPremium: false,
    },
    jobRequestId: jobRequestId, // Always set from prop
  }));

  // Helper function to determine if action buttons should be shown
  const shouldShowActionButtons = (response: Response) => {
    // Only show buttons to the seeker
    if (!user || user.id !== response.jobRequestSeekerId) {
      return false;
    }

    // Don't show buttons if job request is not open
    if (jobRequestStatus !== 'open') {
      return false;
    }

    // Don't show buttons if this offer has already been accepted/rejected
    if (response.status && response.status !== 'pending') {
      return false;
    }

    // Don't show buttons if another offer has been accepted
    const hasAcceptedOffer = responses.some(r => r.status === 'accepted');
    if (hasAcceptedOffer) {
      return false;
    }

    return true;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimePreferenceLabel = (pref: string) => {
    switch (pref) {
      case 'morning': return 'صباحاً';
      case 'afternoon': return 'ظهراً';
      case 'evening': return 'مساءً';
      case 'flexible': return 'مرن';
      default: return pref;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'accepted': return 'تم القبول';
      case 'rejected': return 'مرفوض';
      case 'cancelled': return 'ملغي';
      case 'negotiating': return 'قيد التفاوض';
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد التنفيذ';
      default: return status;
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refresh offers to show updated status
        if (onOffersRefresh) {
          await onOffersRefresh();
        }
        alert('تم قبول العرض بنجاح');
      } else {
        alert(data.error?.message || 'فشل في قبول العرض');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('حدث خطأ أثناء قبول العرض');
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refresh offers to show updated status
        if (onOffersRefresh) {
          await onOffersRefresh();
        }
        alert('تم رفض العرض بنجاح');
      } else {
        alert(data.error?.message || 'فشل في رفض العرض');
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('حدث خطأ أثناء رفض العرض');
    }
  };

  // Start Chat handler
  const handleStartChat = async (jobRequestId: string, providerId: string) => {
    if (!accessToken || !user) return;
    try {
      const res = await fetch(`/api/chat/job-requests/${jobRequestId}/conversation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ providerId })
      });
      const data = await res.json();
      if (data.success && data.data && data.data._id) {
        navigate(`/chat/${data.data._id}`);
      } else {
        alert(data.error?.message || 'فشل بدء المحادثة');
      }
    } catch {
      alert('حدث خطأ أثناء بدء المحادثة');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 text-right text-deep-teal">العروض المقدمة ({responses.length})</h2>
      <div className="space-y-4">
        {safeResponses.map((resp) => {
          const conversationId = conversationMap[resp.id];
          const negotiation = conversationId ? negotiationState[resp.id] : undefined;
          const canAccept = negotiation && conversationId ? negotiation.canAcceptOffer : false;
          // Determine negotiation status label
          let negotiationStatus = 'لم تبدأ المحادثة';
          if (resp.status === 'completed' || resp.status === 'in_progress') {
            negotiationStatus = 'المحادثة مكتملة';
          } else if (conversationId) {
            negotiationStatus = 'بانتظار التفاوض';
            if (negotiation) {
              if (negotiation.canAcceptOffer) negotiationStatus = 'تم الاتفاق';
              else if (negotiation.confirmationStatus.seeker || negotiation.confirmationStatus.provider) negotiationStatus = 'قيد التفاوض';
            }
          }
          return (
            <div key={resp.id} className="bg-white rounded-lg shadow-lg p-6 border border-deep-teal/10">
              {/* Provider Info */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => resp.providerId && window.open(`/provider/${resp.providerId}`, '_blank')}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  disabled={!resp.providerId}
                >
                  <img
                    src={resp.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"}
                    alt={resp.name}
                    className={`w-16 h-16 rounded-full object-cover border-2 ${
                      resp.isPremium ? 'border-yellow-300' : 'border-deep-teal/20'
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => resp.providerId && window.open(`/provider/${resp.providerId}`, '_blank')}
                      className="cursor-pointer hover:text-teal-700 transition-colors"
                      disabled={!resp.providerId}
                    >
                      <h3 className="font-bold text-lg text-deep-teal hover:underline">{resp.name}</h3>
                    </button>
                    {resp.verified && (
                      <Badge variant="status" size="sm">
                        موثق
                      </Badge>
                    )}
                    {resp.isTopRated && (
                      <Badge variant="top-rated" size="sm">
                        أعلى تقييم
                      </Badge>
                    )}
                    {resp.isPremium && (
                      <Badge variant="premium" size="sm">
                        مميز
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-deep-teal mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{resp.stats.rating.toFixed(1)}</span>
                    </div>
                    {resp.stats.completedJobs !== undefined && (
                      <span>{resp.stats.completedJobs} مهمة مكتملة</span>
                    )}
                    {resp.stats.completionRate !== undefined && (
                      <span>معدل إنجاز {resp.stats.completionRate}%</span>
                    )}
                  </div>
                  {resp.specialties && resp.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {resp.specialties.map((skill, index) => (
                        <span key={`skill-${resp.id}-${index}`} className="text-xs bg-soft-teal/20 text-deep-teal px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Emphasized Price Section - Only show if price exists */}
              {resp.price && (
                <div className="mb-4 p-4 bg-gradient-to-r from-deep-teal/5 to-teal-500/5 rounded-lg border border-deep-teal/20">
                  <div className="text-center">
                    <div className="text-sm text-deep-teal mb-1">السعر المقترح</div>
                    <div className="text-2xl font-bold text-deep-teal">
                      {resp.price.toLocaleString('ar-EG')} جنيه
                    </div>

                  </div>
                </div>
              )}

              {/* Specialties */}
              {resp.specialties.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-deep-teal mb-2">التخصصات:</p>
                  <div className="flex flex-wrap gap-2">
                    {resp.specialties.map((specialty, index) => (
                      <Badge key={`specialty-${resp.id}-${index}`} variant="category" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              {resp.message && (
                <div className="mb-4 p-4 bg-gradient-to-r from-deep-teal/5 to-teal-500/5 rounded-lg border border-deep-teal/20">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-5 w-5 text-deep-teal" />
                    <span className="text-sm font-semibold text-deep-teal">الرسالة:</span>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed text-right">{resp.message}</p>
                </div>
              )}

              {/* Schedule Information */}
              {resp.selectedScheduleItems && resp.selectedScheduleItems.length > 0 && (
                <div className="mb-4 p-4 bg-warm-cream rounded-lg border border-deep-teal/10">
                  <h4 className="text-sm font-semibold text-deep-teal mb-4 text-center">الأوقات المختارة من الجدول الزمني</h4>
                  
                  <div className="space-y-3">
                    {resp.selectedScheduleItems.slice(0, 6).map((item, index) => {
                      const getTimeSlotLabel = (timeSlot: string, customTimeRange?: { startTime: string; endTime: string }) => {
                        if (timeSlot === 'custom' && customTimeRange) {
                          return `${formatTimeTo12Hour(customTimeRange.startTime)} - ${formatTimeTo12Hour(customTimeRange.endTime)}`;
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
                        <div key={`schedule-${resp.id}-${index}`} className="bg-white px-3 py-2 rounded-md border border-deep-teal/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-deep-teal" />
                              <span className="text-xs text-deep-teal font-medium">
                                {new Date(item.date).toLocaleDateString('ar-EG', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-deep-teal" />
                              <span className="text-xs text-deep-teal font-medium">
                                {getTimeSlotLabel(item.timeSlot, item.customTimeRange)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {resp.selectedScheduleItems.length > 6 && (
                      <div className="bg-deep-teal/10 px-3 py-2 rounded-md border border-deep-teal/20 text-center">
                        <span className="text-xs text-deep-teal font-medium">
                          +{resp.selectedScheduleItems.length - 6} وقت إضافي
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Negotiation Status Badge */}
              <div className="mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${negotiationStatus === 'تم الاتفاق' ? 'bg-green-100 text-green-800' : negotiationStatus === 'قيد التفاوض' ? 'bg-yellow-100 text-yellow-800' : negotiationStatus === 'لم تبدأ المحادثة' ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-600'}`}>{negotiationStatus}</span>
              </div>

              {/* Agreed Terms Summary (if both agreed) */}
              {negotiation && negotiation.canAcceptOffer && (
                <div className="mb-2 text-green-800 bg-green-50 border border-green-100 rounded p-2 text-sm text-center font-semibold">
                  {(() => {
                    const terms = negotiation.currentTerms || {};
                    const price = terms.price ? `على ${terms.price.toLocaleString('ar-EG')} جنيه` : '';
                    const date = terms.date ? `في ${new Date(terms.date).toLocaleDateString('ar-EG')}` : '';
                    let time = '';
                    if (terms.time) {
                      // Format time as HH:mm ص/م
                      const [h, m] = terms.time.split(":");
                      let hour = Number(h);
                      const minute = m || '00';
                      const period = hour < 12 ? 'ص' : 'م';
                      hour = hour % 12 || 12;
                      time = `الساعة ${hour}:${minute} ${period}`;
                    }
                    const details = [price, date, time].filter(Boolean).join(' ');
                    return details ? `تم الاتفاق ${details}` : 'تم الاتفاق على جميع الشروط';
                  })()}
                </div>
              )}

              {/* Negotiation Summary (if exists) */}
              {negotiation && user && conversationId && (
                <NegotiationSummary
                  negotiation={negotiation}
                  isProvider={user.id === resp.providerId}
                  isSeeker={user.id === resp.jobRequestSeekerId}
                  jobRequest={{ id: resp.jobRequestId || '', title: '', description: '', budget: { min: 0, max: 0, currency: '' }, location: '', postedBy: { id: '', name: '', isPremium: false }, createdAt: '', timePosted: '', preferredDate: '', status: 'open', category: '', availability: { days: [], timeSlots: [] } }}
                  offer={resp}
                  onConfirm={() => confirmNegotiation(resp.id)}
                  onReset={() => resetNegotiation(resp.id)}
                />
              )}

              {/* Action Buttons */}
              {shouldShowActionButtons(resp) && (
                <div className="flex gap-3 pt-4 border-t border-deep-teal/10">
                  {/* Seeker: Show Start Chat or Return to Chat, and Reject Offer */}
                  {user && user.id === resp.jobRequestSeekerId && !conversationId && (
                    <>
                      <button
                        onClick={() => handleStartChat(resp.jobRequestId || '', resp.providerId || '')}
                        className="flex-1 bg-deep-teal text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow"
                      >
                        بدء محادثة
                      </button>
                      <button 
                        onClick={() => handleRejectOffer(resp.id)}
                        className="flex-1 bg-warm-cream text-deep-teal py-2 px-4 rounded-lg hover:bg-deep-teal/10 transition-colors font-medium border border-deep-teal/20"
                      >
                        رفض العرض
                      </button>
                    </>
                  )}
                  {user && user.id === resp.jobRequestSeekerId && conversationId && (
                    <>
                      <button
                        onClick={() => navigate(`/chat/${conversationId}`)}
                        className="flex-1 bg-deep-teal text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow"
                      >
                        العودة للمحادثة
                      </button>
                      <button 
                        onClick={() => handleRejectOffer(resp.id)}
                        className="flex-1 bg-warm-cream text-deep-teal py-2 px-4 rounded-lg hover:bg-deep-teal/10 transition-colors font-medium border border-deep-teal/20"
                      >
                        رفض العرض
                      </button>
                    </>
                  )}
                  {/* Accept only if negotiation is agreed and conversation exists */}
                  {canAccept && conversationId && (
                    <button 
                      onClick={() => handleAcceptOffer(resp.id)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium shadow"
                    >
                      قبول العرض
                    </button>
                  )}
                </div>
              )}

              {/* Status Badge for accepted/rejected/completed/in_progress offers */}
              {resp.status && resp.status !== 'pending' && (
                <div className="pt-4 border-t border-deep-teal/10">
                  <div className={`w-full text-center py-2 px-4 rounded-lg font-medium ${
                    resp.status === 'accepted'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                    : resp.status === 'completed'
                      ? 'bg-gray-100 text-gray-800 border border-gray-200'
                    : resp.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : resp.status === 'rejected'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                    : resp.status === 'cancelled'
                      ? 'bg-gray-100 text-gray-600 border border-gray-200'
                    : resp.status === 'negotiating'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {getStatusLabel(resp.status)}
                  </div>
                </div>
              )}

              {/* Job Status Info */}
              {jobRequestStatus !== 'open' && user && user.id === resp.jobRequestSeekerId && (
                <div className="pt-4 border-t border-deep-teal/10">
                  <div className="w-full text-center py-2 px-4 rounded-lg font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {jobRequestStatus === 'assigned' && 'تم تعيين مقدم الخدمة'}
                    {jobRequestStatus === 'in_progress' && 'الخدمة قيد التنفيذ'}
                    {jobRequestStatus === 'completed' && 'تم إنجاز الخدمة'}
                  </div>
                </div>
              )}

              {user && user.id === resp.providerId && resp.status === 'in_progress' && (
                <div className="flex items-center gap-2 text-blue-700 text-sm px-3 py-1 bg-blue-50 rounded-full mb-2">
                  <Shield className="w-4 h-4" />
                  الخدمة قيد التنفيذ
                </div>
              )}

              {resp.status === 'completed' && (
                <div className="flex items-center gap-2 text-green-700 text-sm px-3 py-1 bg-green-50 rounded-full mb-2">
                  <CheckCircle className="w-4 h-4" />
                  تم تحرير المبلغ لمقدم الخدمة. اكتملت الخدمة.
                </div>
              )}

              {/* Only show negotiation summary if the offer is not in_progress or completed */}
              {!(resp.status === 'in_progress' || resp.status === 'completed') && negotiation && user && conversationId && (
                <NegotiationSummary
                  negotiation={negotiation}
                  isProvider={user.id === resp.providerId}
                  isSeeker={user.id === resp.jobRequestSeekerId}
                  jobRequest={{ id: resp.jobRequestId || '', title: '', description: '', budget: { min: 0, max: 0, currency: '' }, location: '', postedBy: { id: '', name: '', isPremium: false }, createdAt: '', timePosted: '', preferredDate: '', status: 'open', category: '', availability: { days: [], timeSlots: [] } }}
                  offer={resp}
                  paymentCompleted={resp.status === 'in_progress'}
                  serviceCompleted={resp.status === 'completed'}
                  onConfirm={() => confirmNegotiation(resp.id)}
                  onReset={() => resetNegotiation(resp.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsesSection; 