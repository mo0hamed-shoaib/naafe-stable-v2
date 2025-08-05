import { useState, useCallback } from 'react';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput } from '../components/ui';
import { validateEmail } from '../utils/validation';
import heroImage from '/public/images/hero-section.png';

// Field validation type
type FieldValidation = {
  email?: { isValid: boolean; message: string };
  general?: { isValid: boolean; message: string };
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldValidation>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Real-time validation for email
  const validateEmailField = useCallback((email: string) => {
    const validation = validateEmail(email);
    setFieldErrors(prev => ({
      ...prev,
      email: validation
    }));
  }, []);

  // Check if form is valid
  const isFormValid = () => {
    return email.trim() && (!fieldErrors.email || fieldErrors.email.isValid);
  };

  // Helper function to get border color based on field status
  const getBorderColor = (fieldName: keyof typeof fieldErrors) => {
    const error = fieldErrors[fieldName];
    
    if (error && !error.isValid) {
      return 'border-red-500 focus:border-red-500';
    }
    
    // Check if field has value and is valid
    if (email && !error) {
      return 'border-green-500 focus:border-green-500';
    }
    
    return 'border-gray-300 focus:border-[#2D5D4F]';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Mark that user has started interacting with the form
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    setEmail(value);
    validateEmailField(value);

    // Clear general error when user starts typing
    if (fieldErrors.general && !fieldErrors.general.isValid) {
      setFieldErrors(prev => ({ ...prev, general: { isValid: true, message: '' } }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
      } else {
        setSuccess(true);
        // For development, show the reset token in console
        if (data.data?.resetToken) {
          console.log('🔗 Reset Token (for testing):', data.data.resetToken);
        }
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
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-deep-teal mb-2">تم إرسال الرابط</h2>
                  <p className="text-text-secondary text-sm">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">ملاحظة للتطوير:</p>
                  <p>يمكنك رؤية رابط إعادة التعيين في وحدة تحكم المتصفح (F12 → Console)</p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    العودة لتسجيل الدخول
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                      setError(null);
                    }}
                  >
                    إرسال رابط آخر
                  </Button>
                </div>
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
              <h1 className="text-3xl font-bold text-deep-teal mb-2">نسيت كلمة المرور؟</h1>
              <p className="text-text-secondary text-sm">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 mb-4 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#0e1b18] text-right mb-2" htmlFor="email">
                  البريد الإلكتروني
                </label>
                <div className="relative flex items-center">
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="example@email.com"
                    className={`w-full bg-gray-50 border-2 pr-12 pl-4 py-3 rounded-xl text-[#0e1b18] text-right placeholder-gray-400 focus:bg-white focus:outline-none transition-colors duration-200 ${getBorderColor('email')}`}
                    required
                    autoComplete="email"
                    aria-describedby="email-error"
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-deep-teal pointer-events-none" />
                  {fieldErrors.email?.message && (
                    <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 animate-fade-in pointer-events-none" />
                  )}
                </div>
                {fieldErrors.email?.message && (
                  <p className="text-red-600 text-sm text-right mt-1 animate-fade-in">
                    {fieldErrors.email.message}
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
                إرسال رابط إعادة التعيين
              </Button>

              {/* Form Status Helper */}
              {hasUserInteracted && !email.trim() && (
                <div className="text-amber-600 text-sm text-center bg-amber-50 p-3 rounded-lg border border-amber-200 animate-fade-in">
                  يرجى إدخال بريدك الإلكتروني
                </div>
              )}
            </form>
          </BaseCard>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 