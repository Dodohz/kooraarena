# 🏆 KooraArena - منصة بث مباريات كرة القدم

**KooraArena** هي منصة احترافية لمشاهدة معلومات مباريات كرة القدم المباشرة والتفاصيل الشاملة.

---

## 🌐 Languages / اللغات

- ✅ **العربية** (Arabic)
- ✅ **الإنجليزية** (English)

---

## 🎯 المميزات الرئيسية

### ✨ الميزات
- 📺 عرض المباريات القادمة والجارية والانتهت
- 🔍 البحث والفلترة حسب الدوريات والفرق
- ⭐ حفظ المباريات المفضلة
- 🔔 إشعارات للمباريات المهمة
- 📊 الإحصائيات والترتيب
- 🎨 تصميم احترافي وسريع
- 📱 متوافق مع جميع الأجهزة
- 🌙 وضع ليلي

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 16+ 
- npm أو yarn
- Git

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/Dodohz/kooraarena.git
cd kooraarena

# تثبيت المكتبات
npm install

# التشغيل
npm start
```

---

## 📋 متطلبات API

سيتم استخدام **API-FOOTBALL** من RapidAPI

### الخطوات:
1. اذهب إلى [RapidAPI](https://rapidapi.com)
2. ابحث عن **API-FOOTBALL**
3. اشترك في الخطة المجانية
4. انسخ API Key
5. أنشئ ملف `.env` وأضف:
   ```
   REACT_APP_API_KEY=YOUR_API_KEY_HERE
   REACT_APP_API_HOST=api-football-v1.p.rapidapi.com
   REACT_APP_API_BASE_URL=https://api-football-v1.p.rapidapi.com
   ```

---

## 📁 هيكل المشروع

```
kooraarena/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MatchCard.tsx
│   │   └── NotificationCenter.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Matches.tsx
│   │   ├── Standings.tsx
│   │   ├── Teams.tsx
│   │   └── Favorites.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── hooks/
│   │   ├── useMatches.ts
│   │   ├── useFavorites.ts
│   │   └── useNotification.ts
│   ├── services/
│   │   └── api.ts
│   ├── i18n/
│   │   ├── en.json
│   │   └── ar.json
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── DEPLOYMENT.md
```

---

## 🛠️ التكنولوجيا المستخدمة

### Frontend
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - أمان الكود والتصحيح
- **Tailwind CSS** - تصميم احترافي
- **React Router** - التنقل بين الصفحات
- **Context API** - إدارة الحالة
- **i18next** - دعم اللغات المتعددة
- **Axios** - مكتبة HTTP
- **React Toastify** - الإشعارات
- **Lucide React** - الأيقونات

---

## 📚 الكود النموذجي

### استخدام Hook للحصول على المباريات

```typescript
import { useMatches } from './hooks/useMatches';

function MatchesList() {
  const { matches, loading, error } = useMatches();

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <MatchCard key={match.fixture.id} match={match} />
      ))}
    </div>
  );
}
```

---

## 🚀 النشر

### على Vercel (Frontend)

```bash
npm install -g vercel
vercel
```

### على Railway (Backend - إذا أضفنا API لاحقاً)

1. اذهب إلى railway.app
2. ربط GitHub
3. اختر المستودع
4. Deploy!

---

## 📖 الوثائق الإضافية

- [API-FOOTBALL Documentation](https://api-sports.io/documentation/football/v3)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [اطلع على DEPLOYMENT.md للنشر الكامل](./DEPLOYMENT.md)

---

## 🤝 المساهمة

نرحب بالمساهمات! يمكنك:
1. Fork المستودع
2. أنشئ فرع جديد
3. أرسل Pull Request

---

## 📄 الترخيص

MIT License - استخدم المشروع بحرية!

---

## 📧 التواصل

إذا واجهت أي مشاكل أو لديك اقتراحات:
- 🐛 GitHub Issues
- 📧 أنشئ Discussion

---

**Made with ❤️ by Dodohz**
