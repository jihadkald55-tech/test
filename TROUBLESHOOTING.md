# 🛠️ دليل استكشاف الأخطاء والحلول

## 1️⃣ مشاكل التثبيت والإعداد

### ❌ خطأ: "npm command not found"
**السبب**: npm غير مثبت أو غير موجود في PATH  
**الحل**:
```bash
# تحقق من التثبيت
node --version
npm --version

# إذا لم يعمل، ثبّت Node.js من:
# https://nodejs.org/
```

### ❌ خطأ: "Port 5000 already in use"
**السبب**: تطبيق آخر يستخدم الـ port  
**الحل**:
```bash
# استخدم port مختلف
PORT=5001 npm start

# أو أغلق التطبيق القديم
# على Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ خطأ: "Module not found"
**السبب**: لم تُثبَّت الحزم بعد  
**الحل**:
```bash
# أعد تثبيت الحزم
rm -rf node_modules package-lock.json
npm install

# للـ Frontend (Next.js)
rm -rf .next node_modules
npm install
npm run build
```

---

## 2️⃣ مشاكل قاعدة البيانات

### ❌ خطأ: "MongoDB connection refused"
**السبب**: MongoDB لم يبدأ التشغيل  
**الحل**:

**على Windows**:
```bash
# افحص ما إذا كان MongoDB مثبتاً
# ثم ابدأ الخدمة:
net start MongoDB

# أو شغّله مباشرة:
mongod --dbpath "C:\data\db"
```

**باستخدام Docker**:
```bash
docker-compose up mongodb
```

### ❌ خطأ: "Authentication failed"
**السبب**: بيانات اعتماد قاعدة البيانات خاطئة  
**الحل**:
```bash
# تأكد من أن backend/.env يحتوي على:
MONGODB_URI=mongodb://admin:admin123@localhost:27017/e-court

# أو استخدم MongoDB بدون كلمة مرور في التطوير:
MONGODB_URI=mongodb://localhost:27017/e-court
```

### ❌ خطأ: "Database not found"
**السبب**: MongoDB لم يُنشئ قاعدة البيانات بعد  
**الحل**:
```bash
# قاعدة البيانات ستُنشأ تلقائياً عند أول إدراج
# لا تقلق - فقط ابدأ التطبيق

# أو أنشئها يدوياً:
mongosh
> use e-court
> db.createCollection("cases")
```

---

## 3️⃣ مشاكل Frontend (Next.js)

### ❌ صفحة بيضاء / لا محتوى
**السبب**: خطأ أثناء البناء أو عدم اتصال الـ API  
**الحل**:
```bash
cd frontend

# امسح البيانات المؤقتة
rm -rf .next node_modules

# أعد التثبيت والبناء
npm install
npm run build

# شغّل بوضع التطوير
npm run dev
```

### ❌ خطأ: "Cannot find module 'next'"
**السبب**: حزم Next.js لم تُثبَّت  
**الحل**:
```bash
cd frontend
npm install next react react-dom
npm run dev
```

### ❌ خطأ: "CORS error"
**السبب**: Frontend و Backend على نطاقات مختلفة  
**الحل**:

**تأكد من ملفات البيئة**:
```bash
# في frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:5000

# في backend/.env:
FRONTEND_URL=http://localhost:3000
```

**إذا كنت تستخدم دومين مختلف**:
```bash
# backend/.env:
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
```

### ❌ صور أو أيقونات لم تُحمَّل
**السبب**: مشكلة في المسارات  
**الحل**:
```bash
# تأكد أن الملفات موجودة في:
# frontend/public/

# وأن المسارات نسبية:
<Image src="/images/logo.png" alt="Logo" />
```

### ❌ خطأ "Hydration mismatch"
**السبب**: عدم توافق بين Server و Client  
**الحل**:
```tsx
// استخدم 'use client' في أعلى الملف
'use client';

// وتجنب استخدام window في Server components
if (typeof window !== 'undefined') {
  // كود يعتمد على window
}
```

---

## 4️⃣ مشاكل Backend (Express.js)

### ❌ خطأ: "Cannot connect to database"
**السبب**: MONGODB_URI خاطئ  
**الحل**:
```bash
# تحقق من صيغة الـ URI:
# mongodb://username:password@localhost:27017/database-name

# أو بدون كلمة مرور:
# mongodb://localhost:27017/e-court

# اختبرها باستخدام:
mongosh "mongodb://localhost:27017/e-court"
```

### ❌ خطأ: "JWT is not defined"
**السبب**: JWT_SECRET غير معرَّف  
**الحل**:
```bash
# تأكد من backend/.env:
JWT_SECRET=your-super-secret-key-minimum-32-chars-long!
JWT_EXPIRE=7d
```

### ❌ خطأ: "Unauthorized (401)"
**السبب**: التوكن منتهي الصلاحية أو خاطئ  
**الحل**:
```bash
# احصل على توكن جديد بتسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@court.com","password":"AdminPass123!"}'

# استخدم التوكن في الطلبات:
curl http://localhost:5000/api/cases \
  -H "Authorization: Bearer TOKEN_HERE"
```

### ❌ خطأ: "Forbidden (403)"
**السبب**: المستخدم لا يملك صلاحية الوصول  
**الحل**:
```bash
# تأكد من دور المستخدم:
# admin - كل الصلاحيات
# judge - مراجعة وتحديث القضايا
# lawyer - عرض قضاياهم المسندة
# victim - إنشاء قضايا وتتبعها

# للتحقق من الدور:
GET /api/auth/verify
Authorization: Bearer <token>
```

### ❌ خطأ: "Validation error"
**السبب**: بيانات الطلب غير صحيحة  
**الحل**:
```bash
# اقرأ الرسالة بعناية:
# {
#   "error": "Email is already registered"
# }

# تأكد من:
# - البريد الإلكتروني صحيح (user@example.com)
# - كلمة المرور قوية (min 8 أحرف، أحرف كبيرة، أرقام)
# - جميع الحقول المطلوبة موجودة
```

---

## 5️⃣ مشاكل Docker

### ❌ خطأ: "docker-compose command not found"
**السبب**: Docker Compose غير مثبت  
**الحل**:
```bash
# ثبّت Docker Desktop من:
# https://www.docker.com/products/docker-desktop

# أو على Linux:
sudo apt-get install docker-compose
```

### ❌ خطأ: "Port already in use"
**السبب**: container آخر يستخدم الـ port  
**الحل**:
```bash
# أيقف جميع containers
docker-compose down

# أو استخدم ports مختلفة في docker-compose.yml:
ports:
  - "5001:5000"  # تغيير الـ port الخارجي
```

### ❌ خطأ: "Cannot connect to Docker daemon"
**السبب**: Docker لم يبدأ التشغيل  
**الحل**:

**Windows**:
- افتح Docker Desktop من Start Menu
- انتظر حتى يبدأ التشغيل

**Linux**:
```bash
sudo systemctl start docker
```

### ❌ MongoDB container لا يعمل
**السبب**: مشكلة في الـ volume أو الإذن  
**الحل**:
```bash
# امسح البيانات القديمة
docker-compose down -v

# أعد البناء
docker-compose build --no-cache

# ابدأ من جديد
docker-compose up
```

---

## 6️⃣ مشاكل الأداء

### 🐢 التطبيق بطيء جداً
**الحل**:
```bash
# 1. تحقق من استخدام الموارد:
# في Windows: Task Manager
# في Linux: top أو htop

# 2. أعد تشغيل الخدمات:
docker-compose restart

# 3. امسح الـ cache:
frontend: rm -rf .next
backend: rm -rf node_modules
```

### 🔴 استهلاك ذاكرة عالي
**الحل**:
```bash
# قد تحتاج عقدة Redis للتخزين المؤقت
# أضف في docker-compose.yml:
redis:
  image: redis:latest
  ports:
    - "6379:6379"
```

---

## 7️⃣ مشاكل الأمان

### ⚠️ تحذير: "JWT secret is exposed"
**الحل**:
```bash
# أنشئ secret قوي جديد:
openssl rand -base64 32

# استخدمه في backend/.env:
JWT_SECRET=<generated-secret>
```

### ⚠️ تحذير: "Encryption key is weak"
**الحل**:
```bash
# أنشئ مفتاح تشفير قوي (32 أحرف):
ENCRYPTION_KEY=$(openssl rand -hex 16)

# استخدمه في backend/.env:
ENCRYPTION_KEY=<generated-key>
```

---

## 8️⃣ مشاكل نشر الإنتاج

### ❌ خطأ: "Environment variables not loaded"
**الحل**:
```bash
# تأكد من أن جميع المتغيرات معرَّفة:
echo $MONGODB_URI
echo $JWT_SECRET
echo $ENCRYPTION_KEY

# إضف .env في deployment platform:
# Vercel / Heroku / Railway
```

### ❌ خطأ: "HTTPS certificate error"
**الحل**:
```bash
# استخدم Let's Encrypt:
# https://letsencrypt.org/

# أو Vercel (يفعله تلقائياً)
```

---

## 🔍 أوامر مفيدة للتشخيص

### فحص الـ API
```bash
# اختبر endpoint أساسي
curl http://localhost:5000/api/health

# اختبر التسجيل
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@court.com","password":"AdminPass123!"}'
```

### فحص قاعدة البيانات
```bash
# اتصل بـ MongoDB
mongosh "mongodb://localhost:27017/e-court"

# اعرض القوائم
show collections

# احسب عدد الوثائق
db.cases.countDocuments()
```

### فحص الـ logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# MongoDB logs
docker-compose logs mongodb
```

### إعادة تشغيل
```bash
# إيقاف جميع الخدمات
docker-compose down

# حذف البيانات (احذر!)
docker-compose down -v

# ابدأ من جديد
docker-compose up -d
```

---

## 📞 الحصول على المساعدة

إذا لم تجد الحل:

1. **اقرأ الـ logs بعناية** - غالباً تحتوي على السبب الحقيقي
2. **اقرأ SETUP_GUIDE.md** - قد تكون المشكلة معروفة
3. **اختبر كل جزء على حدة** - Backend أولاً، ثم Frontend
4. **ابدأ من جديد** - احذف كل شيء وثبّت من الصفر

---

**آخر تحديث**: فبراير 2026  
**الإصدار**: 1.0.0
