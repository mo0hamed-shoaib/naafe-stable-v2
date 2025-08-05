import React from 'react';
import { Users, Wrench, DollarSign, TrendingUp, TrendingDown, MessageSquare, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Activity interface
interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  icon: string;
  color: string;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// API functions
const fetchDashboardStats = async (token: string | null) => {
  const res = await fetch('/api/admin/stats', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل إحصائيات لوحة التحكم');
  const json = await res.json();
  if (!json.success || !json.data) throw new Error('الاستجابة من الخادم غير متوقعة');
  return json.data;
};

const fetchUserGrowthData = async (token: string | null) => {
  const res = await fetch('/api/admin/charts/user-growth', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل بيانات نمو المستخدمين');
  const json = await res.json();
  return json.success ? json.data : [];
};

const fetchServiceCategoriesData = async (token: string | null) => {
  const res = await fetch('/api/admin/charts/service-categories', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل بيانات فئات الخدمات');
  const json = await res.json();
  return json.success ? json.data : { labels: [], data: [] };
};

const fetchRevenueData = async (token: string | null) => {
  const res = await fetch('/api/admin/charts/revenue', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل بيانات الإيرادات');
  const json = await res.json();
  return json.success ? json.data : [];
};

const fetchRecentActivity = async (token: string | null) => {
  const res = await fetch('/api/admin/activity', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل النشاط الأخير');
  const json = await res.json();
  return json.success ? json.data : [];
};

const AdminOverview: React.FC = () => {
  const { accessToken } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', accessToken],
    queryFn: () => fetchDashboardStats(accessToken),
    enabled: !!accessToken,
  });

  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth', accessToken],
    queryFn: () => fetchUserGrowthData(accessToken),
    enabled: !!accessToken,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['service-categories', accessToken],
    queryFn: () => fetchServiceCategoriesData(accessToken),
    enabled: !!accessToken,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data', accessToken],
    queryFn: () => fetchRevenueData(accessToken),
    enabled: !!accessToken,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity', accessToken],
    queryFn: () => fetchRecentActivity(accessToken),
    enabled: !!accessToken,
  });

  const summaryData = [
    {
      title: "إجمالي المستخدمين",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      iconColor: "text-soft-teal",
      change: stats?.userGrowth || 0,
      changeType: stats?.userGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "الخدمات النشطة", 
      value: stats?.activeServices?.toLocaleString() || "0",
      icon: Wrench,
      iconColor: "text-soft-teal",
      change: stats?.serviceGrowth || 0,
      changeType: stats?.serviceGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "طلبات الخدمة النشطة",
      value: stats?.activeRequests?.toLocaleString() || "0",
      icon: FileText,
      iconColor: "text-soft-teal",
      change: stats?.requestGrowth || 0,
      changeType: stats?.requestGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "الإيرادات (شهرياً)",
      value: `EGP ${stats?.monthlyRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "text-soft-teal",
      change: stats?.revenueGrowth || 0,
      changeType: stats?.revenueGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "البلاغات المعلقة",
      value: stats?.pendingComplaints?.toLocaleString() || "0",
      icon: MessageSquare,
      iconColor: "text-red-500",
      change: 0,
      changeType: 'neutral'
    }
  ];

  // Chart data for user growth
  const userGrowthChartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    datasets: [
      {
        label: 'المستخدمين الجدد',
        data: userGrowthData || Array(12).fill(0),
        borderColor: '#2D5D4F',
        backgroundColor: 'rgba(45, 93, 79, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for service categories
  // Filter out categories with 0 services for the chart (Chart.js doesn't show 0 values in doughnut)
  const chartLabels = categoriesData?.labels || [];
  const chartData = categoriesData?.data || [];
  
  // Filter to only show categories with services > 0
  const filteredData = chartLabels.map((label: string, index: number) => ({
    label,
    data: chartData[index] || 0
  })).filter((item: { label: string; data: number }) => item.data > 0);
  
  const serviceCategoriesChartData = {
    labels: filteredData.map((item: { label: string; data: number }) => item.label),
    datasets: [
      {
        data: filteredData.map((item: { label: string; data: number }) => item.data),
        backgroundColor: [
          '#2D5D4F',
          '#F5A623',
          '#50958A',
          '#8BC34A',
          '#FF9800',
          '#9C27B0',
          '#E91E63',
          '#3F51B5',
          '#009688',
          '#FF5722',
          '#795548',
          '#607D8B',
          '#FFC107',
          '#4CAF50',
          '#2196F3',
          '#9E9E9E',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    datasets: [
      {
        label: 'الإيرادات الشهرية',
        data: revenueData || Array(12).fill(0),
        backgroundColor: 'rgba(245, 166, 35, 0.8)',
        borderColor: '#F5A623',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Cairo',
            size: 12,
          },
          color: '#2D5D4F',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(45, 93, 79, 0.1)',
        },
        ticks: {
          font: {
            family: 'Cairo',
            size: 10,
          },
          color: '#2D5D4F',
        },
      },
      x: {
        grid: {
          color: 'rgba(45, 93, 79, 0.1)',
        },
        ticks: {
          font: {
            family: 'Cairo',
            size: 10,
          },
          color: '#2D5D4F',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Cairo',
            size: 10,
          },
          color: '#2D5D4F',
          usePointStyle: true,
          padding: 8,
        },
        display: true,
      },
    },
  };

  const formatTime = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} ساعة سابقاً`;
    }
    return `${minutes} دقيقة سابقاً`;
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-lg text-deep-teal">جاري التحميل...</div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'لوحة التحكم' }]} />
      <h2 className="text-4xl font-bold text-deep-teal">نظرة عامة</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-light-cream rounded-2xl p-8 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-[#f5a623]/10">
                  <item.icon className="h-7 w-7 text-[#f5a623]" />
                </div>
                <span className="text-lg font-bold text-[#1a3d32]">{item.title}</span>
              </div>
              {item.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(item.change)}%</span>
                </div>
              )}
            </div>
            <p className="text-3xl font-extrabold text-[#1a3d32] mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-deep-teal mb-4">نمو المستخدمين</h3>
          {userGrowthLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal"></div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={userGrowthChartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Service Categories Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-deep-teal mb-4">توزيع فئات الخدمات والطلبات</h3>
          {categoriesLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal"></div>
            </div>
          ) : (
            <>
              <div className="h-64">
                <Doughnut data={serviceCategoriesChartData} options={doughnutOptions} />
              </div>
              {/* Categories Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">ملخص جميع الفئات (خدمات + طلبات):</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {chartLabels.map((label: string, index: number) => {
                    const count = chartData[index] || 0;
                    return (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-gray-600 truncate">{label}</span>
                        <span className={`font-medium ${count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {count} خدمة/طلب
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-deep-teal mb-4">الإيرادات الشهرية</h3>
        {revenueLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal"></div>
          </div>
        ) : (
          <div className="h-64">
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-deep-teal mb-4">النشاط الأخير</h3>
        {activityLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-teal"></div>
          </div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity: ActivityItem) => (
              <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(new Date(activity.timestamp))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            لا يوجد نشاط حديث
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;