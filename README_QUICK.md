# ⚖️ نظام المحكمة الإلكترونية - E-Court System

**نظام آمن وموثوق وكامل لإدارة القضايا الرقمية**

---

## 🚀 ابدأ بسرعة

### 1. استنساخ المستودع
```bash
git clone https://github.com/jihadkald55-tech/test
cd test
```

### 2. إعداد المتغيرات
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 3. تثبيت وتشغيل
```bash
# استخدم Docker (موصى به)
docker-compose up

# أو يدوياً:
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev
```

### 4. فتح التطبيق
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## 🔑 حسابات اختبار جاهزة

```
Admin:    admin@court.com / AdminPass123!
Judge:    judge@court.com / JudgePass123!
Lawyer:   lawyer@court.com / LawyerPass123!
Victim:   victim@court.com / VictimPass123!
```

---

## 📚 الأدلة المهمة

| الملف | الغرض |
|------|-------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | دليل الإعداد الشامل |
| [KIT_HUB_INTEGRATION.md](KIT_HUB_INTEGRATION.md) | تكامل مع Kit Hub Suite |
| [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) | مرجع API سريع |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | توثيق API كامل |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | استكشاف الأخطاء |
| [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) | قائمة التحقق للإنتاج |

---

## ✨ المميزات الرئيسية

✅ **التحكم بالوصول (RBAC)**
- Admin, Judge, Lawyer, Victim

✅ **الأمان والتشفير**
- JWT authentication
- AES-256 encryption
- Password hashing (bcrypt)

✅ **إدارة القضايا**
- حالات متعددة
- جدول زمني شامل
- مستويات خطورة

✅ **الرسائل والمستندات**
- تشفير من طرف إلى طرف
- رفع آمن
- بصمات رقمية

✅ **سجل التدقيق**
- تسجيل جميع الإجراءات
- غير قابل للتعديل
- مراجعة كاملة

---

## 🛠️ المتطلبات

- Node.js 16+ أو npm 8+
- MongoDB 5+
- Docker (اختياري)

---

## 📞 المشاكل الشائعة

**المشكلة**: Port مشغول  
**الحل**: `PORT=5001 npm start`

**المشكلة**: MongoDB غير متصل  
**الحل**: `docker-compose up mongodb`

**المشكلة**: CORS error  
**الحل**: تحقق من `NEXT_PUBLIC_API_URL`

👉 اقرأ [TROUBLESHOOTING.md](TROUBLESHOOTING.md) للحلول الكاملة

---

## 🌐 النشر

- **Vercel**: للـ Frontend (Next.js)
- **Railway/Heroku**: للـ Backend
- **MongoDB Atlas**: لقاعدة البيانات

انظر [DEPLOYMENT.md](DEPLOYMENT.md) لتفاصيل النشر

---

## 📖 الدعم

- اقرأ [SETUP_GUIDE.md](SETUP_GUIDE.md) للإعداد
- اقرأ [API_DOCUMENTATION.md](API_DOCUMENTATION.md) للـ API
- اقرأ [TROUBLESHOOTING.md](TROUBLESHOOTING.md) للمشاكل

---

**الإصدار**: 1.0.0 | **آخر تحديث**: فبراير 2026 | **الحالة**: ✅ للإنتاج
