// store.js - لایه داده سایت (تنها نقطه‌ای که صفحه‌ها داده می‌گیرند)
//
// ساختار: مقادیر پیش‌فرض در DEFAULTS (پایین همین فایل) هستند. هر تغییری که پنل مدیریت با Store.set() ذخیره کند
// در localStorage نگه داشته می‌شود و روی پیش‌فرض اولویت دارد.
//
// برای وصل شدن به بک‌اند در آینده فقط بدنه‌ی Store.get / Store.set (در همین فایل) عوض می‌شود؛
// صفحه‌ها فقط از Store و توابع کمکی پایین (getProducts, getSettings, calcShipping, ...) استفاده می‌کنند.
//
// مجموعه‌ها (collections): settings, products, categories, brands, slides, banners, posts, orders,
//                          nav, megaBottom, homeSections, footer
// توضیح فیلدها: فایل DATA-SCHEMA.md

const toPersianNum = num => num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const DB_KEY = 'mega_abzar_db_v1';

const DEFAULTS = {
 "settings": {
  "store": {
   "name": "مگا ابزار",
   "slogan": "فروشگاه تخصصی ابزارآلات صنعتی و کارگاهی",
   "logo": "image.png",
   "phone": "۰۸۷-۱۲۳۴۵۶۷۸",
   "address": "بانه، میدان جهاد، مجتمع تجاری مگا ابزار، پلاک ۱۲",
   "workingHours": "پاسخگویی از ساعت ۸ صبح تا ۸ شب",
   "email": "",
   "currency": "تومان"
  },
  "shipping": {
   "enabled": true,
   "freeFrom": 5000000,
   "fee": 150000,
   "freeFromEnabled": true,
   "productRule": "all",
   "freeLabel": "رایگان"
  },
  "offer": {
   "enabled": true,
   "countdownEnabled": true,
   "countdownSeconds": 26925,
   "resetSeconds": 28800
  },
  "catalog": {
   "priceMax": 35000000,
   "priceMin": 1000000,
   "pageTitle": "کاتالوگ جامع ابزارآلات صنعتی و کارگاهی",
   "allBreadcrumb": "همه ابزارآلات صنعتی"
  },
  "payment": {
   "methods": [
    {"id":"cod","label":"پرداخت در محل (هنگام تحویل)","description":"مبلغ سفارش هنگام تحویل کالا پرداخت می‌شود.","enabled":true},
    {"id":"card","label":"کارت به کارت","description":"پس از ثبت سفارش، مبلغ را به کارت زیر واریز کنید و رسید را برای ما ارسال کنید.","cardNumber":"","cardOwner":"","enabled":true},
    {"id":"online","label":"پرداخت آنلاین (درگاه بانکی)","description":"نیازمند اتصال به درگاه پرداخت و بک‌اند است.","enabled":false}
   ]
  },
  "powerTypes": [
   {
    "value": "برقی",
    "label": "برقی (۲۲۰ ولت)"
   },
   {
    "value": "شارژی",
    "label": "شارژی (باتری لیتیوم)"
   },
   {
    "value": "دستی",
    "label": "دستی / مکانیکی"
   }
  ]
 },
 "products": DEFAULT_PRODUCTS,
 "categories": [
  {
   "id": "power-tools",
   "title": "ابزار برقی و شارژی",
   "icon": "⚡",
   "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c",
   "countLabel": "۳۴۰+ محصول",
   "sheetTitle": "ابزار برقی و شارژی",
   "active": true,
   "order": 1,
   "menu": {
    "mainLabel": "همه محصولات ابزار برقی و شارژی",
    "viewAllLabel": "مشاهده آرشیو کامل (۳۴۰+ کالا)",
    "columns": [
     {
      "title": "دریل و پیچ‌گوشتی",
      "link": "catalog.html?cat=power-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       },
       {
        "label": "دریل چکشی دیوالت DWD024",
        "link": "product.html?id=1",
        "badge": "پرفروش"
       },
       {
        "label": "دریل شارژی براشلس میلواکی",
        "link": "product.html?id=5",
        "badge": ""
       },
       {
        "label": "دریل گیربکسی دو سرعته",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       },
       {
        "label": "دریل ستونی کارگاهی",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       }
      ]
     },
     {
      "title": "فرز و پولیش صنعتی",
      "link": "catalog.html?cat=power-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       },
       {
        "label": "مینی‌فرز دسته بلند ماکیتا",
        "link": "product.html?id=2",
        "badge": "اصل"
       },
       {
        "label": "فرز آهنگری سنگین AEG",
        "link": "product.html?id=7",
        "badge": ""
       },
       {
        "label": "مینی‌فرز دیمردار",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       },
       {
        "label": "پولیش اوربیتال خودرو",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       }
      ]
     },
     {
      "title": "تخریب و برش سنگین",
      "link": "catalog.html?cat=power-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=power-tools",
        "badge": ""
       },
       {
        "label": "بتن‌کن ۴ شیار هیلتی TE 2",
        "link": "product.html?id=6",
        "badge": ""
       },
       {
        "label": "چکش تخریب ۱۶ کیلویی ماکیتا",
        "link": "product.html?id=104",
        "badge": ""
       },
       {
        "label": "بکس شارژی دیوالت DCF899",
        "link": "product.html?id=101",
        "badge": "۲۲٪-"
       },
       {
        "label": "اره پروفیل‌بر صنعتی AEG",
        "link": "product.html?id=106",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "product.html?id=101",
     "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c",
     "tag": "🔥 پیشنهاد ویژه بانه",
     "title": "بکس شارژی براشلس دیوالت ۲۰ ولت",
     "priceText": "۱۱,۳۱۰,۰۰۰ تومان"
    }
   }
  },
  {
   "id": "welding",
   "title": "اینورتر و جوشکاری",
   "icon": "🔥",
   "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
   "countLabel": "۱۲۰+ محصول",
   "sheetTitle": "اینورتر و جوشکاری",
   "active": true,
   "order": 2,
   "menu": {
    "mainLabel": "همه تجهیزات اینورتر و جوشکاری",
    "viewAllLabel": "مشاهده آرشیو کامل (۱۲۰+ کالا)",
    "columns": [
     {
      "title": "اینورتر جوشکاری IGBT",
      "link": "catalog.html?cat=welding",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "اینورتر ۲۵۰ آمپر رونیکس",
        "link": "product.html?id=102",
        "badge": "۱۸٪-"
       },
       {
        "label": "اینورتر ۲۰۰ آمپر دو ولوم",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "اینورتر ۳۰۰ و ۴۰۰ آمپر صنعتی",
        "link": "catalog.html?cat=welding",
        "badge": ""
       }
      ]
     },
     {
      "title": "جوش تخصصی و برش",
      "link": "catalog.html?cat=welding",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "دستگاه جوش میگ‌مگ (CO2)",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "دستگاه جوش آرگون (TIG)",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "برش پلاسما هوایی",
        "link": "catalog.html?cat=welding",
        "badge": ""
       }
      ]
     },
     {
      "title": "لوازم و ایمنی جوش",
      "link": "catalog.html?cat=welding",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "ماسک جوشکاری اتوماتیک",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "انبر جوش و انبر اتصال مس",
        "link": "catalog.html?cat=welding",
        "badge": ""
       },
       {
        "label": "کابل جوش نسوز تمام مس",
        "link": "catalog.html?cat=welding",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "product.html?id=102",
     "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
     "tag": "⚡ پرفروش‌ترین دستگاه جوش",
     "title": "اینورتر ۲۵۰ آمپر صنعتی رونیکس",
     "priceText": "۶,۳۹۰,۰۰۰ تومان"
    }
   }
  },
  {
   "id": "hand-tools",
   "title": "ابزار دستی و مکانیکی",
   "icon": "🔧",
   "image": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
   "countLabel": "۵۲۰+ محصول",
   "sheetTitle": "ابزار دستی و مکانیکی",
   "active": true,
   "order": 3,
   "menu": {
    "mainLabel": "همه ابزارهای دستی و مکانیکی",
    "viewAllLabel": "مشاهده آرشیو کامل (۵۲۰+ کالا)",
    "columns": [
     {
      "title": "ست بکس و آچارآلات",
      "link": "catalog.html?cat=hand-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "مجموعه ۱۲۸ عددی رونیکس",
        "link": "product.html?id=3",
        "badge": "ارسال رایگان"
       },
       {
        "label": "ست آچار یکسر رینگ کروم",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "آچار جغجغه و بکس فشارقوی",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       }
      ]
     },
     {
      "title": "جعبه ابزار و کیف",
      "link": "catalog.html?cat=hand-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "پک کیف ضدضربه میلواکی M18",
        "link": "product.html?id=105",
        "badge": ""
       },
       {
        "label": "جعبه ابزار فلزی تاشو",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "کیف کمری و کوله‌پشتی ابزار",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       }
      ]
     },
     {
      "title": "انبر و پیچ‌گوشتی",
      "link": "catalog.html?cat=hand-tools",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "ست انبردست، سیم‌چین و دم‌باریک",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "انبرقفلی و آچار شلاقی",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       },
       {
        "label": "ست پیچ‌گوشتی ضربه‌خور",
        "link": "catalog.html?cat=hand-tools",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "product.html?id=3",
     "image": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
     "tag": "🔧 پک کامل مکانیکی",
     "title": "مجموعه ۱۲۸ عددی ابزار دستی رونیکس",
     "priceText": "۵,۲۰۰,۰۰۰ تومان"
    }
   }
  },
  {
   "id": "measuring",
   "title": "تراز لیزری و ابزار دقیق",
   "icon": "📏",
   "image": "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
   "countLabel": "۹۵+ محصول",
   "sheetTitle": "تراز لیزری و دقیق",
   "active": true,
   "order": 4,
   "menu": {
    "mainLabel": "همه تجهیزات تراز لیزری و ابزار دقیق",
    "viewAllLabel": "مشاهده آرشیو کامل (۹۵+ کالا)",
    "columns": [
     {
      "title": "تراز و متر لیزری",
      "link": "catalog.html?cat=measuring",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "متر لیزری ۵۰ متری بوش GLM",
        "link": "product.html?id=4",
        "badge": "بلوتوث"
       },
       {
        "label": "تراز لیزری ۳۶۰ درجه کرون",
        "link": "product.html?id=8",
        "badge": ""
       },
       {
        "label": "تراز لیزری ۴ بعدی نور سبز",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       }
      ]
     },
     {
      "title": "ابزار دقیق مکانیکی",
      "link": "catalog.html?cat=measuring",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "کولیس دیجیتال و ورنیه",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "میکرومتر و ساعت اندیکاتور",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "ترکمتر (آچار گشتاورسنج)",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       }
      ]
     },
     {
      "title": "تستر برق و دما",
      "link": "catalog.html?cat=measuring",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "مولتی‌متر و کلمپ‌متر دیجیتال",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       },
       {
        "label": "تب‌سنج و دماسنج لیزری صنعتی",
        "link": "catalog.html?cat=measuring",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "product.html?id=4",
     "image": "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
     "tag": "📏 دقت میلی‌متری",
     "title": "متر لیزری بوش مدل GLM 50 C",
     "priceText": "۴,۱۰۰,۰۰۰ تومان"
    }
   }
  },
  {
   "id": "pneumatic",
   "title": "ابزار بادی و کمپرسور",
   "icon": "💨",
   "image": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407",
   "countLabel": "۱۵۰+ محصول",
   "sheetTitle": "ابزار بادی و کمپرسور",
   "active": true,
   "order": 5,
   "menu": {
    "mainLabel": "همه محصولات ابزار بادی و کمپرسور",
    "viewAllLabel": "مشاهده آرشیو کامل (۱۵۰+ کالا)",
    "columns": [
     {
      "title": "کارواش و کمپرسور",
      "link": "catalog.html?cat=pneumatic",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "کارواش دینامی ۱۴۰ بار بوش",
        "link": "product.html?id=103",
        "badge": "۲۵٪-"
       },
       {
        "label": "کمپرسور باد ۵۰ لیتری سایلنت",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "کمپرسور باد فندکی دو سیلندر",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       }
      ]
     },
     {
      "title": "ابزارهای پنوماتیک",
      "link": "catalog.html?cat=pneumatic",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "بکس بادی جغجغه‌ای و تفنگی",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "میخکوب و منگنه‌کوب بادی",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       }
      ]
     },
     {
      "title": "پاشش رنگ و باد",
      "link": "catalog.html?cat=pneumatic",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "پیستوله رنگ‌پاش کاسه رو",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       },
       {
        "label": "شیلنگ فنری و بادپاش",
        "link": "catalog.html?cat=pneumatic",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "product.html?id=103",
     "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
     "tag": "💨 موتور القایی",
     "title": "کارواش صنعتی دینامی بوش ۱۴۰ بار",
     "priceText": "۶,۹۰۰,۰۰۰ تومان"
    }
   }
  },
  {
   "id": "gardening",
   "title": "اره موتوری و باغبانی",
   "icon": "🌲",
   "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
   "countLabel": "۱۱۰+ محصول",
   "sheetTitle": "اره موتوری و باغبانی",
   "active": true,
   "order": 6,
   "menu": {
    "mainLabel": "همه محصولات اره موتوری و باغبانی",
    "viewAllLabel": "مشاهده آرشیو کامل (۱۱۰+ کالا)",
    "columns": [
     {
      "title": "اره زنجیری و هرس",
      "link": "catalog.html?cat=gardening",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "اره موتوری بنزینی ساتی‌دار",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "اره زنجیری شارژی دستی",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "قیچی باغبانی شارژی و دستی",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       }
      ]
     },
     {
      "title": "علف‌زن و چمن‌زن",
      "link": "catalog.html?cat=gardening",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "علف‌زن دوشی و پشتی بنزینی",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "شمشادزن و حاشیه‌زن",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       }
      ]
     },
     {
      "title": "پمپ آب و سم‌پاش",
      "link": "catalog.html?cat=gardening",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "سم‌پاش شارژی دو موتوره",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       },
       {
        "label": "پمپ آب خانگی و کفکش",
        "link": "catalog.html?cat=gardening",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "catalog.html?cat=gardening",
     "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
     "tag": "🌲 تجهیزات باغبانی",
     "title": "انواع اره زنجیری و علف‌زن صنعتی",
     "priceText": "مشاهده لیست قیمت ❯"
    }
   }
  },
  {
   "id": "safety",
   "title": "ایمنی و حفاظت فردی",
   "icon": "🦺",
   "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
   "countLabel": "۸۰+ محصول",
   "sheetTitle": "ایمنی و کارگاهی",
   "active": true,
   "order": 7,
   "menu": {
    "mainLabel": "همه تجهیزات ایمنی و حفاظت فردی",
    "viewAllLabel": "مشاهده آرشیو کامل (۸۰+ کالا)",
    "columns": [
     {
      "title": "کفش و لباس کار",
      "link": "catalog.html?cat=safety",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "کفش ایمنی سرپنجه فولادی",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "لباس کار مهندسی و کارگاهی",
        "link": "catalog.html?cat=safety",
        "badge": ""
       }
      ]
     },
     {
      "title": "محافظ سر و چشم",
      "link": "catalog.html?cat=safety",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "عینک ایمنی ضدبخار و برش",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "کلاه ایمنی و گوشی صداگیر",
        "link": "catalog.html?cat=safety",
        "badge": ""
       }
      ]
     },
     {
      "title": "دستکش و کمربند",
      "link": "catalog.html?cat=safety",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "دستکش ضدبرش و نسوز",
        "link": "catalog.html?cat=safety",
        "badge": ""
       },
       {
        "label": "کمربند ایمنی کار در ارتفاع",
        "link": "catalog.html?cat=safety",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "catalog.html?cat=safety",
     "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
     "tag": "🦺 ایمنی استاندارد",
     "title": "تجهیزات کامل حفاظت فردی کارگاه",
     "priceText": "مشاهده محصولات ❯"
    }
   }
  },
  {
   "id": "accessories",
   "title": "مته، صفحه برش و جانبی",
   "icon": "⚙️",
   "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",
   "countLabel": "۶۰۰+ محصول",
   "sheetTitle": "مته و صفحه برش",
   "active": true,
   "order": 8,
   "menu": {
    "mainLabel": "همه محصولات مته، صفحه برش و جانبی",
    "viewAllLabel": "مشاهده آرشیو کامل (۶۰۰+ کالا)",
    "columns": [
     {
      "title": "انواع مته تخصصی",
      "link": "catalog.html?cat=accessories",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "ست مته آهن کبالت و تیتانیوم",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "مته الماسه و چهارشیار بتن",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "مته برگی، گازور و گردبر",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       }
      ]
     },
     {
      "title": "صفحه برش و ساب",
      "link": "catalog.html?cat=accessories",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "صفحه برش آهن و استیل",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "صفحه گرانیت‌بر و سرامیک‌بر",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "صفحه فلاپ و سنباده دیسکی",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       }
      ]
     },
     {
      "title": "باتری و شارژر ابزار",
      "link": "catalog.html?cat=accessories",
      "items": [
       {
        "label": "",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "باتری لیتیوم ۲۰ ولت دیوالت/ماکیتا",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       },
       {
        "label": "ست نوک پیچ‌گوشتی ضربه‌ای",
        "link": "catalog.html?cat=accessories",
        "badge": ""
       }
      ]
     }
    ],
    "featured": {
     "link": "catalog.html?cat=accessories",
     "image": "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",
     "tag": "⚙️ لوازم مصرفی",
     "title": "انواع مته، صفحه برش و باتری یدک",
     "priceText": "مشاهده محصولات ❯"
    }
   }
  }
 ],
 "brands": [
  {
   "id": "dewalt",
   "name": "DEWALT",
   "active": true,
   "order": 1,
   "faName": "دیوالت"
  },
  {
   "id": "makita",
   "name": "MAKITA",
   "active": true,
   "order": 2,
   "faName": "ماکیتا"
  },
  {
   "id": "bosch",
   "name": "BOSCH",
   "active": true,
   "order": 3,
   "faName": "بوش"
  },
  {
   "id": "milwaukee",
   "name": "MILWAUKEE",
   "active": true,
   "order": 4,
   "faName": "میلواکی"
  },
  {
   "id": "hilti",
   "name": "HILTI",
   "active": true,
   "order": 5,
   "faName": "هیلتی"
  },
  {
   "id": "metabo",
   "name": "METABO",
   "active": true,
   "order": 6,
   "faName": ""
  },
  {
   "id": "ronix",
   "name": "RONIX",
   "active": true,
   "order": 7,
   "faName": "رونیکس"
  },
  {
   "id": "aeg",
   "name": "AEG",
   "active": true,
   "order": 8,
   "faName": "آ ا گ"
  },
  {
   "id": "crown",
   "name": "CROWN",
   "active": true,
   "order": 9,
   "faName": "کرون"
  },
  {
   "id": "tosan",
   "name": "TOSAN",
   "active": true,
   "order": 10,
   "faName": ""
  },
  {
   "id": "mahak",
   "name": "MAHAK",
   "active": true,
   "order": 11,
   "faName": ""
  },
  {
   "id": "arva",
   "name": "ARVA",
   "active": true,
   "order": 12,
   "faName": ""
  },
  {
   "id": "total",
   "name": "TOTAL",
   "active": true,
   "order": 13,
   "faName": ""
  },
  {
   "id": "ingco",
   "name": "INGCO",
   "active": true,
   "order": 14,
   "faName": ""
  }
 ],
 "slides": [
  {
   "id": "slide-1",
   "type": "image",
   "src": "https://images.unsplash.com/photo-1504148455328-c376907d081c",
   "poster": "",
   "alt": "ابزارآلات صنعتی",
   "badge": "واردات مستقیم از بانه",
   "title": "مرجع تخصصی ابزارآلات صنعتی و کارگاهی",
   "subtitle": "تامین‌کننده مستقیم برترین برندهای جهانی (دیوالت، ماکیتا، بوش و میلواکی) با تضمین ۱۰۰٪ اصالت کالا.",
   "buttons": [
    {
     "label": "مشاهده کاتالوگ محصولات",
     "href": "catalog.html",
     "style": "primary"
    },
    {
     "label": "🔥 تخفیف‌های امروز",
     "href": "#megaOfferSection",
     "style": "secondary"
    }
   ],
   "active": true,
   "order": 1
  },
  {
   "id": "slide-2",
   "type": "video",
   "src": "https://assets.mixkit.co/videos/preview/mixkit-welder-working-with-a-welding-machine-226-large.mp4",
   "poster": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
   "alt": "",
   "badge": "قدرت بی‌رقیب در پروژه‌ها",
   "title": "تجهیزات جوشکاری و برشکاری سنگین",
   "subtitle": "جدیدترین نسل اینورترهای صنعتی، فرزهای آهنگری و اره پروفیل‌بر با گارانتی معتبر.",
   "buttons": [
    {
     "label": "خرید تجهیزات جوش و برش",
     "href": "catalog.html?cat=welding",
     "style": "primary"
    }
   ],
   "active": true,
   "order": 2
  },
  {
   "id": "slide-3",
   "type": "image",
   "src": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
   "poster": "",
   "alt": "جعبه ابزار و ست‌های مکانیکی",
   "badge": "تجهیز کامل تعمیرگاه",
   "title": "ست‌های کامل آچار، بکس و ابزار دستی",
   "subtitle": "مجموعه‌های حرفه‌ای کروم-وانادیوم مقاوم در برابر فشار برای مکانیک‌ها و تکنسین‌های صنعتی.",
   "buttons": [
    {
     "label": "مشاهده ابزارهای دستی",
     "href": "catalog.html?cat=hand-tools",
     "style": "primary"
    }
   ],
   "active": true,
   "order": 3
  }
 ],
 "banners": [
  {
   "id": "banner-1",
   "href": "catalog.html?cat=welding",
   "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
   "alt": "تجهیزات جوشکاری",
   "tag": "ضمانت ۲۴ ماهه",
   "title": "نسل جدید اینورترهای جوشکاری IGBT",
   "btn": "مشاهده و خرید",
   "active": true,
   "order": 1
  },
  {
   "id": "banner-2",
   "href": "catalog.html?cat=power-tools",
   "image": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407",
   "alt": "ابزارهای شارژی",
   "tag": "موتورهای براشلس (Brushless)",
   "title": "خانواده ابزارهای شارژی ۲۰ ولت صنعتی",
   "btn": "مشاهده و خرید",
   "active": true,
   "order": 2
  }
 ],
 "posts": [
  {
   "id": 1,
   "href": "blog.html?post=1",
   "image": "https://images.unsplash.com/photo-1504148455328-c376907d081c",
   "alt": "راهنمای خرید دریل",
   "meta": "راهنمای خرید • ۵ دقیقه مطالعه",
   "title": "تفاوت دریل چکشی، گیربکسی و بتن‌کن؛ کدام برای شما مناسب است؟",
   "excerpt": "بررسی کامل گشتاور، قدرت ضربه و کاربرد هر کدام از انواع دریل‌ها در پروژه‌های ساختمانی و خانگی.",
   "active": true,
   "order": 1
  },
  {
   "id": 2,
   "href": "blog.html?post=2",
   "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
   "alt": "تشخیص ابزار اصل",
   "meta": "تشخیص اصالت • ۴ دقیقه مطالعه",
   "title": "چگونه ابزارهای اورجینال دیوالت و ماکیتا را از نسخه‌های فیک تشخیص دهیم؟",
   "excerpt": "نکات کلیدی بررسی سریال بدنه، کیفیت قالب‌گیری، لیبل باتری و گارانتی هنگام خرید ابزار از بانه.",
   "active": true,
   "order": 2
  },
  {
   "id": 3,
   "href": "blog.html?post=3",
   "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1",
   "alt": "انتخاب اینورتر",
   "meta": "آموزش فنی • ۶ دقیقه مطالعه",
   "title": "راهنمای انتخاب آمپر مناسب در خرید دستگاه جوش اینورتر",
   "excerpt": "برای ذوب دائمی الکترود ۳ و ۴ به چه چرخه کاری (Duty Cycle) و چه میزان آمپر واقعی نیاز داریم؟",
   "active": true,
   "order": 3
  }
 ],
 "nav": [
  {
   "type": "link",
   "label": "صفحه اصلی",
   "href": "index.html"
  },
  {
   "type": "megamenu",
   "label": "دسته‌بندی محصولات",
   "href": "catalog.html"
  },
  {
   "type": "link",
   "label": "کاتالوگ فروشگاه",
   "href": "catalog.html"
  },
  {
   "type": "link",
   "label": "فروش ویژه (مگا آف)",
   "href": "index.html#megaOfferSection"
  },
  {
   "type": "link",
   "label": "مجله ابزارشناسی",
   "href": "index.html#blogSection"
  }
 ],
 "orders": [],
 "megaBottom": {
  "promoText": "🔥 مشاهده ابزارهای دارای تخفیف ویژه امروز با تضمین اصالت بانه",
  "promoHref": "catalog.html?filter=special",
  "allLabel": "ورود به کاتالوگ جامع محصولات",
  "allHref": "catalog.html"
 },
 "homeSections": [
  {
   "id": "categories",
   "type": "categories",
   "enabled": true,
   "title": "دسته‌بندی‌های تخصصی",
   "viewAllLabel": "همه دسته‌ها",
   "viewAllHref": "catalog.html"
  },
  {
   "id": "offer",
   "type": "offer",
   "enabled": true,
   "tag": "🔥 حراج ویژه بانه",
   "title": "پیشنهاد شگفت‌انگیز مگا آف",
   "desc": "تخفیف‌های استثنایی و محدود روی ابزارآلات صنعتی منتخب با ارسال فوری.",
   "viewAllLabel": "مشاهده همه",
   "viewAllHref": "catalog.html?filter=special",
   "filterTag": "offer",
   "limit": 12
  },
  {
   "id": "bestselling",
   "type": "productRow",
   "enabled": true,
   "title": "پرفروش‌ترین ابزارها",
   "viewAllLabel": "مشاهده همه محصولات",
   "viewAllHref": "catalog.html?sort=bestselling",
   "filterTag": "bestselling",
   "limit": 12
  },
  {
   "id": "banners",
   "type": "banners",
   "enabled": true
  },
  {
   "id": "brands",
   "type": "brands",
   "enabled": true,
   "title": "برندهای معتبر جهانی"
  },
  {
   "id": "blog",
   "type": "blog",
   "enabled": true,
   "title": "مجله تخصصی و راهنمای خرید",
   "viewAllLabel": "ورود به وبلاگ",
   "viewAllHref": "blog.html"
  }
 ],
 "footer": {
  "features": [
   {
    "icon": "https://img.icons8.com/ios-filled/64/ffffff/delivery.png",
    "alt": "ارسال سریع",
    "text": "ارسال سریع به سراسر کشور (تیپاکس و باربری)"
   },
   {
    "icon": "https://img.icons8.com/ios-filled/64/ffffff/guarantee.png",
    "alt": "تضمین اصالت",
    "text": "تضمین ۱۰۰٪ اصالت فیزیکی کالا"
   },
   {
    "icon": "https://img.icons8.com/ios-filled/64/ffffff/return-purchase.png",
    "alt": "ضمانت بازگشت",
    "text": "۷ روز مهلت تست و بازگشت کالا"
   },
   {
    "icon": "https://img.icons8.com/ios-filled/64/ffffff/headset.png",
    "alt": "پشتیبانی",
    "text": "مشاوره تخصصی پیش از خرید"
   }
  ],
  "columns": [
   {
    "title": "دسترسی سریع",
    "links": [
     {
      "label": "درباره مگا ابزار",
      "href": "about.html"
     },
     {
      "label": "تماس با ما",
      "href": "contact.html"
     },
     {
      "label": "سوالات متداول",
      "href": "faq.html"
     },
     {
      "label": "ثبت شکایات و پیشنهادات",
      "href": "contact.html#complaints"
     },
     {
      "label": "وبلاگ آموزشی ابزارشناسی",
      "href": "blog.html"
     }
    ]
   },
   {
    "title": "راهنمای خرید و ارسال",
    "links": [
     {
      "label": "نحوه ثبت سفارش آنلاین",
      "href": "guide.html#order"
     },
     {
      "label": "رویه ارسال کالاهای سنگین (باربری)",
      "href": "guide.html#shipping"
     },
     {
      "label": "شیوه‌های پرداخت و درگاه شاپرک",
      "href": "guide.html#payment"
     },
     {
      "label": "شرایط بازگشت کالا و گارانتی",
      "href": "terms.html#return"
     },
     {
      "label": "قوانین و حریم خصوصی",
      "href": "terms.html"
     }
    ]
   }
  ],
  "trustSymbols": [
   "نماد اعتماد<br>(e-Namad)",
   "نشان ملی<br>(ساماندهی)"
  ],
  "copyright": "کلیه حقوق مادی و معنوی این سایت متعلق به فروشگاه آنلاین «مگا ابزار» می‌باشد. توسعه اختصاصی بدون فریم‌ورک.",
  "social": [
   {
    "id": "instagram",
    "url": "https://instagram.com",
    "title": "اینستاگرام مگا ابزار",
    "icon": "https://img.icons8.com/ios-glyphs/60/ffffff/instagram-new.png",
    "enabled": true
   },
   {
    "id": "telegram",
    "url": "https://t.me",
    "title": "کانال تلگرام مگا ابزار",
    "icon": "https://img.icons8.com/ios-glyphs/60/ffffff/telegram-app.png",
    "enabled": true
   },
   {
    "id": "whatsapp",
    "url": "https://wa.me/988712345678",
    "title": "مشاوره واتس‌اپ",
    "icon": "https://img.icons8.com/ios-glyphs/60/ffffff/whatsapp.png",
    "enabled": true
   }
  ]
 }
};

const Store = (() => {
    const clone = o => JSON.parse(JSON.stringify(o));
    const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
    function deepMerge(base, over) {
        if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
        const out = { ...base };
        Object.keys(over).forEach(k => { out[k] = deepMerge(base[k], over[k]); });
        return out;
    }
    function readAll() {
        try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}') || {}; } catch (e) { return {}; }
    }
    function writeAll(db) {
        try { localStorage.setItem(DB_KEY, JSON.stringify(db)); return true; } catch (e) { return false; }
    }
    return {
        // خواندن یک مجموعه (همیشه یک کپی برمی‌گرداند تا تغییر ناخواسته روی داده اصلی نیفتد)
        get(name) {
            const db = readAll();
            if (!(name in DEFAULTS)) return undefined;
            if (name in db) return clone(isObj(DEFAULTS[name]) ? deepMerge(DEFAULTS[name], db[name]) : db[name]);
            return clone(DEFAULTS[name]);
        },
        // ذخیره یک مجموعه (پنل مدیریت از این استفاده می‌کند)
        set(name, value) {
            const db = readAll(); db[name] = clone(value); return writeAll(db);
        },
        // برگرداندن یک مجموعه (یا همه) به مقدار پیش‌فرض
        reset(name) {
            if (!name) { try { localStorage.removeItem(DB_KEY); } catch (e) {} return; }
            const db = readAll(); delete db[name]; writeAll(db);
        },
        exportAll() { return JSON.stringify(readAll(), null, 2); },
        importAll(json) { return writeAll(JSON.parse(json)); },
        collections() { return Object.keys(DEFAULTS); }
    };
})();

// ---------- توابع کمکی برای صفحه‌ها ----------
const sortByOrder = list => list.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
const onlyActive = list => list.filter(x => x.active !== false);

function getSettings() { return Store.get('settings'); }
function getProducts(opts) { const all = Store.get('products'); return opts && opts.all ? all : onlyActive(all); }
function getCategories(opts) { const c = sortByOrder(Store.get('categories')); return opts && opts.all ? c : onlyActive(c); }
function getBrands(opts) { const b = sortByOrder(Store.get('brands')); return opts && opts.all ? b : onlyActive(b); }
function getSlides() { return onlyActive(sortByOrder(Store.get('slides'))); }
function getBanners() { return onlyActive(sortByOrder(Store.get('banners'))); }
function getPosts() { return onlyActive(sortByOrder(Store.get('posts'))); }

// برای سازگاری با کدهای قبلی (سبد، کاتالوگ و ...) یک بار هنگام بارگذاری صفحه خوانده می‌شود
const PRODUCTS = getProducts();

function getProduct(id) { return PRODUCTS.find(p => String(p.id) === String(id)) || null; }
function getCategory(id) { return getCategories({ all: true }).find(c => c.id === id) || null; }
function discountPercent(p) { return p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0; }

// اندازه تصویر Unsplash هنگام نمایش تعیین می‌شود (۵۰۰ کارت‌ها، ۸۰۰ صفحه محصول)
function productImage(p, width = 500) { return imageUrl(p.image, width); }
function imageUrl(src, width = 500) {
    return src && src.includes('unsplash.com') && !src.includes('?') ? `${src}?q=80&w=${width}&auto=format&fit=crop` : src;
}

function formatPrice(n) { return toPersianNum(Number(n).toLocaleString('en-US')) + ' ' + getSettings().store.currency; }

function escapeHTML(s) {
    return String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// محاسبه هزینه ارسال بر اساس تنظیمات فروشگاه و فیلد «ارسال رایگان» هر محصول
// ورودی: آرایه‌ای از { id, quantity } (همان ساختار سبد). خروجی: { subtotal, fee, isFree, reason, remaining }
function calcShipping(items) {
    const sh = getSettings().shipping;
    const lines = items.map(i => ({ p: getProduct(i.id), q: i.quantity })).filter(l => l.p);
    const subtotal = lines.reduce((s, l) => s + l.p.price * l.q, 0);
    const res = { subtotal, fee: 0, isFree: true, reason: '', remaining: 0 };
    if (!lines.length) return res;
    if (!sh.enabled) { res.reason = 'disabled'; return res; }
    const freeFlags = lines.map(l => !!l.p.freeShipping);
    if (sh.productRule === 'any' ? freeFlags.some(Boolean) : freeFlags.every(Boolean)) { res.reason = 'product'; return res; }
    if (sh.freeFromEnabled && subtotal >= sh.freeFrom) { res.reason = 'threshold'; return res; }
    res.fee = sh.fee; res.isFree = false;
    res.remaining = sh.freeFromEnabled ? sh.freeFrom - subtotal : 0;
    return res;
}
