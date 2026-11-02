// products.js - تنها منبع داده محصولات سایت (کاتالوگ، صفحه محصول، جستجو، سبد خرید و صفحه اصلی)
// برای افزودن یا ویرایش محصول فقط همین فایل را تغییر بدهید.

const CATEGORY_TITLES = {
    "power-tools": "ابزار برقی و شارژی",
    "hand-tools": "ابزار دستی و مکانیکی",
    "measuring": "تراز لیزری و ابزار دقیق",
    "welding": "اینورتر و جوشکاری",
    "pneumatic": "ابزار بادی و کمپرسور",
    "gardening": "باغبانی و فضای سبز"
};

const PRODUCTS = [
    {"id":1,"title":"دریل چکشی دیوالت مدل DWD024 توان ۶۵۰ وات","brand":"DEWALT","category":"power-tools","type":"برقی","price":3825000,"oldPrice":4500000,"discount":15,"inStock":true,"rating":"۴.۸","sales":95,"specs":["۶۵۰ وات","سه‌نظام ۱۳","چکشی"],"image":"https://images.unsplash.com/photo-1504148455328-c376907d081c","model":"DWD024","powerSpec":"۶۵۰ وات واقعی","sku":"MEGA-DW-024","pageTitle":"دریل چکشی دیوالت مدل DWD024 توان ۶۵۰ وات اورجینال"},
    {"id":2,"title":"مینی فرز دسته بلند ماکیتا مدل 9558HN اورجینال","brand":"MAKITA","category":"power-tools","type":"برقی","price":2950000,"oldPrice":0,"discount":0,"inStock":true,"rating":"۴.۹","sales":88,"specs":["۸۴۰ وات","۱۱۰۰۰ دور","صفحه ۱۱۵"],"image":"https://images.unsplash.com/photo-1572981779307-38b8cabb2407","model":"9558HN","powerSpec":"۸۴۰ وات صنعتی","sku":"MEGA-MK-9558","pageTitle":"مینی فرز دسته بلند ماکیتا مدل 9558HN اصل ژاپن"},
    {"id":3,"title":"مجموعه ۱۲۸ عددی ابزار دستی و بکس رونیکس RH-27128","brand":"RONIX","category":"hand-tools","type":"دستی","price":5200000,"oldPrice":5800000,"discount":10,"inStock":true,"rating":"۴.۷","sales":82,"specs":["کروم وانادیوم","۱۲۸ پارچه","کیف BMC"],"image":"https://images.unsplash.com/photo-1530124566582-a618bc2615dc","model":"RH-27128","powerSpec":"فولاد کروم وانادیوم","sku":"MEGA-RN-128","pageTitle":"مجموعه ۱۲۸ عددی ابزار دستی و بکس رونیکس مدل RH-27128"},
    {"id":4,"title":"متر لیزری ۵۰ متری بوش مدل GLM 50 C بلوتوث‌دار","brand":"BOSCH","category":"measuring","type":"شارژی","price":4100000,"oldPrice":0,"discount":0,"inStock":true,"rating":"۴.۹","sales":76,"specs":["برد ۵۰ متر","بلوتوث","ضدغبار IP54"],"image":"https://images.unsplash.com/photo-1581092335397-9583eb92d232","model":"GLM 50 C","powerSpec":"برد دقیق ۵۰ متر","sku":"MEGA-BS-50C"},
    {"id":5,"title":"دریل پیچ‌گوشتی شارژی براشلس میلواکی ۱۸ ولت M18","brand":"MILWAUKEE","category":"power-tools","type":"شارژی","price":8300000,"oldPrice":9200000,"discount":10,"inStock":true,"rating":"۵.۰","sales":91,"specs":["۱۸ ولت","موتور براشلس","۲ باتری"],"image":"https://images.unsplash.com/photo-1586864387967-d02ef85d93e8","model":"M18-BL","powerSpec":"۱۸ ولت لیتیوم (۲ باتری)","sku":"MEGA-MW-18","pageTitle":"دریل پیچ‌گوشتی شارژی براشلس میلواکی ۱۸ ولت مدل M18"},
    {"id":6,"title":"بتن‌کن ۴ شیار هیلتی مدل TE 2-S اورجینال بانه","brand":"HILTI","category":"power-tools","type":"برقی","price":11200000,"oldPrice":12000000,"discount":7,"inStock":true,"rating":"۴.۹","sales":64,"specs":["۶۵۰ وات","۴ شیار SDS","ضدلرزش"],"image":"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1","model":"TE 2-S","powerSpec":"۶۵۰ وات (۳ ژول)","sku":"MEGA-HL-TE2"},
    {"id":7,"title":"فرز آهنگری سنگین آ ا گ ۲۲۰۰ وات مدل WS 22-230","brand":"AEG","category":"power-tools","type":"برقی","price":4900000,"oldPrice":0,"discount":0,"inStock":false,"rating":"۴.۶","sales":55,"specs":["۲۲۰۰ وات","صفحه ۲۳۰","سافت استارت"],"image":"https://images.unsplash.com/photo-1581092160607-ee22621dd758","model":"WS 22-230","powerSpec":"۲۲۰۰ وات (صفحه ۲۳۰)","sku":"MEGA-AEG-22"},
    {"id":8,"title":"تراز لیزری ۳۶۰ درجه سه خط کرون مدل CT44048","brand":"CROWN","category":"measuring","type":"شارژی","price":3450000,"oldPrice":0,"discount":0,"inStock":true,"rating":"۴.۸","sales":72,"specs":["نور سبز","۳۶۰ درجه","پایه مگنتی"],"image":"https://images.unsplash.com/photo-1581092335397-9583eb92d232","model":"CT44048","powerSpec":"لیزر سبز ۳۶۰ درجه","sku":"MEGA-CR-440"},
    {"id":101,"title":"بکس شارژی براشلس دیوالت ۲۰ ولت مدل DCF899","brand":"DEWALT","category":"power-tools","type":"شارژی","price":11310000,"oldPrice":14500000,"discount":22,"inStock":true,"rating":"۵.۰","sales":98,"specs":["۹۵۰ نیوتن‌متر","۲۰ ولت","درایو ۱/۲"],"image":"https://images.unsplash.com/photo-1504148455328-c376907d081c","model":"DCF899","powerSpec":"۲۰ ولت (۹۵۰ نیوتن‌متر)","sku":"MEGA-DW-899"},
    {"id":102,"title":"اینورتر جوشکاری ۲۵۰ آمپر صنعتی رونیکس RH-4625","brand":"RONIX","category":"welding","type":"برقی","price":6390000,"oldPrice":7800000,"discount":18,"inStock":true,"rating":"۴.۸","sales":89,"specs":["۲۵۰ آمپر واقعی","IGBT","دو ولوم"],"image":"https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1","model":"RH-4625","powerSpec":"۲۵۰ آمپر واقعی IGBT","sku":"MEGA-RN-4625","pageTitle":"اینورتر جوشکاری ۲۵۰ آمپر صنعتی رونیکس مدل RH-4625"},
    {"id":103,"title":"کارواش صنعتی دینامی بوش مدل AQT 140 بار","brand":"BOSCH","category":"pneumatic","type":"برقی","price":6900000,"oldPrice":9200000,"discount":25,"inStock":true,"rating":"۴.۷","sales":73,"specs":["۱۴۰ بار","موتور القایی","شیلنگ ۸ متری"],"image":"https://images.unsplash.com/photo-1581092160607-ee22621dd758","model":"AQT 140","powerSpec":"۱۴۰ بار (موتور القایی)","sku":"MEGA-BS-140"},
    {"id":104,"title":"چکش تخریب ۱۶ کیلویی ماکیتا مدل HM1307C","brand":"MAKITA","category":"power-tools","type":"برقی","price":27200000,"oldPrice":32000000,"discount":15,"inStock":true,"rating":"۴.۹","sales":60,"specs":["۱۵۱۰ وات","۳۳.۸ ژول","قلم شش‌گوش"],"image":"https://images.unsplash.com/photo-1586864387967-d02ef85d93e8","model":"HM1307C","powerSpec":"۱۵۱۰ وات (۳۳.۸ ژول)","sku":"MEGA-MK-1307"},
    {"id":105,"title":"پک کامل دریل و مینی‌فرز شارژی میلواکی M18","brand":"MILWAUKEE","category":"hand-tools","type":"شارژی","price":15600000,"oldPrice":19500000,"discount":20,"inStock":true,"rating":"۵.۰","sales":84,"specs":["پک ۲ دستگاه","کیف ضدضربه","شارژر سریع"],"image":"https://images.unsplash.com/photo-1530124566582-a618bc2615dc","model":"M18-COMBO","powerSpec":"۱۸ ولت براشلس (پک ۲ عددی)","sku":"MEGA-MW-COMBO"},
    {"id":106,"title":"اره پروفیل‌بر صنعتی آ ا گ مدل SMT 355 توان ۲۳۰۰ وات","brand":"AEG","category":"power-tools","type":"برقی","price":9230000,"oldPrice":11400000,"discount":19,"inStock":true,"rating":"۴.۸","sales":77,"specs":["۲۳۰۰ وات","صفحه ۳۵۵","گیره سریع"],"image":"https://images.unsplash.com/photo-1572981779307-38b8cabb2407","model":"SMT 355","powerSpec":"۲۳۰۰ وات صنعتی","sku":"MEGA-AEG-355"},
    {"id":107,"title":"اره زنجیری شارژی ۲۰ ولت براشلس دیوالت مدل DCM565","brand":"DEWALT","category":"gardening","type":"شارژی","price":9850000,"oldPrice":11200000,"discount":12,"inStock":true,"rating":"۴.۹","sales":69,"specs":["ساتور ۳۰ سانت","ترمز زنجیر","روغن‌کاری خودکار"],"image":"https://images.unsplash.com/photo-1416879595882-3373a0480b5b","model":"","powerSpec":"ساتور ۳۰ سانت","sku":"MEGA-107"}
];

const PRODUCTS_BY_ID = Object.fromEntries(PRODUCTS.map(p => [String(p.id), p]));

function getProduct(id) { return PRODUCTS_BY_ID[String(id)] || null; }

// اندازه تصویر Unsplash را هنگام نمایش تعیین می‌کنیم (۵۰۰ کارت‌ها، ۸۰۰ صفحه محصول)
function productImage(p, width = 500) {
    return p.image.includes('unsplash.com') ? `${p.image}?q=80&w=${width}&auto=format&fit=crop` : p.image;
}

function formatPrice(n) { return toPersianNum(Number(n).toLocaleString('en-US')) + ' تومان'; }

// جلوگیری از تزریق HTML در متن‌هایی که از ورودی کاربر یا داده می‌آیند
function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
