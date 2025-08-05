import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import Modal from '../components/UI/Modal';
import { FormTextarea } from '../../components/ui';
import SearchAndFilter from '../components/UI/SearchAndFilter';
import Pagination from '../components/UI/Pagination';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SortableTable, { SortDirection } from '../components/UI/SortableTable';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  accepted: 'مقبول',
  rejected: 'مرفوض',
};

const STATUS_VARIANT_MAP: Record<string, 'status' | 'category' | 'premium' | 'top-rated' | 'urgency'> = {
  pending: 'status',
  accepted: 'category', // Use 'category' for accepted (or another valid variant)
  rejected: 'urgency',  // Use 'urgency' for rejected (red)
};

interface UpgradeRequest {
  _id: string;
  user: {
    _id: string;
    name: { first: string; last: string };
    phone: string;
    email: string;
    profile?: { location?: { address: string } };
  };
  status: 'pending' | 'accepted' | 'rejected';
  attachments?: string[];
  adminExplanation?: string; // Added for explanations
}

const AdminUpgradeRequests: React.FC = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [adminExplanation, setAdminExplanation] = useState('');
  const [acceptingRequestId, setAcceptingRequestId] = useState<string | null>(null);
  // Add state for image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [sortKey, setSortKey] = useState<keyof UpgradeRequest>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch upgrade requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (search) params.append('search', search);
        const res = await fetch(`/api/admin/upgrade-requests?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message || 'فشل التحميل');
        setRequests(data.data.requests);
      } catch {
        setError('فشل تحميل طلبات الترقية');
      }
      setLoading(false);
    };
    fetchRequests();
  }, [accessToken, statusFilter, search]);

  // Accept request (with explanation)
  const handleAccept = (id: string) => {
    setAcceptingRequestId(id);
    setAdminExplanation('');
    setShowAcceptModal(true);
  };
  const handleAcceptConfirm = async () => {
    if (!acceptingRequestId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/upgrade-requests/${acceptingRequestId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminExplanation }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'فشل القبول');
      setRequests((prev) => prev.map((r) => r._id === acceptingRequestId ? { ...r, status: 'accepted', adminExplanation } : r));
      setShowAcceptModal(false);
      setAdminExplanation('');
      setAcceptingRequestId(null);
    } catch {
      alert('فشل قبول الطلب');
    }
    setActionLoading(false);
  };

  // Reject request (with explanation)
  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/upgrade-requests/${selectedRequest._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ adminExplanation }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || 'فشل الرفض');
      setRequests((prev) => prev.map((r) => r._id === selectedRequest._id ? { ...r, status: 'rejected', adminExplanation } : r));
      setShowRejectModal(false);
      setAdminExplanation('');
    } catch {
      alert('فشل رفض الطلب');
    }
    setActionLoading(false);
  };

  const tableColumns = [
    {
      key: 'user',
      label: 'المستخدم',
      sortable: false,
      clickable: true,
      onClick: (req: UpgradeRequest) => {
        navigate(`/profile/${req.user._id}`);
      },
      render: (_: any, req: UpgradeRequest) => (
        <span className="font-medium text-deep-teal hover:underline cursor-pointer">
          {req.user?.name?.first} {req.user?.name?.last}
        </span>
      )
    },
    {
      key: 'phone',
      label: 'الهاتف',
      sortable: false,
      render: (_: any, req: UpgradeRequest) => req.user?.phone
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      sortable: false,
      render: (_: any, req: UpgradeRequest) => req.user?.email
    },
    {
      key: 'address',
      label: 'العنوان',
      sortable: false,
      render: (_: any, req: UpgradeRequest) => req.user?.profile?.location?.address || '-'
    },
    {
      key: 'attachments',
      label: 'المرفقات',
      sortable: false,
      render: (_: any, req: UpgradeRequest) => (
        <div className="flex gap-2 flex-wrap">
          {req.attachments?.map((url, i) => (
            <img
              key={i}
              src={url}
              alt="مرفق"
              className="h-10 w-10 rounded object-cover border cursor-pointer"
              onClick={() => { setModalImages(req.attachments || []); setModalIndex(i); setImageModalOpen(true); }}
            />
          ))}
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (_: any, req: UpgradeRequest) => (
        <>
          <Badge variant={STATUS_VARIANT_MAP[req.status] || 'status'} size="sm">
            {STATUS_LABELS[req.status]}
          </Badge>
          {(req.status === 'accepted' || req.status === 'rejected') && req.adminExplanation && (
            <div className="text-xs mt-1 text-blue-700" title={req.adminExplanation}>
              <span className="font-semibold">شرح الإدارة:</span> {req.adminExplanation}
            </div>
          )}
        </>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      sortable: false,
      render: (_: any, req: UpgradeRequest) => (
        <div className="flex gap-2 justify-end">
          {req.status === 'pending' && (
            <>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<BadgeCheck className="inline h-4 w-4 mr-1" />}
                onClick={() => handleAccept(req._id)}
                loading={actionLoading}
              >
                قبول
              </Button>
              <Button
                variant="danger"
                size="md"
                leftIcon={<XCircle className="inline h-4 w-4 mr-1" />}
                onClick={() => { setSelectedRequest(req); setShowRejectModal(true); setAdminExplanation(''); }}
                loading={actionLoading}
              >
                رفض
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <Breadcrumb items={[{ label: 'طلبات الترقية' }]} />
      <h1 className="text-3xl font-bold text-deep-teal">طلبات الترقية</h1>
      <div className="bg-light-cream rounded-2xl p-8 shadow-md">
        <SearchAndFilter
          searchTerm={search}
          onSearchChange={setSearch}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { value: 'all', label: 'الكل' },
            { value: 'pending', label: 'قيد الانتظار' },
            { value: 'accepted', label: 'مقبول' },
            { value: 'rejected', label: 'مرفوض' },
          ]}
          placeholder="بحث بالاسم أو البريد أو الهاتف"
        />
        <SortableTable
          data={requests}
          columns={tableColumns}
          onSort={(key, direction) => {
            setSortKey(key as keyof UpgradeRequest);
            setSortDirection(direction);
          }}
          sortKey={sortKey}
          sortDirection={sortDirection}
          emptyMessage={loading ? 'جاري التحميل...' : error ? error : 'لا توجد طلبات'}
          className="mt-8"
        />
        <Pagination
          currentPage={1} // TODO: wire up pagination state if needed
          totalPages={1} // TODO: wire up pagination state if needed
          totalItems={requests.length}
          itemsPerPage={requests.length}
          onPageChange={() => {}}
        />
      </div>
      {/* Accept Modal */}
      <Modal isOpen={showAcceptModal} onClose={() => setShowAcceptModal(false)} title="شرح الإدارة للموافقة">
        <div className="space-y-4">
          <FormTextarea
            rows={3}
            placeholder="يرجى كتابة شرح سبب الموافقة"
            value={adminExplanation}
            onChange={e => setAdminExplanation(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowAcceptModal(false)}
              disabled={actionLoading}
            >إلغاء</Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleAcceptConfirm}
              disabled={actionLoading || !adminExplanation.trim()}
              loading={actionLoading}
            >تأكيد الموافقة</Button>
          </div>
        </div>
      </Modal>
      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="شرح الإدارة للرفض">
        <div className="space-y-4">
          <FormTextarea
            rows={3}
            placeholder="يرجى كتابة شرح سبب الرفض"
            value={adminExplanation}
            onChange={e => setAdminExplanation(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowRejectModal(false)}
              disabled={actionLoading}
            >إلغاء</Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleReject}
              disabled={actionLoading || !adminExplanation.trim()}
              loading={actionLoading}
            >رفض الطلب</Button>
          </div>
        </div>
      </Modal>
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setImageModalOpen(false)}>
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImageModalOpen(false)}
            >
              &times;
            </Button>
            <img src={modalImages[modalIndex]} alt="مرفق كبير" className="w-full max-h-[70vh] object-contain rounded" />
            {modalImages.length > 1 && (
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalIndex((modalIndex - 1 + modalImages.length) % modalImages.length)}
                  disabled={modalImages.length <= 1}
                >السابق</Button>
                <span className="text-xs">{modalIndex + 1} / {modalImages.length}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalIndex((modalIndex + 1) % modalImages.length)}
                  disabled={modalImages.length <= 1}
                >التالي</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpgradeRequests; 