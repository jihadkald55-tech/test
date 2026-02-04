import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/utils/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, loadFromLocalStorage } = useAuthStore();

  useEffect(() => {
    loadFromLocalStorage();
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const navigationItems = {
    victim: [
      { label: 'لوحة التحكم', href: '/dashboard' },
      { label: 'قضاياي', href: '/dashboard/my-cases' },
      { label: 'رفع قضية جديدة', href: '/dashboard/submit-case' },
    ],
    judge: [
      { label: 'لوحة التحكم', href: '/dashboard' },
      { label: 'القضايا المسندة', href: '/dashboard/assigned-cases' },
      { label: 'الملاحظات الخاصة', href: '/dashboard/notes' },
    ],
    lawyer: [
      { label: 'لوحة التحكم', href: '/dashboard' },
      { label: 'قضاياي', href: '/dashboard/my-cases' },
      { label: 'الرسائل', href: '/dashboard/messages' },
    ],
    admin: [
      { label: 'لوحة التحكم', href: '/dashboard' },
      { label: 'إدارة المستخدمين', href: '/dashboard/users' },
      { label: 'جميع القضايا', href: '/dashboard/all-cases' },
      { label: 'سجل التدقيق', href: '/dashboard/audit-logs' },
    ],
  };

  const currentNav = navigationItems[user.role as keyof typeof navigationItems] || [];

  const roleLabels: any = {
    victim: 'مضرور',
    lawyer: 'محام',
    judge: 'قاضي',
    admin: 'مسؤول النظام',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Navigation Header */}
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-2xl"
            >
              ☰
            </button>
            <div className="text-2xl font-bold">⚖️ النظام القضائي</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm">
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-blue-200">{roleLabels[user.role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
        >
          <div className="p-6 space-y-6">
            {currentNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
