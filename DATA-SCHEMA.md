# ساختار داده‌های سایت (برای پنل مدیریت)

همه‌ی صفحه‌ها فقط از `store.js` داده می‌خوانند. هر چیزی که پنل ذخیره کند با `Store.set(name, value)` در
`localStorage` (کلید `mega_abzar_db_v1`) می‌نشیند و روی مقدار پیش‌فرض اولویت دارد. `Store.reset(name)` یک مجموعه را به
پیش‌فرض برمی‌گرداند و `Store.reset()` همه را.
برای وصل شدن به بک‌اند فقط `Store.get/set` را (در `store.js`) عوض کنید.

| مجموعه | شکل | توضیح |
|---|---|---|
| `settings` | object | `store` (نام، لوگو، تلفن، آدرس، ساعت کاری، واحد پول)، `shipping`، `offer`، `catalog`، `payment.methods[]`، `powerTypes` |
| `products` | array | هر محصول: `active`, `inStock`, `freeShipping`, `tags`, `price`, `oldPrice`, `category`, `brand`, `type`, `image`, ... (فهرست کامل بالای `products.js`)؛ صفحه محصول هم از `gallery`, `highlights`, `specTable`, `description`, `variants` می‌خواند و بخش‌های خالی را نشان نمی‌دهد |
| `categories` | array | `id`(slug), `title`, `sheetTitle`, `icon`, `image`, `countLabel`, `active`, `order`, `menu` (ستون‌ها و کارت ویژه مگامنو) |
| `brands` | array | `id`, `name`, `faName`, `active`, `order` |
| `slides` | array | اسلایدر هیرو: `type` (image/video), `src`, `badge`, `title`, `subtitle`, `buttons[]`, `active`, `order` |
| `banners` | array | بنرهای دوقلو: `image`, `tag`, `title`, `btn`, `href`, `active`, `order` |
| `posts` | array | مقالات مجله: `id`, `title`, `meta`, `excerpt`, `image`, `href` (پیش‌فرض `blog.html?post=ID`)، `content` (متن کامل مقاله)، `active`, `order` |
| `nav` | array | منوی بالای هدر؛ آیتم `type:'megamenu'` جای مگامنو را مشخص می‌کند |
| `megaBottom` | object | نوار پایین مگامنو |
| `homeSections` | array | ترتیب و نمایش بخش‌های صفحه اصلی: `type` (categories, offer, productRow, banners, brands, blog), `enabled`, `title`, `filterTag`, `limit` |
| `orders` | array | سفارش‌های ثبت‌شده از checkout: `id`, `createdAt`, `status` (new/processing/shipped/delivered/canceled), `customer`, `items[]`, `subtotal`, `shippingFee`, `total`, `payment` |
| `faq` | array | سوالات متداول: `id`, `q`, `a`, `active`, `order` |
| `pages` | object | متن صفحات `about`, `contact`, `guide`, `terms`: هرکدام `title`, `intro`, `metaDescription`, `sections[]` (`id`, `title`, `body`, `active`) |
| `messages` | array | پیام‌های فرم «تماس با ما»: `id`, `createdAt`, `status` (new/read), `type` (contact/order/complaint/suggestion), `name`, `phone`, `message` |
| `footer` | object | `features`, `columns`, `trustSymbols`, `copyright`, `social` |

## ارسال رایگان
- روی هر محصول: `freeShipping: true/false`
- در `settings.shipping`: `enabled`, `fee`, `freeFromEnabled`, `freeFrom`, `productRule`
  - `productRule: 'all'` → هزینه ارسال فقط وقتی صفر می‌شود که **همه‌ی** کالاهای سبد ارسال رایگان باشند
  - `productRule: 'any'` → وجود **یک** کالای ارسال رایگان در سبد، ارسال کل سفارش را رایگان می‌کند
- محاسبه در `calcShipping(cartItems)` در `store.js` (سبد، صفحه سبد و بعداً checkout از همین تابع استفاده می‌کنند)

## برچسب‌های محصول (`tags`)
`offer` (بخش مگا آف)، `bestselling` (پرفروش‌ترین‌ها)، `new`. بخش‌های صفحه اصلی با `filterTag` به این‌ها وصل‌اند.

## پنل مدیریت (admin.html)
- همه‌ی صفحه‌های پنل از روی «طرح‌واره» فیلدها (`SCHEMA` در `admin.html`) ساخته می‌شوند؛ برای مدیریت یک مجموعه‌ی جدید یک schema و یک مدخل در `PAGES` اضافه کنید.
- پنل فقط از `Store.get/set` استفاده می‌کند.
- **هشدار:** پنل رمز عبور ندارد و داده‌ها فقط در localStorage همین مرورگرند. قبل از انتشار واقعی باید به بک‌اند با احراز هویت وصل شود.

## سفارش و پرداخت
- `checkout.html` سفارش را در مجموعه‌ی `orders` ذخیره و سبد را خالی می‌کند. هنوز درگاه پرداخت واقعی وجود ندارد؛ روش «پرداخت آنلاین» به‌صورت پیش‌فرض غیرفعال است.

## صفحات محتوایی و حساب کاربری
- `about/contact/guide/terms.html` با `renderContentPage(key)` از `pages.js` ساخته می‌شوند؛ `faq.html` از `faq` و `blog.html` از `posts` می‌خواند.
- قالب متن (فقط متن ساده، HTML خام پذیرفته نمی‌شود): خط خالی = پاراگراف، `## ` = عنوان، `- ` = لیست، `**پررنگ**`، `[متن](لینک)`.
- توکن‌ها (با تنظیمات فروشگاه خودکار به‌روز می‌شوند): `{{storeName}} {{phone}} {{address}} {{hours}} {{email}} {{shipFee}} {{shipRule}} {{payments}}`.
- `profile.html`: اطلاعات کاربر در کلید localStorage با نام `mega_abzar_checkout_profile` (مشترک با checkout)؛ سفارش‌ها با تطبیق شماره موبایل نمایش داده می‌شوند و پیگیری سفارش نیازمند کد سفارش **و** موبایل است. با آمدن ورود پیامکی فقط `getUser/saveUser/getMyOrders` باید عوض شوند.
- پنل: بخش‌های «پیام‌های مشتریان»، «سوالات متداول» و «صفحات محتوایی» + فیلد «متن کامل مقاله» در مجله.
