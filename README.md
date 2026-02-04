# النظام القضائي الإلكتروني (E-Court)

نظام آمن وموثوق لإدارة القضايا الحساسة خاصة جرائم الإنترنت والابتزاز

## المميزات الرئيسية

### 1. **التحكم بالوصول القائم على الأدوار (RBAC)**
- **ضحايا/مواطنون**: تقديم قضايا جديدة ومتابعة حالتها
- **محامون**: الوصول إلى القضايا المسندة والمراسلة الآمنة
- **قضاة**: مراجعة القضايا وتحديث الحالة والملاحظات الخاصة
- **مسؤولو النظام**: إدارة المستخدمين والقضايا والسجلات

### 2. **الأمان والتشفير**
- ✅ تشفير كلمات المرور بـ bcrypt
- ✅ توكنات JWT للمصادقة
- ✅ تشفير الرسائل والمستندات (AES-256)
- ✅ بصمات رقمية للمستندات (SHA-256)
- ✅ حماية من XSS و SQL Injection و CSRF
- ✅ رؤوس الأمان HTTP (Helmet)
- ✅ سجلات تدقيق غير قابلة للحذف

### 3. **الخصوصية**
- خيار تقديم القضايا بصيغة مجهولة
- الهوية الحقيقية متاحة فقط للقاضي المسؤول
- رقم قضية مجهول بدلاً من الاسم الحقيقي

### 4. **إدارة القضايا**
- حالات القضية: مقدمة → قيد المراجعة → جلسة مجدولة → مغلقة
- جدول زمني شامل للأحداث
- مستويات خطورة: منخفض، متوسط، عالي، حرج
- إسناد للقضاة والمحامين

### 5. **المستندات الآمنة**
- رفع آمن مع التحقق من نوع الملف والحجم
- تشفير المستندات قبل التخزين
- بصمات رقمية لمنع التعديل
- التحكم في الوصول حسب الدور والملكية

### 6. **الرسائل المشفرة**
- تواصل آمن بين الضحايا والمحامين والقضاة
- جميع الرسائل مشفرة من طرف إلى طرف
- مرتبطة بمعرف القضية

### 7. **سجل التدقيق**
- تسجيل جميع الإجراءات الحرجة
- غير قابل للتعديل أو الحذف
- متضمن: بيانات المستخدم والإجراء والموارد والطابع الزمني

### 8. **واجهة احترافية**
- تصميم قضائي رسمي وموثوق
- دعم كامل للعربية (RTL)
- نسخة مظلمة للراحة البصرية
- انتقالات سلسة وحركات احترافية

---

## المتطلبات

- Node.js 18+ 
- MongoDB 5+
- npm أو yarn

---

## التثبيت والإعداد

### 1. استنساخ المستودع

```bash
cd e-court-system
```

### 2. إعداد الخادم الخلفي (Backend)

```bash
cd backend
npm install
```

إنشاء ملف `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/e-court
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
ENCRYPTION_KEY=your_32_char_encryption_key_here!
FRONTEND_URL=http://localhost:3000
```

تشغيل الخادم:

```bash
npm run dev
```

الخادم سيعمل على: `http://localhost:5000`

### 3. إعداد واجهة المستخدم (Frontend)

```bash
cd frontend
npm install
```

تشغيل التطبيق:

```bash
npm run dev
```

التطبيق سيكون متاحاً على: `http://localhost:3000`

---

## نقاط النهاية (Endpoints) للـ API

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### القضايا
- `POST /api/cases/submit` - تقديم قضية جديدة
- `GET /api/cases/my-cases` - الحصول على قضايا المستخدم
- `GET /api/cases/:caseId` - تفاصيل القضية
- `PUT /api/cases/:caseId/status` - تحديث حالة القضية

### المستندات
- `POST /api/documents/upload` - رفع مستند
- `GET /api/documents/:caseId` - الحصول على مستندات القضية

### الرسائل
- `POST /api/messages/send` - إرسال رسالة
- `GET /api/messages/:caseId/:otherUserId` - الحصول على المحادثة

### الإدارة (Admin فقط)
- `GET /api/admin/users` - جميع المستخدمين
- `PUT /api/admin/users/:userId/role` - تحديث دور المستخدم
- `POST /api/admin/cases/assign-judge` - إسناد قضية للقاضي
- `GET /api/admin/audit-logs` - سجلات التدقيق

---

## بيانات اختبار

### حساب مضرور
```
البريد: victim@example.com
كلمة المرور: password123
الدور: victim
```

### حساب محام
```
البريد: lawyer@example.com
كلمة المرور: password123
الدور: lawyer
```

### حساب قاضي
```
البريد: judge@example.com
كلمة المرور: password123
الدور: judge
```

### حساب مسؤول
```
البريد: admin@example.com
كلمة المرور: password123
الدور: admin
```

---

## هيكل المشروع

```
e-court-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── caseController.js
│   │   │   ├── documentController.js
│   │   │   ├── messageController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── rbac.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Case.js
│   │   │   ├── Document.js
│   │   │   ├── Message.js
│   │   │   └── AuditLog.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── caseRoutes.js
│   │   │   ├── documentRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── utils/
│   │   │   ├── encryption.js
│   │   │   └── auditLogger.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx (الصفحة الرئيسية)
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── dashboard/
    │   │       ├── layout.tsx
    │   │       ├── page.tsx
    │   │       ├── my-cases/
    │   │       ├── submit-case/
    │   │       └── case/[caseId]/
    │   ├── utils/
    │   │   ├── api.ts
    │   │   └── authStore.ts
    │   ├── globals.css
    │   └── layout.tsx
    ├── package.json
    └── next.config.ts
```

---

## الميزات الأمان المتقدمة

### 1. تشفير البيانات
- جميع كلمات المرور مشفرة بـ bcrypt
- الرسائل والمستندات مشفرة بـ AES-256
- البيانات الحساسة تُشفر قبل التخزين

### 2. المصادقة والتفويض
- JWT tokens مع انتهاء صلاحية محدد
- التحقق من الدور على كل طلب
- حماية من الوصول غير المصرح

### 3. حماية من الهجمات
- حماية CSRF
- منع XSS
- منع SQL Injection
- التحقق من صحة المدخلات

### 4. سجل التدقيق
- تسجيل شامل لجميع الأنشطة
- غير قابل للتعديل
- يتضمن IP ومعلومات المتصفح

---

## الخطوات التالية

### مميزات مستقبلية
- جلسات محكمة افتراضية
- التكامل مع الأنظمة الحكومية
- تصنيف القضايا بمساعدة الذكاء الاصطناعي
- إشعارات فورية عبر البريد الإلكتروني والـ SMS
- توقيع رقمي

---

## الترخيص

© 2026 النظام القضائي الإلكتروني. جميع الحقوق محفوظة.

---

## الدعم والمساعدة

للمزيد من المعلومات والدعم، يرجى التواصل مع فريق الدعم الفني.
