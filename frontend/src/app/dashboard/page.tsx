'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/utils/authStore';
import apiClient from '@/utils/api';

interface Case {
  _id: string;
  caseNumber: string;
  title: string;
  status: string;
  severity: string;
  createdAt: string;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await apiClient.get('/cases/my-cases');
      setCases(response.data);
      setStats({
        totalCases: response.data.length,
        activeCases: response.data.filter((c: Case) => c.status !== 'closed').length,
        closedCases: response.data.filter((c: Case) => c.status === 'closed').length,
      });
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
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

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      low: 'text-blue-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600',
    };
    return colors[severity] || '';
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

  const getStatusLabel = (status: string) => {
    const labels: any = {
      submitted: 'مقدمة',
      under_review: 'قيد المراجعة',
      court_session_scheduled: 'جلسة مجدولة',
      closed: 'مغلقة',
    };
    return labels[status] || '';
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          مرحباً {user?.fullName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لوحة التحكم الخاصة بك في النظام القضائي الإلكتروني
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">إجمالي القضايا</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCases}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">القضايا النشطة</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.activeCases}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">القضايا المغلقة</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.closedCases}</div>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">قضاياي الأخيرة</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
        ) : cases.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            لا توجد قضايا حالياً
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cases.map((caseItem) => (
                  <tr key={caseItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {caseItem.caseNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <a href={`/dashboard/case/${caseItem._id}`} className="hover:text-blue-600">
                        {caseItem.title}
                      </a>
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
