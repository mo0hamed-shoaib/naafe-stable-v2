import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

interface ScheduleData {
  schedule: ScheduleItem[];
}

interface UseScheduleReturn {
  schedule: ScheduleItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useSchedule = (providerId?: string): UseScheduleReturn => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useAuth();

  const fetchSchedule = useCallback(async () => {
    if (!accessToken || !(providerId || user?.id)) {
      setError('No access token or provider ID available');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Get current month range
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const res = await fetch(`/api/schedule/${providerId || user?.id}?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch schedule');
      const data: { success: boolean; data: { schedule: ScheduleItem[] } } = await res.json();
      console.log('Received schedule data:', data.data.schedule);
      setSchedule(data.data.schedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, [accessToken, providerId, user?.id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule
  };
};

export default useSchedule; 