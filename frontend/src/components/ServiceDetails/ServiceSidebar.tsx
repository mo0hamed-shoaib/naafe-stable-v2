import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Bookmark, Flag, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface ServiceSidebarProps {
  service: {
    postedBy?: { id?: string };
    status?: string;
    budget?: { min?: number; max?: number };
    deadline?: string;
    [key: string]: unknown;
  };
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
  alreadyApplied?: boolean;
  isSaved?: boolean;
  isSharing?: boolean;
  isReporting?: boolean;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  service,
  onShare,
  onBookmark,
  onReport,
  alreadyApplied,
  isSaved = false,
  isSharing = false,
  isReporting = false
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth() as { user: User | null };
  
  if (!service) return null;
  const userId = user?.id;
  const ownerId = service.postedBy?.id;
  const isOwner = userId && ownerId && userId === ownerId;

  // Safe property access
  const status = service.status || 'open';
  const budget = service.budget || {};
  const deadline = service.deadline;

  const getStatusConfig = (status: string) => {
    const configs = {
      'open': { 
        label: 'مفتوح للتقديم', 
        icon: CheckCircle, 
        className: 'bg-green-100 text-green-800 border-green-200',
        description: 'يمكن لمقدمي الخدمات التقديم على هذا الطلب'
      },
      'assigned': { 
        label: 'تم التعيين', 
        icon: CheckCircle, 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'تم تعيين مقدم خدمة لهذا الطلب'
      },
      'in_progress': { 
        label: 'قيد التنفيذ', 
        icon: Clock, 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'الخدمة قيد التنفيذ حالياً'
      },
      'completed': { 
        label: 'مكتمل', 
        icon: CheckCircle, 
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        description: 'تم إنجاز الخدمة بنجاح'
      },
      'cancelled': { 
        label: 'ملغي', 
        icon: XCircle, 
        className: 'bg-red-100 text-red-800 border-red-200',
        description: 'تم إلغاء هذا الطلب'
      }
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <aside className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-24 text-right border border-deep-teal/10">
      {/* Status Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <StatusIcon className="h-5 w-5 text-deep-teal" />
          <h3 className="font-bold text-lg text-deep-teal">حالة الطلب</h3>
        </div>
        <div className={`p-3 rounded-lg border ${statusConfig.className} mb-2`}>
          <div className="font-semibold">{statusConfig.label}</div>
          <div className="text-sm opacity-80">{statusConfig.description}</div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-4 text-deep-teal">ملخص الطلب</h3>
        <div className="space-y-3">
          {/* Budget */}
          <div className="flex items-center gap-3 p-3 bg-warm-cream rounded-lg">
            <DollarSign className="h-5 w-5 text-deep-teal flex-shrink-0" />
            <div>
              <div className="text-sm text-deep-teal/70">الميزانية</div>
              <div className="font-semibold text-deep-teal">
                {budget.min?.toLocaleString('ar-EG')} - {budget.max?.toLocaleString('ar-EG')} جنيه
              </div>
            </div>
          </div>

          {/* Deadline */}
          {deadline && (
            <div className="flex items-center gap-3 p-3 bg-warm-cream rounded-lg">
              <Calendar className="h-5 w-5 text-deep-teal flex-shrink-0" />
              <div>
                <div className="text-sm text-deep-teal/70">الموعد النهائي</div>
                <div className="font-semibold text-deep-teal">
                  {new Date(deadline).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {user && user.roles.includes('provider') ? (
          <Button
            variant="primary"
            onClick={() => navigate(`/requests/${id}/respond`)}
            disabled={!!alreadyApplied || !!isOwner || status !== 'open'}
            className="w-full"
            title={
              alreadyApplied 
                ? 'لقد قدمت عرضاً بالفعل لهذا الطلب' 
                : isOwner 
                  ? 'لا يمكنك التقديم على طلبك' 
                  : status !== 'open'
                    ? 'هذا الطلب غير مفتوح للتقديم'
                    : undefined
            }
          >
            {isOwner
              ? 'هذا طلبك'
              : alreadyApplied
                ? 'تم التقديم'
                : status !== 'open'
                  ? 'غير متاح للتقديم'
                  : 'أنا مهتم'}
          </Button>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">يجب أن تكون مقدم خدمات</div>
              <div className="text-xs text-gray-500">للتقديم على هذا الطلب</div>
            </div>
          </div>
        )}

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={onShare}
            disabled={isSharing}
            loading={isSharing}
            className="flex items-center justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? 'جاري المشاركة...' : 'مشاركة'}
          </Button>
          <Button 
            variant={isSaved ? "primary" : "outline"}
            onClick={onBookmark}
            disabled={isSharing || isReporting}
            className="flex items-center justify-center gap-2"
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'محفوظ' : 'حفظ'}
          </Button>
        </div>

        {/* Report Button */}
        <Button 
          variant="danger" 
          onClick={onReport}
          disabled={isSharing || isReporting}
          loading={isReporting}
          className="w-full flex items-center justify-center gap-2"
        >
          <Flag className="h-4 w-4" />
          {isReporting ? 'جاري الإبلاغ...' : 'إبلاغ عن مشكلة'}
        </Button>
      </div>

      {/* Additional Info */}
      {status === 'open' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 نصيحة</div>
            <div>اقرأ الطلب بعناية وتأكد من أن مهاراتك تناسب المتطلبات قبل التقديم</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ServiceSidebar; 