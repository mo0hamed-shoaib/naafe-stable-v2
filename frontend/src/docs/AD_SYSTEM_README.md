# نظام الإعلانات - Naafe

## نظرة عامة

تم تطوير نظام إعلانات شامل لمنصة نافع يتضمن:

- **8 مواقع إعلانية** مختلفة عبر الموقع
- **نظام تسعير مرن** (يومي، أسبوعي، شهري)
- **سياسة استرداد واضحة** بناءً على مدة الإعلان
- **تتبع الأداء** (المشاهدات والنقرات)
- **واجهة مستخدم محسنة** مع Swiper.js

## المواقع الإعلانية

### الصفحة الرئيسية
1. **البانر العلوي** (35 جنيه/يوم)
2. **البانر السفلي** (15 جنيه/يوم)

### صفحة الفئات
1. **البانر العلوي** (35 جنيه/يوم)
2. **البانر السفلي** (15 جنيه/يوم)
3. **إعلان داخلي** (15 جنيه/يوم) - يظهر كل 3-4 عناصر

### صفحة البحث
1. **البانر العلوي** (35 جنيه/يوم)
2. **البانر السفلي** (15 جنيه/يوم)
3. **إعلان داخلي** (15 جنيه/يوم) - يظهر كل 3-4 عناصر

## التسعير

| المدة | البانر العلوي | البانر السفلي/الداخلي |
|-------|---------------|----------------------|
| يومي | 35 جنيه | 15 جنيه |
| أسبوعي | 200 جنيه | 90 جنيه |
| شهري | 750 جنيه | 300 جنيه |

## سياسة الاسترداد

### الإعلانات اليومية
- **استرداد كامل**: قبل بدء الإعلان
- **لا يوجد استرداد**: بعد بدء الإعلان

### الإعلانات الأسبوعية
- **استرداد كامل**: خلال أول 24 ساعة
- **استرداد 75%**: خلال 3 أيام
- **لا يوجد استرداد**: بعد 3 أيام

### الإعلانات الشهرية
- **استرداد كامل**: خلال أول 3 أيام
- **استرداد 75%**: خلال 7 أيام
- **استرداد نسبي**: حتى 15 يوم
- **لا يوجد استرداد**: بعد 15 يوم

## المكونات

### AdBanner
عرض إعلان واحد مع تتبع المشاهدات والنقرات.

```tsx
<AdBanner 
  ad={adData}
  placement="top"
  onImpression={handleImpression}
  onClick={handleClick}
/>
```

### AdCarousel
عرض مجموعة إعلانات مع Swiper.js للتنقل السلس.

```tsx
<AdCarousel
  ads={adsArray}
  placement="top"
  placementId="homepage-top"
  fallbackMessage="أعلن هنا"
  ctaText="اشتر الآن"
/>
```

### AdPlacement
إدارة عرض الإعلانات حسب الموقع والنوع.

```tsx
<AdPlacement
  location="homepage"
  type="top"
  onImpression={handleImpression}
  onClick={handleClick}
/>
```

## API Endpoints

### إنشاء إعلان
```http
POST /api/ads
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "featured",
  "title": "عنوان الإعلان",
  "description": "وصف الإعلان",
  "imageUrl": "https://example.com/image.jpg",
  "targetUrl": "https://example.com",
  "duration": "daily",
  "placement": {
    "id": "homepage-top",
    "location": "homepage",
    "type": "top"
  },
  "targeting": {
    "locations": ["homepage"],
    "categories": [],
    "keywords": []
  }
}
```

### جلب الإعلانات النشطة
```http
GET /api/ads/active?type=top&location=homepage&limit=6
```

### تتبع المشاهدات
```http
POST /api/ads/:id/impression
```

### تتبع النقرات
```http
POST /api/ads/:id/click
```

### إلغاء إعلان
```http
POST /api/ads/:id/cancel
Authorization: Bearer <token>
```

### حساب الاسترداد
```http
POST /api/ads/:id/refund-estimate
Authorization: Bearer <token>
```

## قاعدة البيانات

### نموذج الإعلان (Ad)
```javascript
{
  advertiserId: ObjectId,
  type: String, // featured, sidebar, banner
  title: String,
  description: String,
  imageUrl: String,
  targetUrl: String,
  duration: String, // daily, weekly, monthly
  placement: {
    id: String,
    location: String, // homepage, categories, search
    type: String // top, bottom, sidebar, interstitial
  },
  startDate: Date,
  endDate: Date,
  status: String, // pending, active, paused, completed, rejected, cancelled
  budget: {
    total: Number,
    spent: Number,
    currency: String
  },
  performance: {
    impressions: Number,
    clicks: Number,
    ctr: Number
  },
  stripePaymentIntentId: String,
  stripeRefundId: String
}
```

## الاستخدام

### إضافة إعلانات للصفحة الرئيسية
```tsx
import AdPlacement from '../components/ui/AdPlacement';

// في الصفحة الرئيسية
<div>
  <Hero />
  <AdPlacement location="homepage" type="top" />
  <FeaturedProviders />
  <AdPlacement location="homepage" type="bottom" />
  <Footer />
</div>
```

### إضافة إعلانات لصفحة الفئات
```tsx
// في صفحة الفئات
<div>
  <AdPlacement location="categories" type="top" />
  <CategoriesList />
  <AdPlacement location="categories" type="interstitial" />
  <AdPlacement location="categories" type="bottom" />
</div>
```

## الميزات

### ✅ مكتمل
- [x] نظام المواقع الإعلانية
- [x] التسعير المرن
- [x] سياسة الاسترداد
- [x] تتبع الأداء
- [x] Swiper.js للتنقل
- [x] واجهة مستخدم محسنة
- [x] دعم الهاتف المحمول
- [x] رسائل احتياطية
- [x] تتبع المشاهدات والنقرات

### 🔄 قيد التطوير
- [ ] لوحة تحكم للمعلنين
- [ ] تقارير مفصلة
- [ ] استهداف متقدم
- [ ] إشعارات الأداء
- [ ] تحليلات متقدمة

## الأداء

- **تحميل سريع**: استخدام lazy loading للصور
- **تحسين الشبكة**: ضغط الأصول
- **تجربة سلسة**: انتقالات سلسة مع Swiper.js
- **استجابة كاملة**: دعم جميع أحجام الشاشات

## الأمان

- **تتبع آمن**: لا يتم جمع بيانات شخصية
- **تحقق من الصلاحيات**: فقط المعلن يمكنه إلغاء إعلانه
- **حماية من الاحتيال**: تحقق من صحة الدفعات
- **شفافية كاملة**: عرض واضح للمحتوى الإعلاني

## الصيانة

### إضافة موقع إعلاني جديد
1. إضافة إلى `adPlacements.ts`
2. تحديث النموذج في قاعدة البيانات
3. إضافة المكون في الصفحة المطلوبة

### تعديل التسعير
1. تحديث `adPlacements.ts`
2. تحديث واجهة المستخدم
3. اختبار النظام

### تعديل سياسة الاسترداد
1. تحديث `calculateRefundAmount` في `adService.js`
2. اختبار السيناريوهات المختلفة
3. تحديث الوثائق 