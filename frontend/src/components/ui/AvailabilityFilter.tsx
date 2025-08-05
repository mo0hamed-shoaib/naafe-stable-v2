import { Calendar, Clock } from 'lucide-react';

interface AvailabilityFilterProps {
  selectedDays: string[];
  selectedTimeSlots: string[];
  onDaysChange: (days: string[]) => void;
  onTimeSlotsChange: (timeSlots: string[]) => void;
  className?: string;
}

const AvailabilityFilter = ({
  selectedDays,
  selectedTimeSlots,
  onDaysChange,
  onTimeSlotsChange,
  className = ''
}: AvailabilityFilterProps) => {
  const days = [
    { value: 'Saturday', label: 'السبت' },
    { value: 'Sunday', label: 'الأحد' },
    { value: 'Monday', label: 'الاثنين' },
    { value: 'Tuesday', label: 'الثلاثاء' },
    { value: 'Wednesday', label: 'الأربعاء' },
    { value: 'Thursday', label: 'الخميس' },
    { value: 'Friday', label: 'الجمعة' }
  ];

  const timeSlots = [
    { value: 'Morning', label: 'صباحاً' },
    { value: 'Afternoon', label: 'ظهراً' },
    { value: 'Evening', label: 'مساءً' }
  ];

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    if (selectedTimeSlots.includes(timeSlot)) {
      onTimeSlotsChange(selectedTimeSlots.filter(t => t !== timeSlot));
    } else {
      onTimeSlotsChange([...selectedTimeSlots, timeSlot]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Days Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
          <Calendar className="h-4 w-4" />
          أيام العمل
        </label>
        <div className="grid grid-cols-2 gap-3">
          {days.map((day) => (
            <label key={day.value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-light-cream transition-colors">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary focus:ring-2 focus:ring-deep-teal/20"
                checked={selectedDays.includes(day.value)}
                onChange={() => handleDayToggle(day.value)}
              />
              <span className="text-sm text-text-secondary font-medium">{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Slots Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
          <Clock className="h-4 w-4" />
          أوقات العمل
        </label>
        <div className="space-y-2">
          {timeSlots.map((timeSlot) => (
            <label key={timeSlot.value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-light-cream transition-colors">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary focus:ring-2 focus:ring-deep-teal/20"
                checked={selectedTimeSlots.includes(timeSlot.value)}
                onChange={() => handleTimeSlotToggle(timeSlot.value)}
              />
              <span className="text-sm text-text-secondary font-medium">{timeSlot.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityFilter; 