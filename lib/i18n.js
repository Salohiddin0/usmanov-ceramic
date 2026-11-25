// Matnlar 3 tilda. Saytdagi yozuvlarni shu yerda o'zgartirasiz.
export const LANGS = ['uz', 'ru', 'en'];
export const isLang = (l) => LANGS.includes(l);
export const LOCALES = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };

export const T = {
 "uz": {
  "home": "Bosh sahifa",
  "nav_cat": "Katalog",
  "nav_con": "Shartnoma",
  "nav_pay": "To'lov",
  "nav_ctc": "Aloqa",
  "tg": "Telegram'da yozish",
  "hero_t": "Qo'lda yasalgan keramika, faqat optom",
  "hero_s": "Lagan, kosa, piyola, choynak va naborlar. Optom yuklab, O'zbekiston bo'ylab va chet elga jo'natamiz.",
  "cta1": "Katalogni ko'rish",
  "cta2": "Telegram orqali buyurtma",
  "f1": "dona — har mahsulotdan kamida",
  "f2": "dona — har mahsulotdan ko'pi bilan",
  "f3": "minimal buyurtma",
  "how_t": "Buyurtma 4 qadamda",
  "steps": [
   [
    "Mahsulotni tanlang",
    "Katalogdan kerakli mahsulotni oching."
   ],
   [
    "Sonini belgilang",
    "Har bir mahsulotdan 10 dan 1 000 donagacha tanlab, savatga qo'shing."
   ],
   [
    "Savatdan buyurtma bering",
    "Buyurtma kamida 500 kg bo'lsa, ro'yxat Telegram orqali adminga boradi."
   ],
   [
    "Kelishing va oling",
    "Narx, shartnoma va to'lov admin bilan kelishiladi, so'ng yuk jo'natiladi."
   ]
  ],
  "cat_t": "Kataloglar",
  "cat_s": "Narxlar dollarda, 1 dona uchun. Har bir mahsulotdan 10 dan 1 000 donagacha, buyurtma kamida 500 kg.",
  "all": "Barchasini ko'rish",
  "items": "ta mahsulot",
  "perT": "/ 1 T",
  "pcs": "≈ {n} dona / T",
  "order": "Buyurtma berish",
  "back": "← Bosh sahifa",
  "empty": "Bu katalogda hozircha mahsulot yo'q.",
  "loading": "Yuklanmoqda…",
  "load_err": "Ma'lumotlarni yuklab bo'lmadi. Birozdan keyin sahifani yangilang.",
  "con_t": "Shartnoma va shartlar",
  "con_s": "Buyurtma berishdan oldin asosiy qoidalar bilan tanishing.",
  "con_n": "Shartnoma Telegram orqali admin bilan rasmiylashtiriladi.",
  "pay_t": "To'lov bo'yicha biz bilan bog'laning",
  "pay_s": "Saytda to'lov yo'q. Narx, to'lov usuli va muddatlari admin bilan Telegram yoki telefon orqali kelishiladi.",
  "ctc_t": "Aloqa",
  "ctc_s": "Savolingiz bo'lsa yozing, ish vaqtida tez javob beramiz.",
  "f_name": "Ismingiz",
  "f_phone": "Telefon raqamingiz",
  "f_msg": "Xabar",
  "f_send": "Yuborish",
  "f_ok": "Rahmat! Xabaringiz qabul qilindi, tez orada bog'lanamiz.",
  "f_err": "Xabar yuborilmadi. Qayta urinib ko'ring yoki Telegram'da yozing.",
  "f_to": "Yoki to'g'ridan-to'g'ri emailga yozing:",
  "addr_l": "Manzil",
  "hrs_l": "Ish vaqti",
  "open_y": "Yandex xarita",
  "open_g": "Google xarita",
  "fc_t": "Katta hajm kerakmi?",
  "fc_s": "1 000 donadan ko'p buyurtmalar uchun Telegram'da yozing, narx va muddatni kelishamiz.",
  "ft_d": "Qo'lda yasalgan an'anaviy o'zbek keramikasi. Faqat optom savdo, O'zbekiston bo'ylab va eksportga yetkazib berish.",
  "ft_i": "Ma'lumot",
  "rights": "Barcha huquqlar himoyalangan.",
  "ft_w": "Faqat optom: buyurtma kamida 500 kg",
  "m_vol": "Soni (dona)",
  "m_pcs": "Taxminan dona",
  "m_sum": "Taxminiy summa",
  "m_send": "Telegram orqali yuborish",
  "m_more": "1 000 donadan ko'p kerakmi? Telegram'da kelishamiz",
  "m_note": "Yakuniy narx admin bilan kelishiladi.",
  "m_size": "O'lcham",
  "m_w": "1 dona og'irligi",
  "m_price": "Narx",
  "cur": "$",
  "cm": "sm",
  "l": "l",
  "pc": "predmet",
  "T": "T",
  "kg": "kg",
  "msg_o": "Assalomu alaykum! Usmanov Ceramic saytidan buyurtma:\n{p}\nNarx: {price} $ / dona\nHajm: {t} T (≈ {n} dona)",
  "msg_m": "Assalomu alaykum! «{p}» mahsulotidan 1 000 donadan ko'p olmoqchiman. Soni va narxni kelishsak.",
  "msg_h": "Assalomu alaykum! Usmanov Ceramic mahsulotlari bo'yicha savolim bor.",
  "rules": [
   [
    "Minimal va maksimal hajm",
    "Har bir mahsulotdan kamida 10, ko'pi bilan 1 000 dona. Umumiy buyurtma kamida 500 kg bo'lishi kerak. 1 000 donadan ko'p miqdor Telegram orqali alohida kelishiladi."
   ],
   [
    "Faqat optom",
    "Mahsulotlar chakana sotilmaydi. Narxlar 1 dona uchun dollarda ko'rsatilgan."
   ],
   [
    "Narx",
    "Saytdagi narx boshlang'ich. Yakuniy narx hajm, naqsh va yetkazib berishga qarab admin bilan kelishiladi."
   ],
   [
    "To'lov",
    "To'lov tartibi va oldindan to'lov miqdori shartnomada belgilanadi. Saytda to'lov qabul qilinmaydi."
   ],
   [
    "Tayyorlash muddati",
    "Omborda bor mahsulot 3–5 ish kunida yuklanadi; buyurtma asosida tayyorlanadigan mahsulot muddati alohida aytiladi."
   ],
   [
    "Qadoqlash va yetkazish",
    "Har bir buyum qog'ozga o'raladi va qutilarga joylanadi. Yetkazish narxi va transport kelishuv asosida."
   ],
   [
    "Sinish va nuqson",
    "Yuk tushirilayotganda video olinadi. Da'vo 24 soat ichida rasm va video bilan qabul qilinadi."
   ],
   [
    "Hujjatlar",
    "Shartnoma, hisob-faktura va yuk hujjatlari beriladi. Eksport uchun CMR va bojxona hujjatlari kelishiladi."
   ]
  ],
  "see_rules": "Shartnoma shartlari",
  "cat_of": "Katalog",
  "prod_more": "Shu katalogdagi boshqa mahsulotlar",
  "nf_t": "Sahifa topilmadi",
  "nf_s": "Bu manzilda sahifa yo'q.",
  "map_t": "Xaritadagi joylashuv",
  "opt": "optom",
  "per_pc": "/ dona",
  "pcs_word": "dona",
  "box": "Qutida",
  "ton_price": "1 T narxi",
  "m_kg": "Taxminiy og'irligi",
  "qty_hint": "Kamida {min}, ko'pi bilan {max} dona",
  "add_cart": "Savatga qo'shish",
  "added": "Savatga qo'shildi",
  "go_cart": "Savatga o'tish",
  "cart": "Savat",
  "cart_empty": "Savat bo'sh. Katalogdan mahsulot tanlab, savatga qo'shing.",
  "total": "Jami summa",
  "weight": "Umumiy og'irlik",
  "order_btn": "Buyurtma berish",
  "remove": "O'chirish",
  "clear": "Savatni tozalash",
  "clear_sure": "Rostdan tozalansinmi? Yana bir bosing",
  "min_kg": "Buyurtmangiz 500 kg dan kam. Iltimos, buyurtmani kamida 500 kg ga yetkazing. Hozir: {w} kg, yana {r} kg kerak.",
  "no_tg": "Buyurtma qabul qilish hali sozlanmagan. Iltimos, biz bilan telefon orqali bog'laning.",
  "cart_msg": "Assalomu alaykum! Usmanov Ceramic saytidan buyurtma:",
  "cart_sum": "Jami: {sum} $ · ≈ {kg} kg"
 },
 "ru": {
  "home": "Главная",
  "nav_cat": "Каталог",
  "nav_con": "Договор",
  "nav_pay": "Оплата",
  "nav_ctc": "Контакты",
  "tg": "Написать в Telegram",
  "hero_t": "Керамика ручной работы, только оптом",
  "hero_s": "Ляганы, косы, пиалы, чайники и наборы. Отгружаем оптом по Узбекистану и за рубеж.",
  "cta1": "Смотреть каталог",
  "cta2": "Заказать в Telegram",
  "f1": "шт — минимум на товар",
  "f2": "шт — максимум на товар",
  "f3": "минимальный заказ",
  "how_t": "Заказ в 4 шага",
  "steps": [
   [
    "Выберите товар",
    "Откройте нужный товар в каталоге."
   ],
   [
    "Укажите количество",
    "Выберите от 10 до 1 000 шт каждого товара и добавьте в корзину."
   ],
   [
    "Оформите заказ из корзины",
    "Если заказ от 500 кг, список уйдёт администратору в Telegram."
   ],
   [
    "Договоритесь и получите",
    "Цена, договор и оплата согласуются с администратором, затем груз отправляется."
   ]
  ],
  "cat_t": "Каталоги",
  "cat_s": "Цены в долларах за 1 шт. От 10 до 1 000 шт каждого товара, заказ от 500 кг.",
  "all": "Смотреть все",
  "items": "товаров",
  "perT": "/ 1 т",
  "pcs": "≈ {n} шт / т",
  "order": "Заказать",
  "back": "← На главную",
  "empty": "В этом каталоге пока нет товаров.",
  "loading": "Загрузка…",
  "load_err": "Не удалось загрузить данные. Обновите страницу чуть позже.",
  "con_t": "Договор и условия",
  "con_s": "Перед заказом ознакомьтесь с основными правилами.",
  "con_n": "Договор оформляется с администратором в Telegram.",
  "pay_t": "По вопросам оплаты обращайтесь к нам",
  "pay_s": "На сайте нет оплаты. Цена, способ оплаты и сроки согласуются с администратором в Telegram или по телефону.",
  "ctc_t": "Контакты",
  "ctc_s": "Есть вопрос? Напишите, в рабочее время отвечаем быстро.",
  "f_name": "Ваше имя",
  "f_phone": "Ваш телефон",
  "f_msg": "Сообщение",
  "f_send": "Отправить",
  "f_ok": "Спасибо! Сообщение получено, скоро свяжемся.",
  "f_err": "Сообщение не отправлено. Попробуйте ещё раз или напишите в Telegram.",
  "f_to": "Или напишите напрямую на email:",
  "addr_l": "Адрес",
  "hrs_l": "Время работы",
  "open_y": "Яндекс Карты",
  "open_g": "Google Карты",
  "fc_t": "Нужен большой объём?",
  "fc_s": "Для заказов больше 1 000 шт напишите в Telegram, согласуем цену и сроки.",
  "ft_d": "Традиционная узбекская керамика ручной работы. Только оптом, доставка по Узбекистану и на экспорт.",
  "ft_i": "Информация",
  "rights": "Все права защищены.",
  "ft_w": "Только опт: заказ от 500 кг",
  "m_vol": "Количество (шт)",
  "m_pcs": "Примерно штук",
  "m_sum": "Ориентировочная сумма",
  "m_send": "Отправить в Telegram",
  "m_more": "Нужно больше 1 000 шт? Обсудим в Telegram",
  "m_note": "Итоговая цена согласуется с администратором.",
  "m_size": "Размер",
  "m_w": "Вес 1 шт",
  "m_price": "Цена",
  "cur": "$",
  "cm": "см",
  "l": "л",
  "pc": "предметов",
  "T": "т",
  "kg": "кг",
  "msg_o": "Здравствуйте! Заказ с сайта Usmanov Ceramic:\n{p}\nЦена: {price} $ / шт\nОбъём: {t} т (≈ {n} шт)",
  "msg_m": "Здравствуйте! Хочу заказать «{p}» больше 1 000 шт. Давайте обсудим количество и цену.",
  "msg_h": "Здравствуйте! У меня вопрос по продукции Usmanov Ceramic.",
  "rules": [
   [
    "Минимальный и максимальный объём",
    "Каждого товара минимум 10, максимум 1 000 шт. Общий заказ — от 500 кг. Больше 1 000 шт обсуждается отдельно в Telegram."
   ],
   [
    "Только опт",
    "В розницу не продаём. Цены указаны в долларах за 1 шт."
   ],
   [
    "Цена",
    "Цена на сайте начальная. Итоговая цена зависит от объёма, узора и доставки и согласуется с администратором."
   ],
   [
    "Оплата",
    "Порядок оплаты и размер предоплаты фиксируются в договоре. На сайте оплата не принимается."
   ],
   [
    "Сроки",
    "Товар со склада отгружается за 3–5 рабочих дней; срок изготовления под заказ сообщается отдельно."
   ],
   [
    "Упаковка и доставка",
    "Каждое изделие оборачивается бумагой и укладывается в коробки. Стоимость доставки и транспорт по договорённости."
   ],
   [
    "Бой и брак",
    "При разгрузке снимается видео. Претензии принимаются в течение 24 часов с фото и видео."
   ],
   [
    "Документы",
    "Выдаются договор, счёт-фактура и товарные документы. Для экспорта согласуются CMR и таможенные документы."
   ]
  ],
  "see_rules": "Условия договора",
  "cat_of": "Каталог",
  "prod_more": "Другие товары этого каталога",
  "nf_t": "Страница не найдена",
  "nf_s": "По этому адресу страницы нет.",
  "map_t": "Расположение на карте",
  "opt": "оптом",
  "per_pc": "/ шт",
  "pcs_word": "шт",
  "box": "В коробке",
  "ton_price": "Цена за 1 т",
  "m_kg": "Примерный вес",
  "qty_hint": "Минимум {min}, максимум {max} шт",
  "add_cart": "В корзину",
  "added": "Добавлено в корзину",
  "go_cart": "Перейти в корзину",
  "cart": "Корзина",
  "cart_empty": "Корзина пуста. Выберите товары в каталоге и добавьте в корзину.",
  "total": "Итого",
  "weight": "Общий вес",
  "order_btn": "Оформить заказ",
  "remove": "Удалить",
  "clear": "Очистить корзину",
  "clear_sure": "Точно очистить? Нажмите ещё раз",
  "min_kg": "Ваш заказ меньше 500 кг. Пожалуйста, увеличьте заказ минимум до 500 кг. Сейчас: {w} кг, не хватает {r} кг.",
  "no_tg": "Приём заказов ещё не настроен. Пожалуйста, свяжитесь с нами по телефону.",
  "cart_msg": "Здравствуйте! Заказ с сайта Usmanov Ceramic:",
  "cart_sum": "Итого: {sum} $ · ≈ {kg} кг"
 },
 "en": {
  "home": "Home",
  "nav_cat": "Catalog",
  "nav_con": "Contract",
  "nav_pay": "Payment",
  "nav_ctc": "Contact",
  "tg": "Message on Telegram",
  "hero_t": "Handmade ceramics, wholesale only",
  "hero_s": "Platters, bowls, tea bowls, teapots and sets. Shipped wholesale across Uzbekistan and abroad.",
  "cta1": "Browse catalog",
  "cta2": "Order via Telegram",
  "f1": "pcs — minimum per item",
  "f2": "pcs — maximum per item",
  "f3": "minimum order",
  "how_t": "Ordering in 4 steps",
  "steps": [
   [
    "Pick a product",
    "Open the product you need in the catalog."
   ],
   [
    "Set the quantity",
    "Choose 10 to 1,000 pcs of each item and add it to the cart."
   ],
   [
    "Order from the cart",
    "If the order is at least 500 kg, the list goes to our manager on Telegram."
   ],
   [
    "Agree and receive",
    "Price, contract and payment are agreed with the manager, then the load ships."
   ]
  ],
  "cat_t": "Catalogs",
  "cat_s": "Prices in USD per piece. 10 to 1,000 pcs of each item, orders from 500 kg.",
  "all": "View all",
  "items": "products",
  "perT": "/ 1 t",
  "pcs": "≈ {n} pcs / t",
  "order": "Order",
  "back": "← Home",
  "empty": "No products in this catalog yet.",
  "loading": "Loading…",
  "load_err": "Could not load data. Please refresh the page a little later.",
  "con_t": "Contract & terms",
  "con_s": "Please read the main rules before ordering.",
  "con_n": "The contract is finalised with our manager on Telegram.",
  "pay_t": "For payment, please contact us",
  "pay_s": "There is no checkout on the site. Price, payment method and timing are agreed with our manager on Telegram or by phone.",
  "ctc_t": "Contact",
  "ctc_s": "Have a question? Write to us; we reply quickly during working hours.",
  "f_name": "Your name",
  "f_phone": "Phone number",
  "f_msg": "Message",
  "f_send": "Send",
  "f_ok": "Thank you! Your message has been received; we'll be in touch soon.",
  "f_err": "The message was not sent. Please try again or write on Telegram.",
  "f_to": "Or email us directly:",
  "addr_l": "Address",
  "hrs_l": "Working hours",
  "open_y": "Yandex Maps",
  "open_g": "Google Maps",
  "fc_t": "Need a large volume?",
  "fc_s": "For more than 1,000 pcs, write on Telegram and we'll agree price and timing.",
  "ft_d": "Traditional handmade Uzbek ceramics. Wholesale only, delivery across Uzbekistan and for export.",
  "ft_i": "Information",
  "rights": "All rights reserved.",
  "ft_w": "Wholesale only: orders from 500 kg",
  "m_vol": "Quantity (pcs)",
  "m_pcs": "Approx. pieces",
  "m_sum": "Estimated total",
  "m_send": "Send via Telegram",
  "m_more": "Need more than 1,000 pcs? Let's agree on Telegram",
  "m_note": "Final price is agreed with the manager.",
  "m_size": "Size",
  "m_w": "Weight per piece",
  "m_price": "Price",
  "cur": "$",
  "cm": "cm",
  "l": "l",
  "pc": "pieces",
  "T": "t",
  "kg": "kg",
  "msg_o": "Hello! Order from the Usmanov Ceramic website:\n{p}\nPrice: {price} $ / pc\nVolume: {t} t (≈ {n} pcs)",
  "msg_m": "Hello! I'd like more than 1,000 pcs of «{p}». Let's agree on quantity and price.",
  "msg_h": "Hello! I have a question about Usmanov Ceramic products.",
  "rules": [
   [
    "Minimum and maximum volume",
    "Each item: minimum 10, maximum 1,000 pcs. The whole order must be at least 500 kg. More than 1,000 pcs is agreed separately on Telegram."
   ],
   [
    "Wholesale only",
    "No retail sales. Prices are in USD per piece."
   ],
   [
    "Price",
    "Prices on the site are starting prices. The final price depends on volume, pattern and delivery and is agreed with the manager."
   ],
   [
    "Payment",
    "Payment terms and prepayment are set in the contract. No payments are taken on the site."
   ],
   [
    "Lead time",
    "In-stock goods ship in 3–5 working days; made-to-order lead times are quoted separately."
   ],
   [
    "Packing and delivery",
    "Each piece is paper-wrapped and boxed. Delivery cost and transport by agreement."
   ],
   [
    "Breakage and defects",
    "Unloading is filmed. Claims are accepted within 24 hours with photos and video."
   ],
   [
    "Documents",
    "Contract, invoice and shipping documents are provided. CMR and customs papers are arranged for export."
   ]
  ],
  "see_rules": "Contract terms",
  "cat_of": "Catalog",
  "prod_more": "More from this catalog",
  "nf_t": "Page not found",
  "nf_s": "There is no page at this address.",
  "map_t": "Location on the map",
  "opt": "wholesale",
  "per_pc": "/ pc",
  "pcs_word": "pcs",
  "box": "Per box",
  "ton_price": "Price per 1 t",
  "m_kg": "Approx. weight",
  "qty_hint": "Minimum {min}, maximum {max} pcs",
  "add_cart": "Add to cart",
  "added": "Added to cart",
  "go_cart": "Go to cart",
  "cart": "Cart",
  "cart_empty": "Your cart is empty. Pick products in the catalog and add them to the cart.",
  "total": "Total",
  "weight": "Total weight",
  "order_btn": "Place order",
  "remove": "Remove",
  "clear": "Clear cart",
  "clear_sure": "Really clear? Tap again",
  "min_kg": "Your order is under 500 kg. Please bring it up to at least 500 kg. Now: {w} kg, {r} kg more needed.",
  "no_tg": "Ordering is not set up yet. Please contact us by phone.",
  "cart_msg": "Hello! Order from the Usmanov Ceramic website:",
  "cart_sum": "Total: {sum} $ · ≈ {kg} kg"
 }
};

// 5 ta asosiy katalog. Nomlari va rasmlarini admin paneldan o'zgartirish mumkin.
export const CATS = [
 {
  "id": "tovoqlar",
  "art": "plate",
  "name": {
   "uz": "Tovoqlar va laganlar",
   "ru": "Тарелки и ляганы",
   "en": "Plates & platters"
  },
  "desc": {
   "uz": "Dasturxon uchun katta va o'rta tovoqlar",
   "ru": "Большие и средние блюда для дастархана",
   "en": "Large and medium dishes for the table"
  }
 },
 {
  "id": "kosalar",
  "art": "bowl",
  "name": {
   "uz": "Kosalar",
   "ru": "Косы",
   "en": "Bowls (kosa)"
  },
  "desc": {
   "uz": "Sho'rva va ovqat uchun kosalar",
   "ru": "Косы для супа и блюд",
   "en": "Bowls for soup and meals"
  }
 },
 {
  "id": "piyolalar",
  "art": "cup",
  "name": {
   "uz": "Piyolalar",
   "ru": "Пиалы",
   "en": "Tea bowls"
  },
  "desc": {
   "uz": "Choy uchun an'anaviy piyolalar",
   "ru": "Традиционные пиалы для чая",
   "en": "Traditional bowls for tea"
  }
 },
 {
  "id": "choynaklar",
  "art": "pot",
  "name": {
   "uz": "Choynaklar",
   "ru": "Чайники",
   "en": "Teapots"
  },
  "desc": {
   "uz": "Naqshli sopol choynaklar",
   "ru": "Расписные керамические чайники",
   "en": "Hand-painted ceramic teapots"
  }
 },
 {
  "id": "naborlar",
  "art": "set",
  "name": {
   "uz": "Naborlar",
   "ru": "Наборы",
   "en": "Sets"
  },
  "desc": {
   "uz": "Choy va dasturxon naborlari",
   "ru": "Чайные и столовые наборы",
   "en": "Tea and table sets"
  }
 }
];

// Admin paneldagi "Sozlamalar" to'ldirilmaguncha ishlatiladigan qiymatlar.
export const DEFAULT_SITE = {
 tg: '', wa: '', phone: '', email: '', fb: '', ig: '', addr: '',
 lat: null, lng: null,
 hrs: { uz: 'Du–Sha, 9:00–18:00', ru: 'Пн–Сб, 9:00–18:00', en: 'Mon–Sat, 9:00–18:00' },
};
