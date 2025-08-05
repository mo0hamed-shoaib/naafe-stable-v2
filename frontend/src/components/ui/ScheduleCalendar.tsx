import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, XCircle, Plus, Edit, Trash, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ScheduleItem {
  id: string;
  date: string;
  timeSlot: string;
  customTimeRange?: {
    startTime: string;
    endTime: string;
  };
  status: 'available' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: 'available' | 'reserved' | 'service';
  title: string;
  description?: string;
  seekerName?: string;
  location?: string;
  offer?: string;
  jobRequest?: string;
  reservation?: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    notes: string;
    estimatedDuration: number;
    estimatedCost: number;
  };
}

interface ScheduleCalendarProps {
  schedule: ScheduleItem[];
  mode: 'readonly' | 'editable';
  onItemClick?: (item: ScheduleItem) => void;
  onItemDelete?: (itemId: string) => void;
  onAddAvailability?: (date: string, timeSlot: string) => void;
  onAddReservation?: (date: string, timeSlot: string) => void;
  className?: string;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  schedule,
  mode = 'readonly',
  onItemClick,
  onItemDelete,
  onAddAvailability,
  onAddReservation,
  className = ''
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 6 }); // Saturday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 6 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getStatusIcon = (status: string, type: string) => {
    if (type === 'available') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === 'available') {
      return 'bg-green-100 border-green-300 text-green-900';
    }
    
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'completed':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getTimeSlotLabel = (timeSlot: string, customTimeRange?: { startTime: string; endTime: string }) => {
    if (timeSlot === 'custom' && customTimeRange) {
      const formatTime12hr = (time24: string) => {
        const [hours, minutes] = time24.split(':').map(Number);
        const hour12 = ((hours % 12) || 12);
        const ampm = hours < 12 ? 'ص' : 'م';
        return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      };
      
      return `${formatTime12hr(customTimeRange.startTime)} - ${formatTime12hr(customTimeRange.endTime)}`;
    }
    
    switch (timeSlot) {
      case 'morning':
        return '8:00 ص - 12:00 م';
      case 'afternoon':
        return '12:00 م - 4:00 م';
      case 'evening':
        return '4:00 م - 8:00 م';
      case 'full_day':
        return '8:00 ص - 8:00 م';
      default:
        return timeSlot;
    }
  };

  const getItemsForDate = (date: Date) => {
    return schedule.filter(item => isSameDay(parseISO(item.date), date));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="الشهر السابق"
        >
          <Calendar className="h-5 w-5 text-deep-teal" />
        </button>
        
        <h3 className="text-lg font-semibold text-deep-teal">
          {format(currentMonth, 'MMMM yyyy', { locale: ar })}
        </h3>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="الشهر التالي"
        >
          <Calendar className="h-5 w-5 text-deep-teal" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 p-2 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center py-2">
            <span className="text-sm font-medium text-deep-teal">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {days.map((day, index) => {
          const dayItems = getItemsForDate(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          const isTodayDay = isToday(day);
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                isTodayDay 
                  ? 'bg-deep-teal/10 border-deep-teal' 
                  : isCurrentMonthDay 
                    ? 'bg-white border-gray-200 hover:bg-gray-50' 
                    : 'bg-gray-100 border-gray-300'
              }`}
              onClick={() => handleDateClick(day)}
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <div className={`text-sm font-medium ${
                  isTodayDay 
                    ? 'text-deep-teal' 
                    : isCurrentMonthDay 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Schedule Items */}
              <div className="space-y-1">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-1 rounded text-xs cursor-pointer transition-colors ${
                      getStatusColor(item.status, item.type)
                    } ${mode === 'editable' ? 'hover:bg-opacity-80' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick?.(item);
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {getStatusIcon(item.status, item.type)}
                      <span className="font-medium truncate">
                        {item.timeSlot === 'custom' && item.customTimeRange && 
                         console.log('Custom time item:', item.timeSlot, item.customTimeRange)}
                        {getTimeSlotLabel(item.timeSlot, item.customTimeRange)}
                      </span>
                    </div>
                    <div className="truncate font-medium">
                      {item.type === 'available' ? 'موعد متاح' : 
                       item.type === 'reserved' ? (item.title || 'حجز') : 
                       item.type === 'service' ? (item.title || 'خدمة') : 'موعد'}
                    </div>
                    {item.seekerName && (
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <User className="h-3 w-3" />
                        <span className="truncate">{item.seekerName}</span>
                      </div>
                    )}
                    {mode === 'editable' && onItemDelete && item.type !== 'service' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemDelete(item.id);
                        }}
                        className="mt-1 text-red-600 hover:text-red-800 text-xs"
                        aria-label="حذف"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Add buttons for editable mode */}
                {mode === 'editable' && isCurrentMonthDay && (
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddAvailability?.(format(day, 'yyyy-MM-dd'), 'morning');
                      }}
                      className="p-1 bg-green-100 text-green-900 rounded text-xs hover:bg-green-200 font-medium"
                      title="إضافة توفر صباحاً"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddReservation?.(format(day, 'yyyy-MM-dd'), 'morning');
                      }}
                      className="p-1 bg-blue-100 text-blue-900 rounded text-xs hover:bg-blue-200 font-medium"
                      title="إضافة حجز"
                    >
                      <CalendarDays className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-900 font-medium">متاح</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-gray-900 font-medium">في الانتظار</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-gray-900 font-medium">مكتمل</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-gray-900 font-medium">ملغي</span>
          </div>
          {mode === 'editable' && (
            <>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-600" />
                <span className="text-gray-900 font-medium">إضافة توفر</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <span className="text-gray-900 font-medium">إضافة حجز</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar; 