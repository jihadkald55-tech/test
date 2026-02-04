# ✅ قائمة التحقق قبل النشر للإنتاج

## 🔐 الأمان (Security Checklist)

- [ ] **JWT Secret تم تغييره**
  ```bash
  # استخدم قيمة قوية بـ 32 حرف على الأقل
  JWT_SECRET=<strong-random-string>
  ```

- [ ] **Encryption Key تم تغييره**
  ```bash
  ENCRYPTION_KEY=<32-character-key>
  ```

- [ ] **Database credentials تم تحديثها**
  ```bash
  MONGODB_URI=mongodb://strong_username:strong_password@hostname:port/database
  ```

- [ ] **NODE_ENV = production**
  ```bash
  NODE_ENV=production
  ```

- [ ] **HTTPS مفعّل**
  - استخدم SSL/TLS certificate
  - اختبر مع https://www.ssllabs.com/

- [ ] **CORS محدود بالنطاقات المسموحة**
  ```bash
  FRONTEND_URL=https://yourdomain.com
  CORS_ORIGIN=https://yourdomain.com
  ```

- [ ] **لا توجد كلمات مرور في الكود**
  - كل شيء في `.env` فقط
  - لا تضعف `.env` على GitHub

- [ ] **Helmet مفعّل** (للأمان HTTP)
  ```javascript
  app.use(helmet());
  ```

- [ ] **CSRF protection مفعّل**
- [ ] **Rate limiting مفعّل** (منع الـ DDoS)
- [ ] **Input validation مفعّل**

---

## 🗄️ قاعدة البيانات (Database)

- [ ] **MongoDB مشفر** (في الإنتاج)
  - استخدم MongoDB Atlas بـ encryption
  - لا تستخدم localhost

- [ ] **النسخ الاحتياطية مفعّلة**
  ```bash
  # اختبر النسخ الاحتياطية التلقائية
  mongodump --uri "mongodb+srv://..."
  ```

- [ ] **Indexes تم إنشاؤها** (للأداء)
  ```javascript
  // في models:
  casesSchema.index({ status: 1, createdAt: -1 });
  usersSchema.index({ email: 1 }, { unique: true });
  ```

- [ ] **Connection pooling معروف**
  ```bash
  MONGODB_POOL_SIZE=10
  MONGODB_MAX_IDLE_TIME=45000
  ```

- [ ] **لا توجد بيانات حساسة في logs**
- [ ] **Audit logs مفعّل** ومحفوظ

---

## 🚀 الخادم (Backend)

- [ ] **Error handling صحيح**
  - لا تُظهر stack traces في الإنتاج
  - رسائل خطأ عامة للمستخدم

- [ ] **Logging مناسب**
  ```bash
  npm install winston
  # أو morgan للـ HTTP logs
  ```

- [ ] **Environment variables معرّفة**
  ```bash
  PORT=5000
  NODE_ENV=production
  MONGODB_URI=...
  JWT_SECRET=...
  ENCRYPTION_KEY=...
  FRONTEND_URL=...
  ```

- [ ] **Health check endpoint موجود**
  ```bash
  curl https://api.yourdomain.com/api/health
  ```

- [ ] **API documentation محدثة**
  - اقرأ API_DOCUMENTATION.md
  - اختبر جميع endpoints

- [ ] **Performance tested**
  - اختبر مع AB أو Apache JMeter
  - استهدف: 1000+ requests/second

- [ ] **Memory leaks تم فحصها**
  - استخدم node --inspect
  - قياس الذاكرة مع time

---

## 🎨 Frontend (Next.js)

- [ ] **Production build اختُبر**
  ```bash
  npm run build
  npm start
  ```

- [ ] **Lighthouse score عالي**
  - جودة > 90
  - أداء > 90
  - SEO > 90
  - Accessibility > 90

- [ ] **Images محسَّنة**
  - استخدم next/image
  - WebP format عند الإمكان
  - lazy loading مفعّل

- [ ] **Code splitting صحيح**
  - dynamic imports للـ large components
  - No large bundles

- [ ] **Analytics مثبتة** (اختياري)
  ```bash
  npm install next-google-analytics
  ```

- [ ] **SEO محسَّن**
  - Meta tags صحيحة
  - Open Graph tags موجودة
  - Sitemap موجود

- [ ] **PWA support** (اختياري)
  - Service Worker مفعّل
  - Offline support

---

## 🔗 التكامل والاختبار

- [ ] **API endpoints اختُبرت يدوياً**
  ```bash
  # اختبر جميع endpoints الرئيسية:
  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/cases
  - GET /api/cases
  - PUT /api/cases/:id
  - DELETE /api/cases/:id
  ```

- [ ] **Authentication تعمل**
  - تسجيل دخول/خروج
  - توكنات JWT تعمل
  - تحديث التوكن (refresh)

- [ ] **Authorization تعمل**
  - RBAC صحيح
  - Users لا يمكنهم الوصول لبيانات الآخرين
  - Admins فقط يمكنهم إدارة المستخدمين

- [ ] **File uploads آمنة**
  - حد أقصى للحجم معرّف
  - أنواع الملفات محدودة
  - Malware scanning مفعّل (CloudScan)

- [ ] **Encryption/Decryption يعمل**
  - الرسائل مشفرة
  - المستندات محمية
  - المفاتيح آمنة

- [ ] **Audit logging يعمل**
  - جميع الإجراءات مسجلة
  - لا يمكن تعديل السجلات
  - الوقت دقيق (UTC)

---

## 📊 المراقبة والتنبيهات

- [ ] **Monitoring tools مثبتة**
  ```bash
  # استخدم PM2 أو Forever:
  npm install -g pm2
  pm2 start server.js --name "ecourt-backend"
  ```

- [ ] **Log aggregation مثبتة** (Datadog, CloudWatch, etc)

- [ ] **Error tracking مثبتة** (Sentry)
  ```bash
  npm install @sentry/node
  ```

- [ ] **Performance monitoring مثبتة** (New Relic)

- [ ] **Health checks مفعّلة**
  - Backend health endpoint
  - Database connectivity
  - API response time

- [ ] **Alerts معرّفة**
  - إذا API down
  - إذا Database down
  - إذا Memory usage عالي

---

## 🚢 نشر (Deployment)

### قبل الدفع للإنتاج:

- [ ] **نسخة احتياطية من البيانات الحالية**
  ```bash
  mongodump --uri "mongodb+srv://..." --out backup/
  ```

- [ ] **إصدار نسخة جديدة**
  - التاج: v1.0.0
  - الملاحظات: تحديثات الأمان والأداء

- [ ] **تعليمات التشغيل معروّفة**
  - README محدّث
  - Migration scripts موجودة
  - Rollback plan معروف

- [ ] **تحضير عملية التشغيل**
  - Deployment checklist
  - Rollback procedure
  - Down-time window معروف

---

## 🔄 بعد النشر

- [ ] **اختبر الموقع مباشرة**
  ```bash
  curl https://yourdomain.com
  ```

- [ ] **اختبر API**
  ```bash
  curl https://api.yourdomain.com/api/health
  ```

- [ ] **اختبر Authentication**
  - سجّل دخول
  - استخدم الموقع

- [ ] **راقب الـ logs**
  ```bash
  docker logs ecourt_backend -f
  ```

- [ ] **تحقق من الأداء**
  - Lighthouse
  - WebPageTest
  - GTmetrix

- [ ] **أخبر المستخدمين** (إن أمكن)

---

## 🎯 SLA والأهداف

| المقياس | الهدف |
|--------|------|
| Uptime | 99.9% (44 دقيقة/شهر) |
| Response Time | < 200ms |
| Error Rate | < 0.1% |
| DB Latency | < 50ms |
| Page Load Time | < 2s |

---

## 📋 توثيق نشر

املأ هذا بعد كل نشر:

```markdown
## نشر الإنتاج - [التاريخ]

**الإصدار**: v1.0.0  
**الوقت**: 2026-02-04 10:00 AM UTC  
**المدة**: 5 دقائق  
**الحالة**: ✅ نجح

### التغييرات:
- تحديثات الأمان
- تحسينات الأداء
- إصلاح الأخطاء

### المشاكل:
- بدون مشاكل

### الخطوات التالية:
- مراقبة الأداء لـ 24 ساعة
- تجميع ملاحظات المستخدمين
```

---

**آخر تحديث**: فبراير 2026  
**الحالة**: ✅ جاهز للإنتاج
