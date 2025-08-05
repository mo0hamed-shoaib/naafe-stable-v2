import React from 'react';
import { MapPin, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import BaseCard from './ui/BaseCard';
import Button from './ui/Button';
import PremiumBadge from './ui/PremiumBadge';
import { ServiceRequest } from '../types';
import { translateLocation, translateCategory } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  alreadyApplied?: boolean;
  onInterested?: (requestId: string) => void;
  onViewDetails?: (requestId: string) => void;
}

const ServiceRequestCard = ({ request, alreadyApplied, onInterested, onViewDetails }: ServiceRequestCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'open': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          label: 'مفتوح',
          icon: Clock
        };
      case 'assigned': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          label: 'مُسند',
          icon: CheckCircle
        };
      case 'in_progress': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          label: 'قيد التنفيذ',
          icon: Clock
        };
      case 'completed': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          label: 'مكتمل',
          icon: CheckCircle
        };
      case 'cancelled': 
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          label: 'ملغي',
          icon: AlertCircle
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          label: 'غير محدد',
          icon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  const userId = user?.id;
  const ownerId = request.postedBy?.id;
  const isOwner = userId && ownerId && userId === ownerId;
  
  // Check if user is a provider
  const isProvider = user && user.roles?.includes('provider');

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(request.id);
    } else {
      navigate(`/request/${request.id}`);
    }
  };

  const handleInterested = () => {
    if (onInterested) {
      onInterested(request.id);
    } else {
      navigate(`/requests/${request.id}/respond`);
    }
  };

  return (
    <BaseCard className={`
      h-full flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
      relative
      ${request.postedBy?.isPremium 
        ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 shadow-xl hover:shadow-2xl overflow-hidden' 
        : 'border border-gray-200 hover:border-soft-teal/30'
      }
    `}>
      {/* Premium Background Effect */}
      {request.postedBy?.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 pointer-events-none"></div>
      )}
      
      <div className="relative z-10 p-5 flex flex-col h-full">
        {/* Header Section - Avatar and Name */}
        <div className="flex items-start gap-4 mb-2">
          {/* Avatar Container */}
          <div className="flex-shrink-0 relative">
            <img
              src={request.postedBy?.avatar || '/default-avatar.png'}
              alt={request.postedBy?.name || 'User profile'}
              className={`w-20 h-20 rounded-full object-cover border-2 ${
                request.postedBy?.isPremium ? 'border-yellow-400' : 'border-gray-200'
              }`}
            />
            {request.postedBy?.isPremium && (
              <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2">
                <PremiumBadge size="sm" />
              </div>
            )}
            {request.postedBy?.isVerified && (
              <div className="absolute -top-1 right-1">
                <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full shadow-sm" />
              </div>
            )}

          </div>
          
          {/* Request Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-deep-teal leading-tight flex-1 line-clamp-2 min-h-[3.5rem]">
                {request.title}
              </h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-base text-text-secondary">
              <span className="bg-soft-teal/20 text-deep-teal px-2 py-1 rounded-md text-sm font-medium">
                {translateCategory(request.category || 'عام')}
              </span>
              <span className="text-sm">•</span>
              <span className="text-sm">{formatDate(request.timePosted)}</span>
            </div>
            
            {/* Posted By Name */}
            <div className="text-base text-text-secondary mt-1">
              بواسطة: <span className="font-medium text-deep-teal">{request.postedBy?.name || 'مستخدم'}</span>
            </div>
          </div>
        </div>

        {/* Stats Row - Fixed Height */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-bold text-green-600">
              {request.budget?.min || 0} - {request.budget?.max || 0}
            </div>
            <div className="text-xs text-text-secondary">جنيه</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-bold text-blue-600">
              {request.responses || 0}
            </div>
            <div className="text-xs text-text-secondary">عرض</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-sm font-bold text-orange-600 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              {request.deadline ? new Date(request.deadline).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }) : 'مفتوح'}
            </div>
            <div className="text-xs text-text-secondary">موعد</div>
          </div>
        </div>

        {/* Location - Fixed Height */}
        {request.location && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary truncate">
              {translateLocation(request.location) || 'عن بُعد'}
            </span>
          </div>
        )}

        {/* Description - Flexible Height with Line Clamp */}
        <div className="flex-1 mb-4">
          <p className="text-base text-text-primary line-clamp-3 leading-relaxed">
            {request.description || 'لا يوجد وصف متاح لهذا الطلب.'}
          </p>
        </div>



        {/* Action Section - Fixed Height */}
        <div className="mt-auto space-y-3">
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex-1"
            >
              عرض التفاصيل
            </Button>
            
            {isProvider && !isOwner && (
              <Button
                variant={alreadyApplied ? "secondary" : "primary"}
                size="sm"
                onClick={handleInterested}
                disabled={alreadyApplied}
                className="flex-1"
                title={alreadyApplied ? 'لقد قدمت عرضاً بالفعل' : 'قدم عرضك'}
              >
                {alreadyApplied ? 'تم التقديم' : 'أنا مهتم'}
              </Button>
            )}
            
            {!isProvider && !isOwner && (
              <Tippy
                content="يجب أن تكون مقدم خدمات للتقديم"
                placement="top"
                arrow={true}
                theme="light-border"
              >
                <div className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-full cursor-not-allowed"
                  >
                    للمقدمين فقط
                  </Button>
                </div>
              </Tippy>
            )}
            
            {isOwner && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewDetails}
                className="flex-1"
              >
                طلبك
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ServiceRequestCard; 