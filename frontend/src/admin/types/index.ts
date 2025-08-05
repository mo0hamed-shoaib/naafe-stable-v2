export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
}

export interface SummaryCardData {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'user_signup' | 'service_posted' | 'report_flagged';
  message: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}