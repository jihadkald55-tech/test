# 🚀 دليل النشر والتشغيل - E-Court System

## المتطلبات النظامية

### على جهازك المحلي (Local Development)
- **Node.js**: الإصدار 18.x أو أحدث
- **npm**: الإصدار 9.x أو أحدث
- **MongoDB**: الإصدار 5.x أو أحدث (تشغيل محلي أو سحابة Atlas)
- **Git**: لإدارة الإصدار

---

## 1️⃣ التشغيل المحلي (Local Setup)

### الخطوة الأولى: تنزيل المشروع
```bash
# استنساخ المشروع
git clone https://github.com/[username]/e-court-system.git
cd e-court-system
```

### الخطوة الثانية: إعداد الخادم الخلفي (Backend)

```bash
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
cp .env.example .env
```

**تحرير ملف `.backend/.env`:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecourt
JWT_SECRET=your-super-secret-key-32-chars
JWT_EXPIRE=7d
NODE_ENV=development
ENCRYPTION_KEY=your-encryption-key-32-characters-long
FRONTEND_URL=http://localhost:3000
```

**تشغيل الخادم:**
```bash
npm run dev
```

✅ سيظهر: `E-Court Backend running on port 5000`

### الخطوة الثالثة: إعداد الواجهة الأمامية (Frontend)

**في نافذة terminal جديدة:**

```bash
cd frontend

# تثبيت المكتبات
npm install

# إنشاء ملف .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

# تشغيل الواجهة
npm run dev
```

✅ الموقع سيكون متاحاً على: **http://localhost:3000**

---

## 2️⃣ إعداد MongoDB

### خيار 1: MongoDB محلي
```bash
# على Windows
mongod --dbpath "C:\data\db"

# على Mac/Linux
mongod --dbpath /usr/local/var/mongodb
```

### خيار 2: MongoDB Atlas (السحابة)
1. انتقل إلى https://www.mongodb.com/cloud/atlas
2. أنشئ حساب مجاني
3. أنشئ cluster جديد
4. احصل على connection string
5. أضفه في `.env` كـ `MONGODB_URI`

---

## 3️⃣ الحسابات الاختبار

### حسابات تجريبية:

**الضحية (Victim):**
```
Email: victim@example.com
Password: password123
```

**المحامي (Lawyer):**
```
Email: lawyer@example.com
Password: password123
```

**القاضي (Judge):**
```
Email: judge@example.com
Password: password123
```

**المسؤول (Admin):**
```
Email: admin@example.com
Password: password123
```

---

## 4️⃣ النشر على الإنترنت (Production Deployment)

### الخيار الأول: Render.com (موصى به)

#### نشر الخادم الخلفي:
1. اذهب إلى https://render.com
2. اختر "New+" → "Web Service"
3. اربط مستودع GitHub الخاص بك
4. الإعدادات:
   - **Name**: ecourt-backend
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - أضف Environment Variables:
     ```
     MONGODB_URI=your-atlas-connection-string
     JWT_SECRET=your-secret-key
     ENCRYPTION_KEY=your-encryption-key
     NODE_ENV=production
     FRONTEND_URL=your-frontend-url
     ```

#### نشر الواجهة الأمامية:
1. اختر "New+" → "Static Site"
2. اربط نفس مستودع GitHub
3. الإعدادات:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/.next/out`
   - أضف Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=your-backend-url/api
     ```

### الخيار الثاني: Vercel (للواجهة الأمامية فقط)

1. اذهب إلى https://vercel.com
2. اختر "Import Project"
3. اربط مستودع GitHub
4. الإعدادات:
   - **Root Directory**: `frontend`
   - أضف Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=your-backend-api-url
     ```
5. اضغط "Deploy"

### الخيار الثالث: Heroku (توقف المجاني)

```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create ecourt-backend

# إضافة متغيرات البيئة
heroku config:set MONGODB_URI=your-uri
heroku config:set JWT_SECRET=your-secret

# النشر
git push heroku main
```

---

## 5️⃣ قائمة التحقق قبل النشر

- [ ] تم تعديل جميع `JWT_SECRET` و `ENCRYPTION_KEY`
- [ ] تم إعداد MongoDB في الإنتاج
- [ ] تم اختبار جميع المميزات محلياً
- [ ] تم إضافة ملف `.gitignore`
- [ ] تم حذف بيانات الاختبار الحساسة
- [ ] تم تفعيل HTTPS على الخادم
- [ ] تم إضافة CORS الصحيح
- [ ] تم اختبار الخطأ handling
- [ ] تم إعداد النسخ الاحتياطية للقاعدة
- [ ] تم اختبار الأداء والأمان

---

## 6️⃣ معالجة المشاكل الشائعة

### المشكلة: Connection Refused (رفض الاتصال)
```bash
# تحقق من أن الخادم يعمل
curl http://localhost:5000/api/health

# أعد تشغيل الخادم
npm run dev
```

### المشكلة: MongoDB Connection Error
```bash
# تحقق من أن MongoDB يعمل
mongosh

# أو استخدم MongoDB Atlas
# والتحقق من connection string
```

### المشكلة: CORS Error
تأكد من أن `FRONTEND_URL` محدثة في `.env` الخاص بالخادم

### المشكلة: Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID]
```

---

## 7️⃣ أوامر مفيدة

```bash
# تطوير
npm run dev        # تشغيل في وضع التطوير

# الإنتاج
npm run build      # بناء الإصدار النهائي
npm run start      # تشغيل الإنتاج

# الاختبار
npm run lint       # فحص الأخطاء
npm test          # تشغيل الاختبارات

# التنظيف
rm -rf node_modules
npm install        # إعادة تثبيت
```

---

## 📞 دعم إضافي

للمساعدة والأسئلة:
- 📧 البريد: support@ecourt.com
- 🐙 GitHub Issues: https://github.com/[username]/e-court-system/issues
- 💬 Discord: https://discord.gg/ecourt

---

**آخر تحديث**: فبراير 2026
**الإصدار**: 1.0.0
