interface ComplaintData {
  reportedUserId: string;
  jobRequestId: string;
  problemType: string;
  description: string;
}

interface Complaint {
  _id: string;
  reporterId: string;
  reportedUserId: string;
  jobRequestId: string;
  problemType: string;
  problemTypeLabel: string;
  description: string;
  status: string;
  statusLabel: string;
  adminNotes?: string;
  adminAction: string;
  adminActionLabel: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  reporter: {
    _id: string;
    name: { first: string; last: string };
    email: string;
  };
  reportedUser: {
    _id: string;
    name: { first: string; last: string };
    email: string;
  };
  jobRequest: {
    _id: string;
    title: string;
  };
}

interface ComplaintResponse {
  success: boolean;
  data: {
    complaint: Complaint;
  };
  message: string;
}

interface AdminComplaintResponse {
  success: boolean;
  data: {
    complaints: Complaint[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ComplaintStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    investigating: number;
    byStatus: Record<string, number>;
  };
}

interface AdminAction {
  _id: string;
  complaintId: string;
  adminId: string;
  actionType: string;
  actionTypeLabel: string;
  previousStatus: string;
  previousStatusLabel: string;
  newStatus: string;
  newStatusLabel: string;
  previousAdminAction: string;
  previousAdminActionLabel: string;
  newAdminAction: string;
  newAdminActionLabel: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  admin: {
    _id: string;
    name: { first: string; last: string };
    email: string;
  };
}

interface ComplaintActionsResponse {
  success: boolean;
  data: {
    actions: AdminAction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const submitComplaint = async (complaintData: ComplaintData, token: string | null): Promise<ComplaintResponse> => {
  const response = await fetch('/api/complaints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
    body: JSON.stringify(complaintData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في إرسال البلاغ');
  }

  return response.json();
};

export const getAdminComplaints = async (
  page: number = 1,
  search: string = '',
  filter: string = 'all',
  token: string | null
): Promise<AdminComplaintResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) params.append('search', search);
  if (filter && filter !== 'all') params.append('status', filter);

  const response = await fetch(`/api/complaints/admin?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في جلب البلاغات');
  }

  return response.json();
};

export const updateComplaint = async (
  complaintId: string,
  updateData: {
    status?: string;
    adminAction?: string;
    adminNotes?: string;
  },
  token: string | null
): Promise<ComplaintResponse> => {
  const response = await fetch(`/api/complaints/admin/${complaintId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في تحديث البلاغ');
  }

  return response.json();
};

export const getComplaintStats = async (token: string | null): Promise<ComplaintStatsResponse> => {
  const response = await fetch('/api/complaints/admin/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في جلب إحصائيات البلاغات');
  }

  return response.json();
};

export const getComplaintActions = async (
  complaintId: string,
  page: number = 1,
  token: string | null
): Promise<ComplaintActionsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());

  const response = await fetch(`/api/complaints/admin/${complaintId}/actions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في جلب إجراءات البلاغ');
  }

  return response.json();
}; 