import { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput } from '../components/ui';
import { validatePassword } from '../utils/validation';

// Field validation type
type FieldValidation = {
  password?: { isValid: boolean; message: string };
  confirmPassword?: { isValid: boolean; message: string };
  general?: { isValid: boolean; message: string };
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldValidation>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setError('رابط إعادة تعيين كلمة المرور غير صالح');
    }
  }, [token]);

  // Real-time validation for password
  const validatePasswordField = useCallback((password: string) => {
    const validation = validatePassword(password);
    setFieldErrors(prev => ({
      ...prev,
      password: validation
    }));

    // Also validate confirm password if it exists
    if (formData.confirmPassword) {
      const confirmValidation = password === formData.confirmPassword 
        ? { isValid: true, message: '' }
        : { isValid: false, message: 'كلمتا المرور غير متطابقتين' };
      
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmValidation
      }));
    }
  }, [formData.confirmPassword]);

  // Real-time validation for confirm password
  const validateConfirmPasswordField = useCallback((confirmPassword: string) => {
    const validation = confirmPassword === formData.password 
      ? { isValid: true, message: '' }
      : { isValid: false, message: 'كلمتا المرور غير متطابقتين' };
    
    setFieldErrors(prev => ({
      ...prev,
      confirmPassword: validation
    }));
  }, [formData.password]);

  // Check if form has any errors
  const hasFormErrors = () => {
    return Object.values(fieldErrors).some(error => error && !error.isValid);
  };

  // Check if form is complete
  const isFormComplete = () => {
    return formData.password.trim() && formData.confirmPassword.trim();
  };

  // Check if form is valid and ready for submission
  const isFormValid = () => {
    return isFormComplete() && !hasFormErrors() && token;
  };

  // Helper function to get border color based on field status
  const getBorderColor = (fieldName: keyof typeof fieldErrors) => {
    const error = fieldErrors[fieldName];
    
    if (error && !error.isValid) {
      return 'border-red-500 focus:border-red-500';
    }
    
    // Check if field has value and is valid
    if (formData[fieldName as keyof typeof formData] && !error) {
      return 'border-green-500 focus:border-green-500';
    }
    
    return 'border-gray-300 focus:border-[#2D5D4F]';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Mark that user has started interacting with the form
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear general error when user starts typing
    if (fieldErrors.general && !fieldErrors.general.isValid) {
      setFieldErrors(prev => ({ ...prev, general: { isValid: true, message: '' } }));
    }
    setError(null);

    // Real-time validation based on field type
    if (name === 'password') {
      validatePasswordField(value);
    } else if (name === 'confirmPassword') {
      validateConfirmPasswordField(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid() || !token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          newPassword: formData.password 
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-teal/5 via-bright-orange/5 to-deep-teal/5 p-4">
        <div className="flex-1 flex items-center justify-center p-4 bg-white/80 shadow-xl md:rounded-l-3xl">
          <div className="w-full max-w-md">
            <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-2">تم إعادة تعيين كلمة المرور</h2>
                  <p className="text-text-secondary text-sm">
                    تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  تسجيل الدخول
                </Button>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-teal/5 via-bright-orange/5 to-deep-teal/5 p-4">
        <div className="flex-1 flex items-center justify-center p-4 bg-white/80 shadow-xl md:rounded-l-3xl">
          <div className="w-full max-w-md">
            <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">رابط غير صالح</h2>
                  <p className="text-text-secondary text-sm">
                    رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/forgot-password')}
                >
                  طلب رابط جديد
                </Button>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-teal/5 via-bright-orange/5 to-deep-teal/5 p-4">
      <div className="flex-1 flex items-center justify-center p-4 bg-white/80 shadow-xl md:rounded-l-3xl">
        <div className="w-full max-w-md">
          <BaseCard className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <Link 
                to="/login" 
                className="inline-flex items-center text-deep-teal hover:text-bright-orange transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة لتسجيل الدخول
              </Link>
              <h1 className="text-3xl font-bold text-deep-teal mb-2">إعادة تعيين كلمة المرور</h1>
              <p className="text-text-secondary text-sm">
                أدخل كلمة المرور الجديدة
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 mb-4 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="password">
                  كلمة المرور الجديدة
                </label>
                <div className="relative flex items-center">
                  <FormInput
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className={`w-full bg-gray-50 border-2 pr-12 pl-4 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-400 focus:bg-white focus:outline-none transition-colors duration-200 ${getBorderColor('password')}`}
                    required
                    autoComplete="new-password"
                    aria-describedby="password-error"
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-deep-teal pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute left-10 top-1/2 transform -translate-y-1/2 text-accent hover:text-deep-teal transition-colors focus:outline-none"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {fieldErrors.password?.message && (
                    <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 animate-fade-in pointer-events-none" />
                  )}
                </div>
                {fieldErrors.password?.message && (
                  <p className="text-red-600 text-sm text-right mt-1 animate-fade-in">
                    {fieldErrors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="confirmPassword">
                  تأكيد كلمة المرور
                </label>
                <div className="relative flex items-center">
                  <FormInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    className={`w-full bg-gray-50 border-2 pr-12 pl-4 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-400 focus:bg-white focus:outline-none transition-colors duration-200 ${getBorderColor('confirmPassword')}`}
                    required
                    autoComplete="new-password"
                    aria-describedby="confirm-password-error"
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-deep-teal pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute left-10 top-1/2 transform -translate-y-1/2 text-accent hover:text-deep-teal transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    tabIndex={0}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {fieldErrors.confirmPassword?.message && (
                    <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 animate-fade-in pointer-events-none" />
                  )}
                </div>
                {fieldErrors.confirmPassword?.message && (
                  <p className="text-red-600 text-sm text-right mt-1 animate-fade-in">
                    {fieldErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={!isFormValid()}
              >
                إعادة تعيين كلمة المرور
              </Button>

              {/* Form Status Helper */}
              {hasUserInteracted && !isFormComplete() && (
                <div className="text-amber-600 text-sm text-center bg-amber-50 p-3 rounded-lg border border-amber-200 animate-fade-in">
                  يرجى ملء جميع الحقول المطلوبة
                </div>
              )}
              {hasUserInteracted && isFormComplete() && hasFormErrors() && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">
                  يرجى تصحيح الأخطاء قبل المتابعة
                </div>
              )}
            </form>
          </BaseCard>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 