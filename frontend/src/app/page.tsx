export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black" dir="rtl">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ⚖️ النظام القضائي الإلكتروني
          </div>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              تسجيل الدخول
            </a>
            <a
              href="/register"
              className="px-6 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition font-semibold"
            >
              تسجيل جديد
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            مرحباً بكم في النظام القضائي الإلكتروني
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            منصة آمنة وموثوقة لتقديم القضايا وإدارة الملفات والمستندات بسهولة وكفاءة
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            ابدأ الآن
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              إدارة القضايا
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              متابعة شاملة لجميع القضايا والمراحل القضائية مع تحديثات فورية
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              الأمان والتشفير
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              حماية كاملة لبيانات القضايا والمستندات بتقنيات تشفير متقدمة
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              الخصوصية والسرية
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              خيار الحفاظ على الهوية سرية مع الوصول الآمن للقضاة فقط
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              رسائل آمنة
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              تواصل آمن ومشفر بين الضحايا والمحامين والقضاة
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              لوحة تحكم متقدمة
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              واجهات مخصصة لكل دور قضائي مع إحصائيات وتقارير
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              التدقيق والمراجعة
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              سجل تدقيق شامل وغير قابل للحذف لجميع الأنشطة
            </p>
          </div>
        </div>
      </section>

      {/* Security Highlights */}
      <section className="bg-blue-50 dark:bg-blue-900 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            نظام أمان من المستوى العالمي
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                ✓ تشفير من طرف إلى طرف
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جميع الرسائل والمستندات تكون مشفرة بشكل كامل ولا يمكن لأحد الوصول إليها
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                ✓ حماية من الأنشطة المريبة
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                مراقبة فورية للأنشطة المريبة والمحاولات الفاشلة
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                ✓ التحقق من البيانات
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                بصمات رقمية لجميع المستندات تمنع التعديل والتزوير
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                ✓ الامتثال للمعايير الدولية
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                يطابق أعلى معايير الأمان والخصوصية العالمية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 النظام القضائي الإلكتروني. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-sm">نظام آمن وموثوق للقضايا الحساسة خاصة جرائم الإنترنت والابتزاز</p>
        </div>
      </footer>
    </div>
  );
}
