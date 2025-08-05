import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MessageCircle, User, Clock, ArrowRight } from 'lucide-react';

interface Conversation {
  _id: string;
  jobRequestId: {
    _id: string;
    title: string;
    status: string;
  };
  participants: {
    seeker: {
      _id: string;
      name: { first: string; last: string };
      email: string;
    };
    provider: {
      _id: string;
      name: { first: string; last: string };
      email: string;
    };
  };
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: {
    seeker: number;
    provider: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ConversationsPage: React.FC = () => {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    
    setLoading(true);
    fetch(`/api/chat/conversations?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConversations(data.data.conversations);
          setTotalPages(data.data.pagination.totalPages || 1);
          setTotalItems(data.data.pagination.totalItems || 0);
        } else {
          setError('فشل تحميل المحادثات');
        }
      })
      .catch(() => setError('فشل الاتصال بالخادم'))
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    
    return user.id === conversation.participants.seeker._id 
      ? conversation.participants.provider 
      : conversation.participants.seeker;
  };

  const getUnreadCount = (conversation: Conversation) => {
    if (!user) return 0;
    
    return user.id === conversation.participants.seeker._id 
      ? conversation.unreadCount.seeker 
      : conversation.unreadCount.provider;
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.slice(0, maxLength) + '...' : message;
  };

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المحادثات', active: true }
  ];

  if (loading) {
    return (
      <PageLayout
        title="جاري التحميل..."
        user={user}
        onLogout={() => {}}
      >
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <BaseCard key={i} className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </BaseCard>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="المحادثات"
      subtitle="تابع محادثاتك مع مقدمي الخدمات"
      breadcrumbItems={breadcrumbItems}
      user={user}
      onLogout={() => {}}
    >
      <div className="max-w-4xl mx-auto">
        {error ? (
          <BaseCard className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">حدث خطأ</h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </Button>
          </BaseCard>
        ) : conversations.length === 0 ? (
          <BaseCard className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد محادثات</h3>
            <p className="text-text-secondary mb-4">
              ستظهر هنا المحادثات عندما تقبل عرض خدمة أو يرسل لك شخص رسالة
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/categories')}
            >
              استكشف الخدمات
            </Button>
          </BaseCard>
        ) : (
          <>
            {/* Conversations List */}
            <div className="space-y-4">
              {conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const unreadCount = getUnreadCount(conversation);
                
                return (
                  <BaseCard
                    key={conversation._id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/chat/${conversation._id}`)}
                    hover={true}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-text-primary truncate">
                            {otherParticipant?.name.first} {otherParticipant?.name.last}
                          </h3>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <Badge variant="urgency" size="sm">
                                {unreadCount}
                              </Badge>
                            )}
                            <ArrowRight className="w-4 h-4 text-text-secondary" />
                          </div>
                        </div>
                        
                        <p className="text-sm text-text-secondary mb-1">
                          {conversation.jobRequestId.title}
                        </p>
                        
                        {conversation.lastMessage && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-text-primary truncate">
                              {truncateMessage(conversation.lastMessage.content)}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-text-secondary">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(conversation.lastMessage.timestamp)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </BaseCard>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <span className="text-sm text-text-secondary">
                  عرض {((page - 1) * 20) + 1} إلى {Math.min(page * 20, totalItems)} من {totalItems} محادثة
                </span>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    السابق
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-text-secondary bg-light-cream rounded-lg">
                    صفحة {page} من {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ConversationsPage; 