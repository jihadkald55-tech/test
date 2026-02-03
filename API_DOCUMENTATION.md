# API Documentation - النظام القضائي الإلكتروني

## نظرة عامة
جميع طلبات API تتطلب:
- `Content-Type: application/json`
- `Authorization: Bearer <TOKEN>` (باستثناء المصادقة)

---

## المصادقة (Authentication)

### تسجيل مستخدم جديد
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "محمد أحمد",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "phone": "+966551234567",
  "role": "victim"
}
```

**الأدوار المتاحة:**
- `victim` - مضرور/مواطن
- `lawyer` - محام
- `judge` - قاضي
- `admin` - مسؤول النظام

**الرد الناجح (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "محمد أحمد",
    "email": "user@example.com",
    "role": "victim"
  }
}
```

---

### تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**الرد الناجح (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "محمد أحمد",
    "email": "user@example.com",
    "role": "victim"
  }
}
```

---

## إدارة القضايا (Cases)

### تقديم قضية جديدة
```http
POST /api/cases/submit
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "قضية تحرش إلكتروني",
  "description": "وصف تفصيلي شامل للقضية...",
  "severity": "high",
  "isAnonymous": true
}
```

**مستويات الخطورة:**
- `low` - منخفض
- `medium` - متوسط
- `high` - عالي
- `critical` - حرج

**الرد الناجح (201):**
```json
{
  "message": "Case submitted successfully",
  "case": {
    "_id": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-1704066060123-abc123def",
    "title": "قضية تحرش إلكتروني",
    "description": "وصف تفصيلي...",
    "victimId": "507f1f77bcf86cd799439011",
    "status": "submitted",
    "severity": "high",
    "isAnonymous": true,
    "anonymousCaseId": "ANON-A1B2C3D4E5F6G7H8",
    "createdAt": "2024-01-02T10:30:00Z"
  }
}
```

---

### الحصول على قضايا المستخدم
```http
GET /api/cases/my-cases
Authorization: Bearer <TOKEN>
```

**الرد (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "caseNumber": "CASE-1704066060123-abc123def",
    "title": "قضية تحرش إلكتروني",
    "status": "under_review",
    "severity": "high",
    "createdAt": "2024-01-02T10:30:00Z",
    "victimId": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "محمد أحمد"
    }
  }
]
```

**ملاحظة:** تختلف النتائج حسب دور المستخدم:
- **Victim**: قضاياه فقط
- **Lawyer**: القضايا المسندة له
- **Judge**: القضايا المسندة له
- **Admin**: جميع القضايا

---

### الحصول على تفاصيل قضية
```http
GET /api/cases/:caseId
Authorization: Bearer <TOKEN>
```

**المعاملات:**
- `:caseId` - معرف القضية (MongoDB ObjectId)

**الرد (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "caseNumber": "CASE-1704066060123-abc123def",
  "title": "قضية تحرش إلكتروني",
  "description": "وصف تفصيلي...",
  "status": "under_review",
  "severity": "high",
  "isAnonymous": true,
  "anonymousCaseId": "ANON-A1B2C3D4E5F6G7H8",
  "victimId": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "محمد أحمد",
    "email": "victim@example.com"
  },
  "assignedJudgeId": {
    "_id": "607f1f77bcf86cd799439022",
    "fullName": "الدكتور أحمد الشامي",
    "email": "judge@example.com"
  },
  "assignedLawyers": [
    {
      "_id": "707f1f77bcf86cd799439033",
      "fullName": "المحامي محمود",
      "email": "lawyer@example.com"
    }
  ],
  "caseTimeline": [
    {
      "event": "Case submitted",
      "date": "2024-01-02T10:30:00Z",
      "createdBy": "507f1f77bcf86cd799439011"
    },
    {
      "event": "تم تعيين القاضي",
      "date": "2024-01-02T15:00:00Z",
      "createdBy": "admin@example.com"
    }
  ],
  "documents": [
    {
      "_id": "807f1f77bcf86cd799439044",
      "fileName": "evidence.pdf",
      "fileSize": 2048576,
      "createdAt": "2024-01-02T11:00:00Z"
    }
  ],
  "createdAt": "2024-01-02T10:30:00Z"
}
```

---

### تحديث حالة القضية (قضاة وإداريون فقط)
```http
PUT /api/cases/:caseId/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "court_session_scheduled",
  "event": "تمت جدولة جلسة المحكمة للأسبوع المقبل"
}
```

**الحالات المتاحة:**
- `submitted` - مقدمة
- `under_review` - قيد المراجعة
- `court_session_scheduled` - جلسة مجدولة
- `closed` - مغلقة

**الرد (200):**
```json
{
  "message": "Case updated successfully",
  "case": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "court_session_scheduled",
    "caseTimeline": [
      /* ... */
    ]
  }
}
```

---

## إدارة المستندات (Documents)

### رفع مستند
```http
POST /api/documents/upload
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

{
  "file": <binary>,
  "caseId": "507f1f77bcf86cd799439011"
}
```

**شروط الملف:**
- الحد الأقصى: 50 MB
- الأنواع المقبولة:
  - `application/pdf`
  - `image/png`
  - `image/jpeg`
  - `application/msword`

**الرد الناجح (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "_id": "907f1f77bcf86cd799439055",
    "caseId": "507f1f77bcf86cd799439011",
    "fileName": "evidence.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048576,
    "fileHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "uploadedBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-02T11:00:00Z"
  }
}
```

---

### الحصول على مستندات القضية
```http
GET /api/documents/:caseId
Authorization: Bearer <TOKEN>
```

**الرد (200):**
```json
[
  {
    "_id": "907f1f77bcf86cd799439055",
    "caseId": "507f1f77bcf86cd799439011",
    "fileName": "evidence.pdf",
    "fileType": "application/pdf",
    "fileSize": 2048576,
    "fileHash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "محمد أحمد"
    },
    "createdAt": "2024-01-02T11:00:00Z"
  }
]
```

---

## الرسائل المشفرة (Messages)

### إرسال رسالة
```http
POST /api/messages/send
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "caseId": "507f1f77bcf86cd799439011",
  "receiverId": "607f1f77bcf86cd799439022",
  "content": "مرحباً، أود مناقشة بعض نقاط القضية"
}
```

**الرد الناجح (201):**
```json
{
  "message": "Message sent",
  "data": {
    "_id": "a07f1f77bcf86cd799439066",
    "caseId": "507f1f77bcf86cd799439011",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "607f1f77bcf86cd799439022",
    "isRead": false,
    "createdAt": "2024-01-02T12:30:00Z"
  }
}
```

---

### الحصول على محادثة
```http
GET /api/messages/:caseId/:otherUserId
Authorization: Bearer <TOKEN>
```

**الرد (200):**
```json
[
  {
    "_id": "a07f1f77bcf86cd799439066",
    "caseId": "507f1f77bcf86cd799439011",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "607f1f77bcf86cd799439022",
    "content": "مرحباً، أود مناقشة بعض نقاط القضية",
    "isRead": true,
    "createdAt": "2024-01-02T12:30:00Z"
  }
]
```

---

## الإدارة (Admin)

### الحصول على جميع المستخدمين (إداريون فقط)
```http
GET /api/admin/users
Authorization: Bearer <TOKEN>
```

**الرد (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "محمد أحمد",
    "email": "user@example.com",
    "role": "victim",
    "isActive": true,
    "lastLogin": "2024-01-02T12:30:00Z",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

---

### تحديث دور المستخدم (إداريون فقط)
```http
PUT /api/admin/users/:userId/role
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "role": "lawyer"
}
```

**الرد (200):**
```json
{
  "message": "User role updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "محمد أحمد",
    "email": "user@example.com",
    "role": "lawyer"
  }
}
```

---

### إسناد قضية للقاضي (إداريون فقط)
```http
POST /api/admin/cases/assign-judge
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "caseId": "507f1f77bcf86cd799439011",
  "judgeId": "607f1f77bcf86cd799439022"
}
```

**الرد (200):**
```json
{
  "message": "Case assigned to judge",
  "case": {
    "_id": "507f1f77bcf86cd799439011",
    "assignedJudgeId": "607f1f77bcf86cd799439022"
  }
}
```

---

### الحصول على سجلات التدقيق (إداريون فقط)
```http
GET /api/admin/audit-logs
Authorization: Bearer <TOKEN>

# مع المرشحات الاختيارية:
GET /api/admin/audit-logs?action=LOGIN_SUCCESS&startDate=2024-01-01&endDate=2024-01-31
```

**المرشحات:**
- `userId` - معرف المستخدم
- `action` - اسم الإجراء
- `startDate` - تاريخ البداية (YYYY-MM-DD)
- `endDate` - تاريخ النهاية (YYYY-MM-DD)

**الرد (200):**
```json
[
  {
    "_id": "b07f1f77bcf86cd799439077",
    "userId": "507f1f77bcf86cd799439011",
    "action": "CASE_CREATED",
    "resourceType": "Case",
    "resourceId": "507f1f77bcf86cd799439011",
    "timestamp": "2024-01-02T10:30:00Z",
    "status": "success",
    "ipAddress": "192.168.1.1"
  }
]
```

---

## رموز الأخطاء

| الكود | المعنى | المثال |
|------|--------|---------|
| 200 | نجح | تم الحصول على البيانات |
| 201 | تم الإنشاء | تم إنشاء قضية جديدة |
| 400 | طلب خاطئ | بيانات مفقودة |
| 401 | غير مصرح | توكن غير صحيح |
| 403 | ممنوع | لا توجد صلاحيات |
| 404 | غير موجود | القضية غير موجودة |
| 500 | خطأ بالخادم | خطأ داخلي |

---

## أمثلة cURL

### تسجيل الدخول وحفظ التوكن
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' | jq -r '.token')

echo $TOKEN
```

### استخدام التوكن في طلب
```bash
curl -X GET http://localhost:5000/api/cases/my-cases \
  -H "Authorization: Bearer $TOKEN"
```

### تقديم قضية
```bash
curl -X POST http://localhost:5000/api/cases/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "قضية جديدة",
    "description": "وصف القضية",
    "severity": "high",
    "isAnonymous": false
  }'
```

---

## التشفير والأمان

### البيانات المشفرة
- **الرسائل**: مشفرة بـ AES-256
- **المستندات**: محتوى مشفر + بصمة رقمية SHA-256
- **كلمات المرور**: مشفرة بـ bcrypt

### المعايير المستخدمة
- **المصادقة**: JWT (JSON Web Tokens)
- **التشفير**: AES-256-CBC
- **البصمات**: SHA-256
- **تجزئة كلمات المرور**: bcrypt (10 rounds)

---

## الحد من معدل الطلبات (Rate Limiting)

حالياً لا يوجد حد للطلبات، لكن يُنصح بإضافة:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // 100 طلب لكل 15 دقيقة
});

app.use(limiter);
```

---

آخر تحديث: 2024-01-02
