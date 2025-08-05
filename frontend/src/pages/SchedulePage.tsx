import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Filter, Download, Plus, Edit, Trash, Clock, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BaseCard from '../components/ui/BaseCard';
import Button from '../components/ui/Button';
import ScheduleCalendar from '../components/ui/ScheduleCalendar';
import ReservationModal from '../components/ui/ReservationModal';
import AvailabilityModal from '../components/ui/AvailabilityModal';
import useSchedule from '../hooks/useSchedule';
import Modal from '../admin/components/UI/Modal';
import Toast from '../components/ui/Toast';

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

const SchedulePage: React.FC = () => {
  const { user, accessToken } = useAuth();
  const { schedule, loading, error, refetch } = useSchedule(user?.id);
  
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [reservationData, setReservationData] = useState({ date: '', timeSlot: 'morning' });
  const [availabilityData, setAvailabilityData] = useState({ date: '', timeSlot: 'morning' });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter schedule based on selected status
  const filteredSchedule = selectedStatus === 'all' 
    ? schedule 
    : schedule.filter(item => item.status === selectedStatus);

  const handleItemClick = (item: ScheduleItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleItemDelete = async (itemId: string) => {
    if (!accessToken) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/schedule/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (res.ok) {
        setToast({ type: 'success', message: 'تم حذف العنصر بنجاح' });
        await refetch();
      } else {
        const data = await res.json();
        setToast({ type: 'error', message: data.error?.message || 'فشل في حذف العنصر' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'حدث خطأ أثناء حذف العنصر' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddAvailability = (date: string, timeSlot: string) => {
    setAvailabilityData({ date, timeSlot });
    setShowAvailabilityModal(true);
  };

  const handleAddReservation = (date: string, timeSlot: string) => {
    setReservationData({ date, timeSlot });
    setShowReservationModal(true);
  };

  const handleAvailabilitySubmit = async (data: any) => {
    if (!accessToken) return;
    
    setActionLoading(true);
    try {
      // Prepare data for submission
      const submitData = {
        ...data,
        customTimeRanges: data.timeSlots.includes('custom') ? data.customTimeRanges : undefined
      };
      
      const res = await fetch('/api/schedule/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(submitData)
      });
      
      if (res.ok) {
        setToast({ type: 'success', message: 'تم إضافة أوقات التوفر بنجاح' });
        setShowAvailabilityModal(false);
        await refetch();
      } else {
        const errorData = await res.json();
        setToast({ type: 'error', message: errorData.error?.message || 'فشل في إضافة أوقات التوفر' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'حدث خطأ أثناء إضافة أوقات التوفر' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReservationSubmit = async (data: any) => {
    if (!accessToken) return;
    
    setActionLoading(true);
    try {
      // Prepare data for submission
      const submitData = {
        ...data,
        customTimeRange: data.timeSlot === 'custom' ? data.customTimeRange : undefined
      };
      
      const res = await fetch('/api/schedule/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(submitData)
      });
      
      if (res.ok) {
        setToast({ type: 'success', message: 'تم إضافة الحجز بنجاح' });
        setShowReservationModal(false);
        // Reset form data
        setReservationData({ date: '', timeSlot: 'morning' });
        await refetch();
      } else {
        const errorData = await res.json();
        setToast({ type: 'error', message: errorData.error?.message || 'فشل في إضافة الحجز' });
      }
    } catch (error) {
      console.error('Reservation error:', error);
      setToast({ type: 'error', message: 'حدث خطأ أثناء إضافة الحجز' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export schedule');
  };

  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'available', label: 'متاح' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'confirmed', label: 'مؤكد' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'cancelled', label: 'ملغي' }
  ];

  if (!user || !user.roles.includes('provider')) {
    return (
      <div className="min-h-screen flex flex-col bg-warm-cream">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-deep-teal text-lg text-center">
            يجب أن تكون مقدم خدمات للوصول إلى صفحة الجدول.<br />
            <Button variant="primary" className="mt-4" onClick={() => window.history.back()}>
              العودة
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-deep-teal" />
              <h1 className="text-3xl font-bold text-deep-teal">جدول مواعيدي</h1>
            </div>
            <p className="text-gray-700">
              إدارة مواعيدك وتتبع الخدمات المقدمة والحجوزات
            </p>
          </div>

          {/* Controls */}
          <BaseCard className="mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-deep-teal" />
                  <span className="text-sm font-medium text-deep-teal">تصفية:</span>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-deep-teal focus:border-deep-teal"
                  aria-label="تصفية حسب الحالة"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAvailabilityModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة توفر
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowReservationModal(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  إضافة حجز
                </Button>
              </div>
            </div>
          </BaseCard>

          {/* Schedule Calendar */}
          <BaseCard>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal"></div>
                <span className="mr-3 text-deep-teal">جاري تحميل الجدول...</span>
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <ScheduleCalendar
                schedule={filteredSchedule}
                mode="editable"
                onItemClick={handleItemClick}
                onItemDelete={handleItemDelete}
                onAddAvailability={handleAddAvailability}
                onAddReservation={handleAddReservation}
                className="w-full"
              />
            )}
          </BaseCard>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <BaseCard className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {schedule.filter(item => item.type === 'available').length}
              </div>
              <div className="text-sm text-gray-900 font-medium">متاح</div>
            </BaseCard>
            
            <BaseCard className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {schedule.filter(item => item.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-900 font-medium">في الانتظار</div>
            </BaseCard>
            
            <BaseCard className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {schedule.filter(item => item.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-900 font-medium">مؤكد</div>
            </BaseCard>
            
            <BaseCard className="text-center">
              <div className="text-2xl font-bold text-deep-teal mb-2">
                {schedule.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-900 font-medium">مكتمل</div>
            </BaseCard>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? "تفاصيل الموعد" : "إضافة موعد جديد"}
        size="md"
      >
        <div className="space-y-4">
          {selectedItem ? (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <p className="text-sm text-gray-900">{selectedItem.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                  <p className="text-sm text-gray-900">
                    {selectedItem.type === 'available' ? 'متاح' : 
                     selectedItem.type === 'reserved' ? 'حجز' : 'خدمة'}
                  </p>
                </div>
              </div>
              
              {selectedItem.title && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <p className="text-sm text-gray-900">{selectedItem.title}</p>
                </div>
              )}
              
              {selectedItem.seekerName && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العميل</label>
                  <p className="text-sm text-gray-900">{selectedItem.seekerName}</p>
                </div>
              )}
              
              {selectedItem.reservation && (
                <div className="space-y-2">
                  <h4 className="font-medium text-deep-teal">تفاصيل الحجز</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">الهاتف:</span>
                      <p>{selectedItem.reservation.clientPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">المدة:</span>
                      <p>{selectedItem.reservation.estimatedDuration} ساعة</p>
                    </div>
                    <div>
                      <span className="text-gray-600">التكلفة:</span>
                      <p>{selectedItem.reservation.estimatedCost} جنيه</p>
                    </div>
                  </div>
                  {selectedItem.reservation.notes && (
                    <div>
                      <span className="text-gray-600">ملاحظات:</span>
                      <p className="text-sm">{selectedItem.reservation.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-secondary mb-4">
                اختر موعداً من الجدول لعرض تفاصيله
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setSelectedItem(null);
              }}
            >
              إغلاق
            </Button>
          </div>
        </div>
      </Modal>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSubmit={handleAvailabilitySubmit}
        loading={actionLoading}
        initialDate={availabilityData.date}
        initialTimeSlot={availabilityData.timeSlot}
      />

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onSubmit={handleReservationSubmit}
        loading={actionLoading}
        initialDate={reservationData.date}
        initialTimeSlot={reservationData.timeSlot}
      />

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SchedulePage; 