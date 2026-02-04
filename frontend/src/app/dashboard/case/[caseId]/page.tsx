'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/utils/api';

interface CaseDetail {
  _id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  isAnonymous: boolean;
  anonymousCaseId: string;
  victimId: any;
  assignedJudgeId: any;
  assignedLawyers: any[];
  caseTimeline: any[];
  documents: any[];
  createdAt: string;
}

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      const response = await apiClient.get(`/cases/${caseId}`);
      setCaseData(response.data);
    } catch (error) {
      console.error('Error fetching case details:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">حدث خطأ في تحميل تفاصيل القضية</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {caseData.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              رقم القضية: {caseData.anonymousCaseId || caseData.caseNumber}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(caseData.status)}`}>
              {getStatusLabel(caseData.status)}
            </span>
            {caseData.isAnonymous && (
              <div className="mt-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded px-3 py-1">
                <p className="text-blue-700 dark:text-blue-300 text-sm">🔒 قضية مجهولة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الوصف التفصيلي
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {caseData.description}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الجدول الزمني
            </h2>
            <div className="space-y-4">
              {caseData.caseTimeline.map((event: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    {index < caseData.caseTimeline.length - 1 && (
                      <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.event}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              معلومات القضية
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">مستوى الخطورة</p>
                <p className={`font-semibold ${getSeverityColor(caseData.severity)}`}>
                  {getSeverityLabel(caseData.severity)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">تاريخ الإنشاء</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(caseData.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
              {caseData.assignedJudgeId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">القاضي المسؤول</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {caseData.assignedJudgeId.fullName}
                  </p>
                </div>
              )}
              {caseData.assignedLawyers && caseData.assignedLawyers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">المحامون</p>
                  <div className="space-y-1">
                    {caseData.assignedLawyers.map((lawyer: any) => (
                      <p key={lawyer._id} className="font-semibold text-gray-900 dark:text-white">
                        {lawyer.fullName}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {caseData.documents && caseData.documents.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المستندات
              </h3>
              <div className="space-y-2">
                {caseData.documents.map((doc: any) => (
                  <a
                    key={doc._id}
                    href="#"
                    className="block p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-blue-600 dark:text-blue-400 text-sm"
                  >
                    📄 {doc.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
