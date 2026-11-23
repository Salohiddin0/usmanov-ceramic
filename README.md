# Usmanov Ceramic: saytni ishga tushirish yo'riqnomasi

Bu papkada saytning to'liq kodi bor. Quyidagi qadamlarni tartib bilan bajaring.
Dasturchi bo'lish shart emas, taxminan 1 soat vaqt ketadi.

Sizga kerak bo'ladi: elektron pochta, domen (masalan `usmanovceramic.uz`) va shu papka.

---

## 1-qadam. GitHub: kodni joylash

GitHub — kodingiz saqlanadigan joy. Vercel saytni shu yerdan oladi.

1. **github.com** saytiga kiring va **Sign up** orqali bepul akkaunt oching.
2. O'ng yuqoridagi **+** belgisini bosib, **New repository** ni tanlang.
3. **Repository name:** `usmanov-ceramic`. **Private** ni tanlang va **Create repository** ni bosing.
4. Ochilgan sahifada **uploading an existing file** havolasini bosing.
5. Shu ZIP ichidagi **barcha fayl va papkalarni** sudrab tashlang:
   - ZIP'ni o'zini emas, ochilgan papka ichidagilarni tashlang;
   - `app`, `components`, `lib`, `public`, `supabase` papkalari, `package.json` va boshqa fayllar.
6. Pastdagi **Commit changes** tugmasini bosing.

> `.env.example` va `.gitignore` fayllari nuqta bilan boshlangani uchun ko'rinmasligi mumkin. Ular yuklanmasa ham sayt ishlaydi.

---

## 2-qadam. Supabase: ma'lumotlar bazasi va rasmlar

1. **supabase.com** saytiga kiring, **Start your project** ni bosing va GitHub akkauntingiz bilan kiring.
2. **New project** ni bosing va quyidagilarni kiriting:
   - **Name:** `usmanov-ceramic`
   - **Database Password:** kuchli parol (yozib qo'ying)
   - **Region:** `Central EU (Frankfurt)`

   Keyin **Create new project** ni bosing va 1–2 daqiqa kuting.
3. Chap menyuda **SQL Editor** ni oching va **New query** ni bosing.
4. Shu papkadagi `supabase/schema.sql` faylini oching (Bloknot bilan ham bo'ladi). Matnini **to'liq** nusxalab, SQL Editor'ga qo'ying va **Run** tugmasini bosing.
   - Pastda `Success. No rows returned` chiqishi kerak.
5. Chap pastdagi **Project Settings** (tishli g'ildirak) → **API** (yoki **Data API** / **API Keys**) bo'limiga kiring va 2 ta qiymatni nusxalab qo'ying:
   - **Project URL** (`https://....supabase.co`);
   - **service_role** kaliti. U yashirin turadi: **Reveal** ni bosib, so'ng nusxalang.

> ⚠️ `service_role` kaliti seyf kalitiga o'xshaydi. Uni hech kimga bermang, chatga, Telegram'ga yoki kod ichiga yozmang.
> `anon` kaliti bu saytga kerak emas.

---

## 3-qadam. Vercel: saytni internetga chiqarish

1. **vercel.com** saytiga kiring va **Sign Up** → **Continue with GitHub** orqali kiring. **Hobby** (bepul) tarifni tanlang.
2. **Add New… → Project** ni bosing. Ro'yxatda `usmanov-ceramic` chiqadi, yonidagi **Import** ni bosing.
3. **Environment Variables** bo'limini oching va 4 ta qiymat qo'shing:

| Name (nomi) | Value (qiymati) |
|---|---|
| `SUPABASE_URL` | Supabase'dagi Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase'dagi service_role kaliti |
| `ADMIN_SECRET` | 40+ belgili tasodifiy matn (pastga qarang) |
| `NEXT_PUBLIC_SITE_URL` | `https://usmanovceramic.uz` (o'z domeningiz, oxirida `/` siz) |

   **ADMIN_SECRET** ni qanday olish kerak: istalgan parol generatoridan foydalaning (masalan, telefoningizdagi parol menejeri), 48 ta belgili parol yarating va nusxalang. Uni hech qayerga yozib qo'yish shart emas.

4. **Deploy** ni bosing va 1–3 daqiqa kuting. Tayyor bo'lgach, Vercel sizga `usmanov-ceramic-xxxx.vercel.app` ko'rinishidagi manzil beradi. Sayt allaqachon shu manzilda ishlaydi.

---

## 4-qadam. Domenni ulash

1. Vercel'da loyihangizni oching va **Settings → Domains** bo'limiga kiring.
2. `usmanovceramic.uz` ni yozing va **Add** ni bosing. `www.usmanovceramic.uz` ni ham qo'shing.
3. Vercel sizga DNS yozuvlarini ko'rsatadi (odatda bitta **A** yozuvi va bitta **CNAME** yozuvi).
4. Domenni sotib olgan registrator saytiga kiring, **DNS** sozlamalarini oching va Vercel ko'rsatgan yozuvlarni **aynan o'shandek** qo'shing.
5. Yozuvlar bir necha daqiqadan 24 soatgacha kuchga kiradi. Vercel'da domen yonida yashil belgi chiqsa, tayyor. SSL (https) o'zi ulanadi.

> Domen ulangach, `NEXT_PUBLIC_SITE_URL` qiymati to'g'ri ekanini tekshiring. Agar o'zgartirsangiz, **Deployments** bo'limida oxirgi deployni **Redeploy** qiling.

---

## 5-qadam. Admin panelni sozlash

1. `https://usmanovceramic.uz/admin` manziliga kiring.
2. Birinchi kirish uchun login `admin`, parol `admin123`.
3. **Darhol Xavfsizlik bo'limida** o'z login va parolingizni o'rnating (parol kamida 8 belgi).
4. **Sozlamalar** bo'limida quyidagilarni kiriting:
   - Telegram username, WhatsApp, telefon, email, Facebook, Instagram, manzil va ish vaqti;
   - **Xarita joylashuvi:** Google Maps'da ofisingizni toping, manzil satridagi havolani nusxalab "Xarita havolasi" maydoniga qo'ying, koordinatalar o'zi olinadi.

   Bo'sh qoldirilgan kontaktlar saytda ko'rinmaydi.
5. **Kataloglar** bo'limida 5 ta katalog rasmini va bosh sahifa fon rasmini yuklang.
6. **Mahsulotlar** bo'limida **+ Mahsulot qo'shish** orqali mahsulotlarni rasmi, narxi (1 tonna uchun) va 1 dona og'irligi bilan kiriting. Sayt "1 tonnada taxminan necha dona" ni og'irlikdan o'zi hisoblaydi.
7. **Shartnoma** bo'limida shartlarni o'zingizga moslang.

O'zgarishlar saytda bir necha soniyada ko'rinadi.

---

## 6-qadam. Google va Yandex'da chiqish

1. **Google Search Console:** search.google.com/search-console
   - **Add property → Domain** ni tanlab, domeningizni yozing;
   - Google bergan **TXT** yozuvini registrator DNS'iga qo'shib, tasdiqlang;
   - **Sitemaps** bo'limiga `sitemap.xml` deb yozing va yuboring.
2. **Yandex Webmaster:** webmaster.yandex.ru. Saytni qo'shing, tasdiqlang va `https://usmanovceramic.uz/sitemap.xml` ni yuboring.
3. **Google Business Profile:** business.google.com. Ustaxona yoki ofisingizni xaritada ro'yxatdan o'tkazing. "Keramika" deb qidirilganda xaritada chiqish uchun bu eng muhim qadam.
4. Instagram, Telegram kanal va Facebook sahifangizga sayt havolasini qo'ying.

"Usmanov Ceramic" deb qidirilganda sayt odatda bir necha kundan bir necha haftagacha chiqa boshlaydi.

---

## Kundalik ishlar

| Nima qilmoqchisiz | Qayerda |
|---|---|
| Mahsulot qo'shish, narx yoki rasmni o'zgartirish | Admin → Mahsulotlar |
| Mahsulotni vaqtincha yashirish | Admin → Mahsulotlar → "Saytda" belgisini olib tashlash |
| Telefon, manzil, xarita, ijtimoiy tarmoqlar | Admin → Sozlamalar |
| Katalog yoki bosh sahifa rasmi | Admin → Kataloglar |
| Mijoz xabarlari (qidiruv bilan) | Admin → Xabarlar |
| Tashriflar va so'rovlar | Admin → Statistika |
| Parolni almashtirish | Admin → Xavfsizlik |

**Parolni unutsangiz:** Supabase → **Table Editor** → `admin_users` jadvalidagi qatorni o'chiring. Shundan keyin yana `admin` / `admin123` bilan kirib, yangi parol o'rnatasiz.

---

## Dasturchi uchun

- Next.js (App Router) + Supabase (Postgres va Storage). Til: JavaScript.
- Kompyuterda ishga tushirish: `.env.example` dan `.env.local` yarating, keyin `npm install` va `npm run dev`. Sayt `http://localhost:3000` da ochiladi.
- Matnlar va tarjimalar: `lib/i18n.js`. Dizayn: `app/globals.css`. Logo: `components/Logo.js`.
- Barcha jadvallar RLS bilan yopilgan. Ma'lumotlarni faqat server o'qiydi va yozadi (`SUPABASE_SERVICE_ROLE_KEY`). Admin sessiyasi HMAC bilan imzolangan httpOnly cookie'da saqlanadi.
- Statistika `events` jadvaliga yoziladi. Hisobotni `uc_stats()` SQL funksiyasi tayyorlaydi.
# usmanov-ceramic
