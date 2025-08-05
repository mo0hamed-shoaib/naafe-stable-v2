import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import FormSelect from './FormSelect';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservationData: ReservationData) => void;
  loading?: boolean;
  initialDate?: string;
  initialTimeSlot?: string;
}

interface ReservationData {
  date: string;
  timeSlot: string;
  customTimeRange?: {
    startTime: string;
    endTime: string;
  };
  title: string;
  description: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  estimatedDuration: number;
  estimatedCost: number;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialDate = '',
  initialTimeSlot = 'morning'
}) => {
  const [formData, setFormData] = useState<ReservationData>({
    date: initialDate,
    timeSlot: initialTimeSlot,
    title: '',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
    estimatedDuration: 1,
    estimatedCost: 0
  });

  const [errors, setErrors] = useState<Partial<ReservationData>>({});

  const timeSlotOptions = [
    { value: 'morning', label: 'صباحاً (8:00 ص - 12:00 م)' },
    { value: 'afternoon', label: 'ظهراً (12:00 م - 4:00 م)' },
    { value: 'evening', label: 'مساءً (4:00 م - 8:00 م)' },
    { value: 'full_day', label: 'يوم كامل (8:00 ص - 8:00 م)' },
    { value: 'custom', label: 'وقت مخصص' }
  ];

  const durationOptions = [
    { value: 0.5, label: '30 دقيقة' },
    { value: 1, label: 'ساعة واحدة' },
    { value: 1.5, label: 'ساعة ونصف' },
    { value: 2, label: 'ساعتين' },
    { value: 3, label: '3 ساعات' },
    { value: 4, label: '4 ساعات' },
    { value: 6, label: '6 ساعات' },
    { value: 8, label: '8 ساعات' }
  ];

  const validateForm = () => {
    const newErrors: Partial<ReservationData> = {};

    if (!formData.date) {
      newErrors.date = 'التاريخ مطلوب';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الحجز مطلوب';
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'اسم العميل مطلوب';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'رقم الهاتف مطلوب';
    }
    if (formData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'البريد الإلكتروني غير صحيح';
    }
    if (formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'التكلفة يجب أن تكون إيجابية';
    }
    if (formData.timeSlot === 'custom' && (!formData.customTimeRange?.startTime || !formData.customTimeRange?.endTime)) {
      newErrors.customTimeRange = 'يجب تحديد وقت البداية والنهاية';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ReservationData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // If changing timeSlot to custom, clear any preset selections
      if (field === 'timeSlot' && value === 'custom') {
        newData.customTimeRange = { startTime: '', endTime: '' };
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-deep-teal" />
            <h2 className="text-xl font-bold text-deep-teal">إضافة حجز جديد</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                     {/* Date and Time */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 التاريخ
               </label>
               <FormInput
                 type="date"
                 value={formData.date}
                 onChange={(e) => handleInputChange('date', e.target.value)}
                 error={errors.date}
                 min={new Date().toISOString().split('T')[0]}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 الوقت
               </label>
               <FormSelect
                 value={formData.timeSlot}
                 onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                 options={timeSlotOptions}
                 error={errors.timeSlot}
               />
             </div>
           </div>

           {/* Custom Time Range */}
           {formData.timeSlot === 'custom' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   وقت البداية
                 </label>
                 <FormInput
                   type="time"
                   value={formData.customTimeRange?.startTime || ''}
                   onChange={(e) => handleInputChange('customTimeRange', { 
                     ...formData.customTimeRange, 
                     startTime: e.target.value 
                   })}
                   error={errors.customTimeRange}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   وقت النهاية
                 </label>
                 <FormInput
                   type="time"
                   value={formData.customTimeRange?.endTime || ''}
                   onChange={(e) => handleInputChange('customTimeRange', { 
                     ...formData.customTimeRange, 
                     endTime: e.target.value 
                   })}
                   error={errors.customTimeRange}
                 />
               </div>
             </div>
           )}

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الحجز
              </label>
              <FormInput
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="مثال: تنظيف منزل، صيانة كهربائية..."
                error={errors.title}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الخدمة
              </label>
              <FormTextarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="وصف مفصل للخدمة المطلوبة..."
                rows={3}
              />
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-teal flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات العميل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل
                </label>
                <FormInput
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="اسم العميل"
                  error={errors.clientName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <FormInput
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="رقم الهاتف"
                  error={errors.clientPhone}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني (اختياري)
              </label>
              <FormInput
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="البريد الإلكتروني"
                error={errors.clientEmail}
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-deep-teal flex items-center gap-2">
              <Clock className="h-5 w-5" />
              تفاصيل الخدمة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة المتوقعة
                </label>
                <FormSelect
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', parseFloat(e.target.value))}
                  options={durationOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التكلفة المتوقعة (جنيه)
                </label>
                <FormInput
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  error={errors.estimatedCost}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات إضافية
            </label>
            <FormTextarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية أو تفاصيل مهمة..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              إضافة الحجز
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal; 