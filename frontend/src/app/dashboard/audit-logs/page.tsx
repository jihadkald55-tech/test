'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/utils/api';
import { useAuthStore } from '@/utils/authStore';

interface AuditLog {
  _id: string;
  userId: any;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  status: string;
  ipAddress: string;
}

export default function AuditLogsPage() {
  const user = useAuthStore((state) => state.user);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAuditLogs();
    }
  }, [user]);

  const fetchAuditLogs = async () => {
    try {
      const response = await apiClient.get('/admin/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueActions = [...new Set(logs.map((log) => log.action))];
  const filteredLogs =
    filterAction === 'all'
      ? logs
      : logs.filter((log) => log.action === filterAction);

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'bg-green-100 text-green-800';
    if (action.includes('DELETE') || action.includes('FAILED')) return 'bg-red-100 text-red-800';
    if (action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('CREATE')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
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
          سجل التدقيق
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          سجل شامل وغير قابل للتعديل لجميع الأنشطة
        </p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          🔒 هذا السجل غير قابل للتعديل أو الحذف. يتم تسجيل جميع الأنشطة بما فيها:
          تسجيلات الدخول، إنشاء القضايا، تحميل الملفات، وتغييرات الصلاحيات.
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
        <div className="flex gap-2 flex-nowrap">
          <button
            onClick={() => setFilterAction('all')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filterAction === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'
            }`}
          >
            الكل
          </button>
          {uniqueActions.slice(0, 10).map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                filterAction === action
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">لا توجد سجلات</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    الإجراء
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    المستخدم
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    النوع
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    التاريخ والوقت
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    العنوان IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {log.userId?.fullName || 'نظام'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {log.resourceType}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            إحصائيات الأنشطة
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">إجمالي السجلات</span>
              <span className="font-semibold text-gray-900 dark:text-white">{logs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">تسجيلات دخول</span>
              <span className="font-semibold text-green-600">
                {logs.filter((l) => l.action.includes('LOGIN')).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">عمليات فاشلة</span>
              <span className="font-semibold text-red-600">
                {logs.filter((l) => l.action.includes('FAILED')).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            أنواع الأنشطة الشائعة
          </h3>
          <div className="space-y-2 text-sm">
            {uniqueActions.slice(0, 5).map((action) => (
              <div key={action} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{action}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {logs.filter((l) => l.action === action).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
