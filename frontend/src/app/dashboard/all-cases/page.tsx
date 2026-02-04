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
  createdAt: string;
}

export default function AllCasesPage() {
  const user = useAuthStore((state) => state.user);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBySeverity, setFilterBySeverity] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAllCases();
    }
  }, [user]);

  const fetchAllCases = async () => {
    try {
      const response = await apiClient.get('/cases/my-cases');
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases =
    filterBySeverity === 'all'
      ? cases
      : cases.filter((c) => c.severity === filterBySeverity);

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

  const stats = {
    total: cases.length,
    critical: cases.filter((c) => c.severity === 'critical').length,
    high: cases.filter((c) => c.severity === 'high').length,
    submitted: cases.filter((c) => c.status === 'submitted').length,
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          عذراً، هذه الصفحة متاحة فقط لمسؤولي النظام
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          جميع القضايا
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          عرض وإدارة جميع القضايا في النظام
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">إجمالي</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {stats.total}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 rounded-lg shadow p-6">
          <div className="text-sm text-red-600 dark:text-red-300">حرجة</div>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {stats.critical}
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 rounded-lg shadow p-6">
          <div className="text-sm text-orange-600 dark:text-orange-300">عالية</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">
            {stats.high}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow p-6">
          <div className="text-sm text-blue-600 dark:text-blue-300">جديدة</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {stats.submitted}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'low', 'medium', 'high', 'critical'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterBySeverity(severity)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterBySeverity === severity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'
              }`}
            >
              {severity === 'all' ? 'الكل' : getSeverityLabel(severity)}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
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
                        عرض
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
