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
  createdAt: string;
  victimId: string;
}

export default function MyCasesPage() {
  const user = useAuthStore((state) => state.user);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await apiClient.get('/cases/my-cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = filter === 'all' 
    ? cases 
    : cases.filter((c) => c.status === filter);

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

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">قضاياي</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          إدارة جميع القضايا المسندة إليك
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4 flex-wrap">
        {['all', 'submitted', 'under_review', 'court_session_scheduled', 'closed'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'الكل' : getStatusLabel(status)}
            </button>
          )
        )}
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
        ) : filteredCases.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            لا توجد قضايا في هذا التصنيف
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    رقم القضية
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    الخطورة
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {caseItem.caseNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {caseItem.title}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {getStatusLabel(caseItem.status)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${getSeverityColor(caseItem.severity)}`}>
                      {getSeverityLabel(caseItem.severity)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(caseItem.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`/dashboard/case/${caseItem._id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        عرض التفاصيل
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
