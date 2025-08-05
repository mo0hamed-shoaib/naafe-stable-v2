import React, { useState, useCallback } from 'react';
import Button from './Button';
import FormInput from './FormInput';
import { validateEmail } from '../../utils/validation';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldValidation {
  [key: string]: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<FieldValidation>({});

  const validateForm = useCallback(() => {
    const errors: FieldValidation = {};

    if (!email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [email]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setValidationErrors({});
        
        // Log the reset link to browser console for development
        if (data.data?.resetToken) {
          console.log('\n🔗 Reset Password Link:');
          console.log(`http://localhost:5173/reset-password?token=${data.data.resetToken}`);
          console.log('📋 Copy this link and open it in your browser to reset your password\n');
        }
      } else {
        setError(data.error?.message || 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [email, validateForm]);

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    setValidationErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">نسيت كلمة المرور؟</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="إغلاق"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">تم إرسال الرابط</h3>
            <p className="text-gray-600 mb-4">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              💡 تلميح: تحقق من مجلد الرسائل غير المرغوب فيها إذا لم تجد الرسالة في صندوق الوارد.
            </p>
            <Button
              onClick={handleClose}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <FormInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                error={validationErrors.email}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
                disabled={loading}
              >
                إرسال الرابط
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 