import React, { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { FormInput } from "../ui";

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HelpCenterChatProps {
  className?: string;
}

const HelpCenterChat: React.FC<HelpCenterChatProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      type: 'user',
      content: 'كيف يمكنني التحقق من هويتي؟',
      timestamp: new Date()
    },
    {
      type: 'assistant',
      content: 'للتحقق من هويتك، اذهب إلى إعدادات ملفك الشخصي > تبويب التحقق > ارفع صورة واضحة لبطاقة هوية صادرة عن الحكومة. يمكنني توجيهك خطوة بخطوة.',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className={cn("fixed bottom-4 left-4 lg:bottom-6 lg:left-6 z-50", className)}>
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] lg:w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          <header className="bg-deep-teal text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-deep-teal"></span>
              </div>
              <div>
                <h3 className="font-bold">المساعد</h3>
                <p className="text-sm opacity-80">متصل</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors duration-300"
              aria-label="إغلاق المحادثة"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-warm-cream">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "rounded-lg py-3 px-4 max-w-xs shadow-sm",
                    msg.type === 'user'
                      ? 'bg-white text-text-primary rounded-br-none'
                      : 'bg-deep-teal text-white rounded-bl-none'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="relative">
              <FormInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                type="text"
                aria-label="رسالة الدردشة"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bright-orange transition-colors duration-300"
                aria-label="إرسال الرسالة"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 lg:w-16 lg:h-16 bg-bright-orange rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 animate-pulse"
          aria-label="فتح المحادثة"
        >
          <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>
      )}
    </div>
  );
};

export default HelpCenterChat; 