import React, { useState, useCallback, useEffect } from 'react';
import Button from './Button';
import FormInput from './FormInput';
import { validatePassword } from '../../utils/validation';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

interface FieldValidation {
  [key: string]: string;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  token
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<FieldValidation>({});

  const validateForm = useCallback(() => {
    const errors: FieldValidation = {};

    if (!newPassword.trim()) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.message;
      }
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newPassword, confirmPassword]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setValidationErrors({});
      } else {
        setError(data.error?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, [token, newPassword, confirmPassword, validateForm]);

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setValidationErrors({});
    onClose();
  };

  useEffect(() => {
    if (!token) {
      setError('رمز إعادة التعيين غير صالح');
    }
  }, [token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">إعادة تعيين كلمة المرور</h2>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">تم إعادة تعيين كلمة المرور</h3>
            <p className="text-gray-600 mb-4">
              تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <FormInput
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                error={validationErrors.newPassword}
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <FormInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                error={validationErrors.confirmPassword}
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
                disabled={loading || !token}
              >
                إعادة تعيين كلمة المرور
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 