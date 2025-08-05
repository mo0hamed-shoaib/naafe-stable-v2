import React, { useState, useEffect, useCallback } from 'react';
import { User, Shield, Key, Trash2, AlertTriangle, CheckCircle, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { FormInput, FormTextarea } from "../components/ui";
import VerificationCenter from '../components/settings/VerificationCenter';
import UnifiedSelect from '../components/ui/UnifiedSelect';
import { EGYPT_GOVERNORATES, EGYPT_CITIES } from '../utils/constants';
import Button from '../components/ui/Button';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsCard from '../components/settings/SettingsCard';
import SettingsNavigation from '../components/settings/SettingsNavigation';
import { checkAvailability, debounce, validatePassword, validatePasswordConfirmation } from '../utils/validation';

const SettingsPage: React.FC = () => {
  const { user, accessToken, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigationItems = [
    { 
      id: 'account', 
      label: 'معلومات الحساب', 
      icon: User,
      description: 'تحديث المعلومات الشخصية'
    },
    { 
      id: 'verification', 
      label: 'مركز التحقق', 
      icon: Shield,
      description: 'التحقق من الهوية'
    },
    { 
      id: 'management', 
      label: 'إدارة الحساب', 
      icon: SettingsIcon,
      description: 'الأمان والبيانات'
    },
  ];

  const isAdmin = user?.roles?.includes('admin');
  const isProvider = user?.roles?.includes('provider');
  const isPremium = !!user?.isPremium;

  // Fix address state initialization to avoid type errors
  const [address, setAddress] = useState<{
    government: string;
    city: string;
    street: string;
    apartmentNumber: string;
    additionalInformation: string;
  }>({
    government: '',
    city: '',
    street: '',
    apartmentNumber: '',
    additionalInformation: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Update city list when governorate changes
  const cityOptions = selectedGovernorate
    ? [...(EGYPT_CITIES[selectedGovernorate] || []), 'أخرى']
    : [];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarUploading(true);
      setError('');
      try {
        const formData = new FormData();
        formData.append('image', file);
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setAvatarUrl(data.data.url);
          setSuccess('تم رفع الصورة بنجاح');
        } else {
          setError('فشل رفع الصورة');
        }
      } catch {
        setError('حدث خطأ أثناء رفع الصورة');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  const [personalInfo, setPersonalInfo] = useState({
    fullName: `${user?.name?.first || ''} ${user?.name?.last || ''}`,
    phone: user?.phone || '',
    bio: user?.profile?.bio || '',
  });

  const [bioError, setBioError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneAvailabilityStatus, setPhoneAvailabilityStatus] = useState<{
    available: boolean;
    message: string;
    checking?: boolean;
  } | null>(null);

  // Account management states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Check if there are any validation errors
  const hasValidationErrors = () => {
    // Check for empty required fields
    const hasEmptyFields = !personalInfo.fullName.trim() || !personalInfo.phone.trim();
    
    // Check for validation errors
    const hasValidationErrors = !!(bioError || nameError || phoneError || (phoneAvailabilityStatus && !phoneAvailabilityStatus.available));
    
    return hasEmptyFields || hasValidationErrors;
  };

  // Password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    
    // Real-time validation for new password
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setPasswordErrors(prev => ({ ...prev, newPassword: validation.message }));
      }
      
      // Check if new password is the same as current password
      if (passwordData.currentPassword.trim() && value.trim() && 
          passwordData.currentPassword.trim() === value.trim()) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          newPassword: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية' 
        }));
      }
    }
    
    // Real-time validation for confirm password
    if (name === 'confirmPassword') {
      const validation = validatePasswordConfirmation(passwordData.newPassword, value);
      if (!validation.isValid) {
        setPasswordErrors(prev => ({ ...prev, confirmPassword: validation.message }));
      }
    }
  };

  const validatePasswordForm = () => {
    const errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
    let hasErrors = false;

    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
      hasErrors = true;
    }

    // Validate new password using comprehensive validation
    const newPasswordValidation = validatePassword(passwordData.newPassword);
    if (!newPasswordValidation.isValid) {
      errors.newPassword = newPasswordValidation.message;
      hasErrors = true;
    }

    // Check if new password is the same as current password
    if (passwordData.currentPassword.trim() && passwordData.newPassword.trim() && 
        passwordData.currentPassword.trim() === passwordData.newPassword.trim()) {
      errors.newPassword = 'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية';
      hasErrors = true;
    }

    // Validate password confirmation
    const confirmPasswordValidation = validatePasswordConfirmation(passwordData.newPassword, passwordData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.message;
      hasErrors = true;
    }

    setPasswordErrors(errors);
    return !hasErrors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('تم تغيير كلمة المرور بنجاح');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
        
        // Logout the user after successful password change for security
        setTimeout(() => {
          logout();
        }, 1500); // Give user time to see the success message
      } else {
        setError(data.error?.message || 'فشل تغيير كلمة المرور');
      }
    } catch (error) {
      setError('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('تم حذف الحساب بنجاح');
        setShowDeleteModal(false);
        // Redirect to logout or home page
        window.location.href = '/';
      } else {
        setError(data.error?.message || 'فشل حذف الحساب');
      }
    } catch (error) {
      setError('حدث خطأ أثناء حذف الحساب');
    } finally {
      setDeletingAccount(false);
    }
  };

  // Debounced phone availability check
  const debouncedPhoneCheck = useCallback(
    debounce(async (phone: string) => {
      if (phone && phone.trim()) {
        console.log('Checking phone availability for:', phone);
        
        // Set checking status
        setPhoneAvailabilityStatus({ available: false, message: '', checking: true });
        
        try {
          const availability = await checkAvailability('', phone);
          console.log('Phone availability result:', availability);
          
          if (availability.phone) {
            setPhoneAvailabilityStatus({ 
              ...availability.phone, 
              checking: false 
            });
          }
        } catch (error) {
          console.error('Phone availability check error:', error);
          setPhoneAvailabilityStatus({ 
            available: false, 
            message: 'فشل في التحقق من رقم الهاتف',
            checking: false 
          });
        }
      } else {
        setPhoneAvailabilityStatus(null);
      }
    }, 500),
    []
  );

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (name === 'bio') {
      setBioError('');
    } else if (name === 'fullName') {
      setNameError('');
    } else if (name === 'phone') {
      setPhoneError('');
    }
    
    // Handle bio validation
    if (name === 'bio') {
      if (value.length > 200) {
        setBioError('النبذة الشخصية لا يمكن أن تتجاوز 200 حرف');
      }
    }
    
    // Handle name validation
    if (name === 'fullName') {
      if (!value.trim()) {
        setNameError('الاسم الكامل مطلوب');
      } else {
        const nameParts = value.trim().split(' ');
        if (nameParts.length < 2) {
          setNameError('يرجى إدخال الاسم الأول والأخير');
        } else if (nameParts[0].length < 2) {
          setNameError('الاسم الأول يجب أن يكون حرفين على الأقل');
        } else if (nameParts.slice(1).join(' ').length < 2) {
          setNameError('الاسم الأخير يجب أن يكون حرفين على الأقل');
        } else {
          setNameError('');
        }
      }
    }
    
    // Handle phone validation
    if (name === 'phone') {
      const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
      
      // Clear previous availability status
      setPhoneAvailabilityStatus(null);
      
      if (!value.trim()) {
        setPhoneError('رقم الهاتف مطلوب');
      } else if (!phoneRegex.test(value)) {
        setPhoneError('يرجى إدخال رقم هاتف مصري صحيح');
      } else {
        // Clear format error and check availability
        setPhoneError('');
        debouncedPhoneCheck(value);
      }
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    setBioError('');
    setNameError('');
    setPhoneError('');
    
    // Validate all fields
    let hasErrors = false;
    
    // Validate bio length
    if (personalInfo.bio && personalInfo.bio.length > 200) {
      setBioError('النبذة الشخصية لا يمكن أن تتجاوز 200 حرف');
      hasErrors = true;
    }
    
    // Validate name
    if (!personalInfo.fullName.trim()) {
      setNameError('الاسم الكامل مطلوب');
      hasErrors = true;
    } else {
      const nameParts = personalInfo.fullName.trim().split(' ');
      if (nameParts.length < 2) {
        setNameError('يرجى إدخال الاسم الأول والأخير');
        hasErrors = true;
      } else if (nameParts[0].length < 2) {
        setNameError('الاسم الأول يجب أن يكون حرفين على الأقل');
        hasErrors = true;
      } else if (nameParts.slice(1).join(' ').length < 2) {
        setNameError('الاسم الأخير يجب أن يكون حرفين على الأقل');
        hasErrors = true;
      }
    }
    
    // Validate phone
    if (!personalInfo.phone.trim()) {
      setPhoneError('رقم الهاتف مطلوب');
      hasErrors = true;
    } else {
      const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
      if (!phoneRegex.test(personalInfo.phone)) {
        setPhoneError('يرجى إدخال رقم هاتف مصري صحيح');
        hasErrors = true;
      } else if (phoneAvailabilityStatus && !phoneAvailabilityStatus.available) {
        setPhoneError(phoneAvailabilityStatus.message);
        hasErrors = true;
      }
    }
    
    if (hasErrors) {
      setSaving(false);
      return;
    }
    
    try {
      // Split full name
      const [first, ...rest] = personalInfo.fullName.trim().split(' ');
      const last = rest.join(' ');
      const payload = {
        name: { first, last },
        phone: personalInfo.phone,
        profile: {
          bio: personalInfo.bio,
          location: {
            government: address.government,
            city: address.city,
            street: address.street,
            apartmentNumber: address.apartmentNumber,
            additionalInformation: address.additionalInformation,
          },
        },
        avatarUrl: avatarUrl,
      };
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSuccess('تم تحديث المعلومات الشخصية بنجاح');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'حدث خطأ أثناء تحديث المعلومات الشخصية';
        
        // Check if it's a bio validation error
        if (errorMessage.includes('Bio cannot exceed') || errorMessage.includes('1000') || errorMessage.includes('200')) {
          setBioError('النبذة الشخصية لا يمكن أن تتجاوز 200 حرف');
        } else {
          setError(errorMessage);
        }
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  // Sync address from user context on mount or when user changes
  useEffect(() => {
    if (user?.profile?.location) {
      setAddress({
        government: user.profile?.location?.government || '',
        city: user.profile?.location?.city || '',
        street: user.profile?.location?.street || '',
        apartmentNumber: user.profile?.location?.apartmentNumber || '',
        additionalInformation: user.profile?.location?.additionalInformation || '',
      });
      // Set dropdowns for UnifiedSelect
      const govId = EGYPT_GOVERNORATES.find(g => g.name === user.profile?.location?.government)?.id || '';
      setSelectedGovernorate(govId);
      setSelectedCity(user.profile?.location?.city || '');
      setCustomCity(user.profile?.location?.city && !EGYPT_CITIES[govId]?.includes(user.profile?.location?.city) ? user.profile?.location?.city : '');
    }
  }, [user]);

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          await response.json();
          // setSettings(data.data.settings); // This line is removed as per the edit hint
        }
      } catch {
        console.error('Error fetching settings');
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchSettings();
    }
  }, [accessToken]);

  // Update settings
  // const updateSettings = async (newSettings: Partial<UserSettings>) => { // This function is removed as per the edit hint
  //   setSaving(true);
  //   setError('');
  //   setSuccess('');
  //
  //   try {
  //     const response = await fetch('/api/settings', {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${accessToken}`
  //       },
  //       body: JSON.stringify(newSettings)
  //     });
  //
  //     if (response.ok) {
  //       const data = await response.json();
  //       setSettings(data.data.settings);
  //       setSuccess('تم تحديث الإعدادات بنجاح');
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.error?.message || 'حدث خطأ أثناء تحديث الإعدادات');
  //     }
  //   } catch {
  //     setError('حدث خطأ في الاتصال');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  useEffect(() => {
    if (isProvider && isPremium) {
      // Removed as per new UX decision
    }
    // eslint-disable-next-line
  }, [isProvider, isPremium]);

  // Effect to update phone errors based on availability status
  useEffect(() => {
    if (phoneAvailabilityStatus && !phoneAvailabilityStatus.checking) {
      if (!phoneAvailabilityStatus.available) {
        setPhoneError(phoneAvailabilityStatus.message);
      }
      // Don't clear error if phone is available - let user see it was successful
    }
  }, [phoneAvailabilityStatus]);

  const renderAccountInformation = () => (
    <SettingsSection
      title="معلومات الحساب"
      description="تحديث معلوماتك الشخصية والتفاصيل الأساسية"
      icon={User}
    >
      <SettingsCard title="المعلومات الشخصية">
        <form onSubmit={handlePersonalInfoSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-4">
              <img
                src={avatarPreview || '/default-avatar.png'}
                alt="الصورة الشخصية"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-deep-teal/10 file:text-deep-teal hover:file:bg-deep-teal/20"
                title="اختر صورة شخصية"
                aria-label="اختر صورة شخصية"
              />
              {avatarUploading && (
                <div className="text-sm text-deep-teal mt-2">جاري رفع الصورة...</div>
              )}
              {error && (
                <div className="text-sm text-red-600 mt-2">{error}</div>
              )}
              {success && (
                <div className="text-sm text-green-600 mt-2">{success}</div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
            <FormInput
              id="fullName"
              name="fullName"
              type="text"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              value={personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              className="w-full"
              error={nameError}
            />
            <FormInput
              id="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="أدخل بريدك الإلكتروني"
              defaultValue={user?.email || ''}
              className="w-full"
              disabled
            />
            <FormInput
              id="phone"
              name="phone"
              type="tel"
              label="رقم الهاتف"
              placeholder="أدخل رقم هاتفك"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full"
              error={phoneError}
            />
            {phoneAvailabilityStatus?.checking && (
              <div className="text-xs text-blue-500 mt-1 text-right flex items-center justify-end gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                جاري التحقق من توفر رقم الهاتف...
              </div>
            )}
            {phoneAvailabilityStatus && !phoneAvailabilityStatus.checking && phoneAvailabilityStatus.available && (
              <div className="text-xs text-green-500 mt-1 text-right flex items-center justify-end gap-1">
                <CheckCircle className="h-3 w-3" />
                رقم الهاتف متاح
              </div>
            )}
              <div className="w-full">
                <FormTextarea
                  id="bio"
                  name="bio"
                  label="نبذة شخصية"
                  placeholder="اكتب نبذة عن نفسك"
                  value={personalInfo.bio}
                  onChange={handlePersonalInfoChange}
                  className="w-full"
                  rows={3}
                  error={bioError}
                />
                {personalInfo.bio && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {personalInfo.bio.length}/200 حرف
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <UnifiedSelect
              value={selectedGovernorate}
              onChange={val => {
                setSelectedGovernorate(val);
                setSelectedCity('');
                setCustomCity('');
                setAddress(prev => ({ ...prev, government: EGYPT_GOVERNORATES.find(g => g.id === val)?.name || '' }));
              }}
              options={EGYPT_GOVERNORATES.map(g => ({ value: g.id, label: g.name }))}
              placeholder="اختر المحافظة"
              isSearchable
              searchPlaceholder="ابحث عن محافظة..."
              required
              label="المحافظة"
              className="w-full"
            />
            <UnifiedSelect
              value={selectedCity}
              onChange={val => {
                setSelectedCity(val);
                setCustomCity('');
                setAddress(prev => ({ ...prev, city: val === 'أخرى' ? '' : val }));
              }}
              options={cityOptions.map(city => ({ value: city, label: city }))}
              placeholder="اختر المدينة"
              isSearchable
              searchPlaceholder="ابحث عن مدينة..."
              required
              label="المدينة"
              disabled={!selectedGovernorate}
              className="w-full"
            />
            {selectedCity === 'أخرى' && (
              <FormInput
                type="text"
                value={customCity}
                onChange={e => {
                  setCustomCity(e.target.value);
                  setAddress(prev => ({ ...prev, city: e.target.value }));
                }}
                placeholder="أدخل اسم المدينة"
                size="md"
                className="mt-2 w-full"
                required
                label="مدينة أخرى"
              />
            )}
            <FormInput
              id="street"
              name="street"
              label="الشارع"
              placeholder="مثال: شارع التحرير، شارع محمد فريد"
              value={address.street}
              onChange={handleAddressChange}
              className="w-full"
            />
            <FormInput
              id="apartmentNumber"
              name="apartmentNumber"
              label="رقم الشقة"
              placeholder="مثال: شقة 12، الدور 3"
              value={address.apartmentNumber}
              onChange={handleAddressChange}
              className="w-full"
            />
            <FormTextarea
              id="additionalInformation"
              name="additionalInformation"
              label="معلومات إضافية"
              placeholder="أي تفاصيل إضافية..."
              value={address.additionalInformation}
              onChange={handleAddressChange}
              className="w-full"
              rows={2}
            />
        </div>
        <div className="flex justify-end mt-8">
          <Button 
            type="submit"
            className="bg-deep-teal text-white font-semibold py-3 px-8 rounded-xl hover:bg-deep-teal/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={saving || hasValidationErrors()}
          >
            {saving ? 'جاري التحديث...' : 'تحديث المعلومات'}
          </Button>
        </div>
        </form>
      </SettingsCard>
    </SettingsSection>
  );

  const renderVerificationCenter = () => (
    !isAdmin ? (
      <VerificationCenter />
    ) : (
      <SettingsSection title="مركز التحقق" description="التحقق من هويتك لفتح الميزات الإضافية وزيادة الثقة" icon={Shield}>
        <SettingsCard title="التحقق من الهوية">
          <div className="p-6 text-text-secondary text-center">
            المسؤولون لا يحتاجون إلى التحقق من الهوية.
          </div>
        </SettingsCard>
      </SettingsSection>
    )
  );

  const renderAccountManagement = () => (
    <SettingsSection
      title="إدارة الحساب"
      description="إدارة أمان حسابك وبياناتك"
      icon={SettingsIcon}
    >
      <SettingsCard title="الأمان والبيانات">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-deep-teal/10 p-3 rounded-full text-deep-teal">
                <Key size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">تغيير كلمة المرور</h4>
                <p className="text-text-secondary text-sm mt-1">حافظ على أمان حسابك بكلمة مرور قوية.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white"
              onClick={() => setShowPasswordModal(true)}
            >
              تغيير
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-red-800">حذف الحساب</h4>
                <p className="text-red-600 text-sm mt-1">حذف حسابك وبياناتك نهائياً.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => setShowDeleteModal(true)}
            >
              حذف
            </Button>
          </div>
        </div>
      </SettingsCard>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" dir="rtl">
            <button 
              className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-2xl" 
              onClick={() => setShowPasswordModal(false)}
            >
              ×
            </button>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Key className="text-deep-teal" size={20} />
                <span className="font-bold text-deep-teal">تغيير كلمة المرور</span>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormInput
                type="password"
                name="currentPassword"
                label="كلمة المرور الحالية"
                placeholder="أدخل كلمة المرور الحالية"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                className="w-full"
              />
              <FormInput
                type="password"
                name="newPassword"
                label="كلمة المرور الجديدة"
                placeholder="أدخل كلمة المرور الجديدة"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
                className="w-full"
              />
              <FormInput
                type="password"
                name="confirmPassword"
                label="تأكيد كلمة المرور الجديدة"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmPassword}
                className="w-full"
              />
              <div className="flex gap-2 mt-6">
                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-deep-teal text-white flex-1"
                >
                  {changingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" dir="rtl">
            <button 
              className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-2xl" 
              onClick={() => setShowDeleteModal(false)}
            >
              ×
            </button>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="text-red-600" size={20} />
                <span className="font-bold text-red-600">حذف الحساب</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-800 text-sm">
                  <strong>تحذير:</strong> حذف الحساب إجراء نهائي لا يمكن التراجع عنه. 
                  سيتم حذف جميع بياناتك وبيانات الخدمات المرتبطة بحسابك نهائياً.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="bg-red-600 text-white hover:bg-red-700 flex-1"
                >
                  {deletingAccount ? 'جاري الحذف...' : 'تأكيد الحذف'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SettingsSection>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountInformation();
      case 'verification':
        return renderVerificationCenter();
      case 'management':
        return renderAccountManagement();
      default:
        return renderAccountInformation();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream" dir="rtl">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-text-secondary">جاري التحميل...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream" dir="rtl">
      <Header />
      <div className="flex pt-20">
        <SettingsNavigation
          items={navigationItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">{success}</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}
            
            {renderContent()}

            {/* Targeted Leads for Premium Providers */}
            {/* Removed as per new UX decision */}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage; 