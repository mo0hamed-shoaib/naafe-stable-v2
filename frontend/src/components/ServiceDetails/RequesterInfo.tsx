import React from 'react';

interface RequesterInfoProps {
  requester: {
    name: string;
    avatar: string;
    createdAt?: string;
    id?: string; // Seeker's user ID for profile navigation
  };
}

function formatJoinDate(dateString?: string): string {
  if (!dateString) return 'غير متوفر';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'انضم اليوم';
  if (diffDays < 7) return `انضم منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return `انضم في ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const RequesterInfo: React.FC<RequesterInfoProps> = ({ requester }) => {
  if (!requester) return null;

  // Safe property access
  const name = requester.name || 'مستخدم غير معروف';
  const avatar = requester.avatar || '';
  const id = requester.id || '';
  const createdAt = requester.createdAt;

  // Safe name extraction
  const getRequesterName = (name: any) => {
    if (!name) return 'مستخدم غير معروف';
    
    if (typeof name === 'object') {
      const firstName = name.first || '';
      const lastName = name.last || '';
      return `${firstName} ${lastName}`.trim() || 'مستخدم غير معروف';
    }
    
    return name || 'مستخدم غير معروف';
  };

  const requesterName = getRequesterName(name);

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4 flex items-center gap-4 text-right">
      <button
        onClick={() => id && window.open(`/profile/${id}`, '_blank')}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        disabled={!id}
      >
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border border-deep-teal/20"
        />
      </button>
      <div className="flex-1">
        <button
          onClick={() => id && window.open(`/profile/${id}`, '_blank')}
          className="cursor-pointer hover:text-teal-700 transition-colors text-right"
          disabled={!id}
        >
          <div className="font-bold text-lg text-deep-teal hover:underline">{requesterName}</div>
        </button>
        <div className="text-sm text-text-secondary">{formatJoinDate(createdAt)}</div>
      </div>
    </div>
  );
};

export default RequesterInfo;