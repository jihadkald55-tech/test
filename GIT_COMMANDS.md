# 🔧 أوامر Git - نسخ المشروع إلى GitHub

## نسخ المشروع الآن!

استخدم هذه الأوامر لنسخ المشروع على GitHub:

---

## الخطوة الأولى: تجهيز المستودع المحلي

```bash
# انتقل لمجلد المشروع
cd "C:\Users\dell\Desktop\me\e-court-system"

# تهيئة git إذا لم تكن قد فعلت ذلك
git init

# أضف جميع الملفات
git add .

# أول commit
git commit -m "Initial commit: E-Court System v1.0 - Complete and Secure"

# تأكد من أن الفرع الرئيسي يسمى main
git branch -M main
```

---

## الخطوة الثانية: إنشاء مستودع على GitHub

### على الويب:

1. اذهب إلى: https://github.com/new
2. املأ البيانات:
   - **Repository name**: `e-court-system`
   - **Description**: `A secure and professional electronic court system with Arabic support`
   - اختياري: اختر public/private
3. اضغط **Create repository**

### أو باستخدام GitHub CLI:

```bash
# تثبيت GitHub CLI (إن لم تكن مثبتة)
# Windows: choco install gh
# Mac: brew install gh
# Linux: sudo apt-get install gh

# تسجيل الدخول
gh auth login

# إنشاء المستودع
gh repo create e-court-system --source=. --remote=origin --push
```

---

## الخطوة الثالثة: دفع المشروع إلى GitHub

استبدل `[YOUR_USERNAME]` باسم مستخدمك على GitHub:

```bash
# إضافة remote
git remote add origin https://github.com/[YOUR_USERNAME]/e-court-system.git

# أول push
git push -u origin main
```

---

## ✅ تم!

المشروع الآن على GitHub ويمكن لأي شخص:
- 👀 مشاهدة الكود
- 🔗 استنساخ المشروع
- ⭐ إضافة نجمة
- 🍴 عمل Fork
- 🚀 المساهمة

---

## أوامر git مفيدة للمستقبل

```bash
# رؤية الحالة الحالية
git status

# عرض آخر commits
git log --oneline

# إضافة ملفات جديدة
git add .
git commit -m "Add new feature"
git push

# إنشاء فرع جديد
git checkout -b feature/new-feature
git push -u origin feature/new-feature

# دمج فرع
git checkout main
git merge feature/new-feature
git push
```

---

## 🔐 إعدادات GitHub الموصى بها

### بعد النشر، اذهب للإعدادات:

**Settings → Security & analysis:**
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates
- ✅ Enable Secret scanning

**Settings → Code security and analysis:**
- ✅ Enable code scanning

**Settings → Branches:**
- ✅ Add protection rule for main branch
- ✅ Require pull request reviews
- ✅ Require passing status checks

---

## 📊 إضافة Badge للـ README

أضف هذا للـ README.md:

```markdown
[![Tests](https://github.com/[YOUR_USERNAME]/e-court-system/actions/workflows/ci.yml/badge.svg)](https://github.com/[YOUR_USERNAME]/e-court-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-blue.svg)](https://nextjs.org)
```

---

## 🎯 أفضل الممارسات

### عند كل تطوير جديد:

```bash
# 1. أنشئ فرع جديد
git checkout -b feature/description

# 2. عمل التطوير والاختبار المحلي
# ...

# 3. أضف التغييرات
git add .

# 4. Commit مع رسالة واضحة
git commit -m "feat: add new case submission feature"

# 5. Push الفرع
git push origin feature/description

# 6. على GitHub، افتح Pull Request
# 7. بعد المراجعة والموافقة، دمج مع main
```

---

## 📝 رسائل Commit الجيدة

استخدم هذا النمط:

```
[type]: [description]

[optional body]
[optional footer]

أمثلة:
- feat: add case filtering by status
- fix: resolve database connection issue
- docs: update API documentation
- test: add user authentication tests
- chore: update dependencies
- refactor: optimize case retrieval query
```

---

## 🚨 تجنب الأخطاء الشائعة

❌ لا تضع `node_modules/` أو `.env` (موجود في .gitignore)  
❌ لا تضع بيانات شخصية أو مفاتيح سرية  
❌ لا تضع ملفات ضخمة أو متوسطة الحجم  

---

## 📞 مشاكل وحلول

### خطأ: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/[YOUR_USERNAME]/e-court-system.git
```

### خطأ: "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# تأكد أنك في المجلد الصحيح
cd "C:\Users\dell\Desktop\me\e-court-system"
git remote -v  # لترى remote URLs
```

### تريد مسح آخر commit:
```bash
git reset --soft HEAD~1
git reset HEAD .
# ثم أضف فقط ما تريد:
git add [files]
git commit -m "better message"
```

---

## 🎉 تم!

المشروع الآن:
- ✅ على GitHub
- ✅ مع CI/CD
- ✅ جاهز للتطوير الجماعي
- ✅ يمكن نشره من هنا

---

**الآن يمكن لأي شخص:**

1. 👀 رؤية مشروعك الاحترافي
2. ⭐ إضافة نجمة
3. 🍴 عمل Fork والمساهمة
4. 📊 متابعة التطور
5. 🚀 استخدام الكود

---

**استمتع بمشروعك على GitHub!** 🎯
