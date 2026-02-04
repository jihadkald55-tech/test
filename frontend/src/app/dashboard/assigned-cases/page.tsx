'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/utils/api';
import { useAuthStore } from '@/utils/authStore';

interface Case {
  _id: string;
  caseNumber: string;
  title: string;
  status: string;
  severity: string;
  victimId: any;
  caseTimeline: any[];
  documents: any[];
}

export default function AssignedCasesPage() {
  const user = useAuthStore((state) => state.user);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [notes, setNotes] = useState('');
  const [privateNotes, setPrivateNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user?.role === 'judge') {
      fetchAssignedCases();
    }
  }, [user]);

  const fetchAssignedCases = async () => {
    try {
      const response = await apiClient.get('/cases/my-cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId: string, newStatus: string) => {
    try {
      await apiClient.put(`/cases/${caseId}/status`, {
        status: newStatus,
        event: `تم تحديث الحالة إلى ${getStatusLabel(newStatus)}`,
      });
      fetchAssignedCases();
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const savePrivateNotes = (caseId: string, notes: string) => {
    setPrivateNotes((prev) => ({ ...prev, [caseId]: notes }));
    // في النظام الفعلي، سيتم حفظ الملاحظات في قاعدة البيانات
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      court_session_scheduled: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      submitted: 'مقدمة',
      under_review: 'قيد المراجعة',
      court_session_scheduled: 'جلسة مجدولة',
      closed: 'مغلقة',
    };
    return labels[status] || '';
  };

  const getSeverityLabel = (severity: string) => {
    const labels: any = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      critical: 'حرج',
    };
    return labels[severity] || '';
  };

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      low: 'text-blue-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600',
    };
    return colors[severity] || '';
  };

  if (user?.role !== 'judge') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          عذراً، هذه الصفحة متاحة فقط للقضاة
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
      {/* Cases List */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              القضايا المسندة إلي
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              إدارة ومراجعة القضايا المسندة
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">جاري التحميل...</div>
          ) : cases.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-gray-500">
              لا توجد قضايا مسندة حالياً
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  onClick={() => setSelectedCase(caseItem)}
                  className={`p-6 rounded-lg border cursor-pointer transition ${
                    selectedCase?._id === caseItem._id
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-300'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {caseItem.caseNumber}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseItem.status)}`}>
                      {getStatusLabel(caseItem.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-4 text-sm">
                    <span className={`${getSeverityColor(caseItem.severity)} font-semibold`}>
                      {getSeverityLabel(caseItem.severity)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {caseItem.documents?.length || 0} مستندات
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Case Details Panel */}
      {selectedCase && (
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              تفاصيل القضية
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الحالة</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['submitted', 'under_review', 'court_session_scheduled', 'closed'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedCase._id, status)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          selectedCase.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  الملاحظات الخاصة (ظاهرة للقاضي فقط)
                </p>
                <textarea
                  value={privateNotes[selectedCase._id] || ''}
                  onChange={(e) => savePrivateNotes(selectedCase._id, e.target.value)}
                  placeholder="أضف ملاحظاتك الخاصة..."
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 هذه الملاحظات خاصة بك ولن يراها سوى الإداريون والأنظمة
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`/dashboard/case/${selectedCase._id}`}
                className="block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
              >
                عرض التفاصيل الكاملة
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
