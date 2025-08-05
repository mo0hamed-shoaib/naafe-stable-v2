import React, { useState } from 'react';
import { X, Calendar, Clock, Repeat, Plus } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (availabilityData: AvailabilityData) => void;
  loading?: boolean;
  initialDate?: string;
  initialTimeSlot?: string;
}

interface AvailabilityData {
  dates: string[];
  timeSlots: string[];
  customTimeRanges?: Array<{
    startTime: string;
    endTime: string;
  }>;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek: number[];
    endDate: string;
  };
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialDate = '',
  initialTimeSlot = 'morning'
}) => {
  const [formData, setFormData] = useState<AvailabilityData>({
    dates: initialDate ? [initialDate] : [new Date().toISOString().split('T')[0]],
    timeSlots: [initialTimeSlot],
    isRecurring: false
  });

  const [errors, setErrors] = useState<Partial<AvailabilityData>>({});

  const timeSlotOptions = [
    { value: 'morning', label: 'صباحاً (8:00 ص - 12:00 م)' },
    { value: 'afternoon', label: 'ظهراً (12:00 م - 4:00 م)' },
    { value: 'evening', label: 'مساءً (4:00 م - 8:00 م)' },
    { value: 'full_day', label: 'يوم كامل (8:00 ص - 8:00 م)' },
    { value: 'custom', label: 'وقت مخصص' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'يومياً' },
    { value: 'weekly', label: 'أسبوعياً' },
    { value: 'monthly', label: 'شهرياً' }
  ];

  const dayOptions = [
    { value: 0, label: 'الأحد' },
    { value: 1, label: 'الاثنين' },
    { value: 2, label: 'الثلاثاء' },
    { value: 3, label: 'الأربعاء' },
    { value: 4, label: 'الخميس' },
    { value: 5, label: 'الجمعة' },
    { value: 6, label: 'السبت' }
  ];

  const validateForm = () => {
    const newErrors: Partial<AvailabilityData> = {};

    if (!formData.isRecurring && formData.dates.length === 0) {
      newErrors.dates = 'يجب اختيار تاريخ واحد على الأقل';
    }
    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = 'يجب اختيار وقت واحد على الأقل';
    }
    if (formData.isRecurring && (!formData.recurringPattern?.frequency || formData.recurringPattern?.daysOfWeek.length === 0)) {
      newErrors.recurringPattern = 'يجب تحديد نمط التكرار';
    }

    // Validate custom time ranges
    if (formData.timeSlots.includes('custom') && formData.customTimeRanges) {
      for (let i = 0; i < formData.customTimeRanges.length; i++) {
        const timeRange = formData.customTimeRanges[i];
        if (!timeRange.startTime || !timeRange.endTime) {
          newErrors.customTimeRanges = 'يجب تحديد وقت البداية والنهاية لجميع الأوقات المخصصة';
          break;
        }
      }
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

  const handleDateAdd = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, '']
    }));
  };

  const handleDateRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const handleDateChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => i === index ? value : date)
    }));
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData(prev => {
      let newTimeSlots: string[];
      let newCustomTimeRanges = prev.customTimeRanges || [];
      
      if (timeSlot === 'custom') {
        // If selecting custom, clear all preset slots
        newTimeSlots = ['custom'];
        newCustomTimeRanges = [{ startTime: '', endTime: '' }];
      } else {
        // If selecting a preset slot, remove custom and add the preset
        if (prev.timeSlots.includes(timeSlot)) {
          // Remove the slot if already selected
          newTimeSlots = prev.timeSlots.filter(t => t !== timeSlot);
        } else {
          // Add the preset slot and remove custom
          newTimeSlots = prev.timeSlots.filter(t => t !== 'custom').concat(timeSlot);
        }
        newCustomTimeRanges = [];
      }
      
      return {
        ...prev,
        timeSlots: newTimeSlots,
        customTimeRanges: newCustomTimeRanges
      };
    });
  };

  const handleDayToggle = (day: number) => {
    if (!formData.recurringPattern) return;
    
    setFormData(prev => ({
      ...prev,
      recurringPattern: {
        ...prev.recurringPattern!,
        daysOfWeek: prev.recurringPattern!.daysOfWeek.includes(day)
          ? prev.recurringPattern!.daysOfWeek.filter(d => d !== day)
          : [...prev.recurringPattern!.daysOfWeek, day]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-deep-teal" />
            <h2 className="text-xl font-bold text-deep-teal">إضافة أوقات توفر</h2>
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
          {/* Recurring Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="w-4 h-4 text-deep-teal border-gray-300 rounded focus:ring-deep-teal"
            />
            <label htmlFor="isRecurring" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Repeat className="h-4 w-4" />
              تكرار أسبوعي
            </label>
          </div>

          {!formData.isRecurring ? (
            /* Specific Dates */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-deep-teal">التواريخ المحددة</h3>
              {formData.dates.map((date, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FormInput
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleDateRemove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleDateAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة تاريخ
              </Button>
            </div>
          ) : (
            /* Recurring Pattern */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-deep-teal">نمط التكرار</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التكرار
                </label>
                <FormSelect
                  value={formData.recurringPattern?.frequency || 'weekly'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    recurringPattern: {
                      ...prev.recurringPattern!,
                      frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                    }
                  }))}
                  options={frequencyOptions}
                />
              </div>

              {formData.recurringPattern?.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أيام الأسبوع
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayOptions.map(day => (
                      <label key={day.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.recurringPattern?.daysOfWeek.includes(day.value) || false}
                          onChange={() => handleDayToggle(day.value)}
                          className="w-4 h-4 text-deep-teal border-gray-300 rounded focus:ring-deep-teal"
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الانتهاء
                </label>
                <FormInput
                  type="date"
                  value={formData.recurringPattern?.endDate || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    recurringPattern: {
                      ...prev.recurringPattern!,
                      endDate: e.target.value
                    }
                  }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

                     {/* Time Slots */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-deep-teal">أوقات التوفر</h3>
                           <div className="grid grid-cols-2 gap-3">
                {timeSlotOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.timeSlots.includes(option.value)}
                      onChange={() => handleTimeSlotToggle(option.value)}
                      className="w-4 h-4 text-deep-teal border-gray-300 rounded focus:ring-deep-teal"
                    />
                    <Clock className="h-4 w-4 text-deep-teal" />
                    <span className="text-sm text-gray-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
           </div>

           {/* Custom Time Ranges */}
           {formData.timeSlots.includes('custom') && formData.customTimeRanges && (
             <div className="space-y-4">
               <h3 className="text-lg font-semibold text-deep-teal">الأوقات المخصصة</h3>
               {formData.customTimeRanges.map((timeRange, index) => (
                 <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       وقت البداية
                     </label>
                     <FormInput
                       type="time"
                       value={timeRange.startTime}
                       onChange={(e) => {
                         const newCustomTimeRanges = [...(formData.customTimeRanges || [])];
                         newCustomTimeRanges[index] = { ...timeRange, startTime: e.target.value };
                         setFormData(prev => ({ ...prev, customTimeRanges: newCustomTimeRanges }));
                       }}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       وقت النهاية
                     </label>
                     <FormInput
                       type="time"
                       value={timeRange.endTime}
                       onChange={(e) => {
                         const newCustomTimeRanges = [...(formData.customTimeRanges || [])];
                         newCustomTimeRanges[index] = { ...timeRange, endTime: e.target.value };
                         setFormData(prev => ({ ...prev, customTimeRanges: newCustomTimeRanges }));
                       }}
                     />
                   </div>
                 </div>
               ))}
             </div>
           )}

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
              إضافة التوفر
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvailabilityModal; 