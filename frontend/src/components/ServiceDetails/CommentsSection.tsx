import React from 'react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  if (!comments || comments.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2 text-right">التعليقات</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4 text-right">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1">
              <div className="font-bold text-base">{comment.author}</div>
              <div className="text-sm text-gray-700 mb-1">{comment.content}</div>
              <div className="text-xs text-gray-400">{comment.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection; 