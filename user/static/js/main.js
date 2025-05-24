document.addEventListener('DOMContentLoaded', () => {
    console.log("[Main.js] DOMContentLoaded событие запущено.");

    // --- Переменные уровня DOMContentLoaded ---
    const basketButton = document.querySelector(".header__basket");
    console.log("[Main.js] Элемент basketButton:", basketButton);

    // --- Объявления функций (hoisting происходит автоматически, но так нагляднее) ---

    console.log("[Main.js] Попытка объявления функции setCookie...");
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
    }
    console.log("[Main.js] Функция setCookie объявлена.");

    console.log("[Main.js] Попытка объявления функции getCookie...");
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return JSON.parse(decodeURIComponent(match[2]));
        return {};
    }
    console.log("[Main.js] Функция getCookie объявлена.");

    console.log("[Main.js] Попытка объявления функции updateCartCounter...");
    function updateCartCounter() {
        console.log("[updateCartCounter] Функция вызвана.");
        if (!basketButton) {
            console.warn("[updateCartCounter] Кнопка корзины (.header__basket) не найдена. Обновление счетчика невозможно.");
            return;
        }
        let cart = getCookie("cart") || {};
        let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        
        basketButton.innerHTML = `<img src="/static/img/basket.png" alt="Корзина">${totalItems}`;
        console.log("[updateCartCounter] Счетчик обновлен, items:", totalItems);
    }
    console.log("[Main.js] Функция updateCartCounter объявлена.");

    console.log("[Main.js] Попытка объявления функции addToCart...");
    function addToCart(productElement) {
        console.log("[addToCart] Попытка добавить товар. Элемент:", productElement);
        if (!productElement) {
            console.error("[addToCart] Ошибка: Элемент продукта не передан.");
            // alert("Произошла ошибка при добавлении товара. Элемент не найден."); // Можно раскомментировать для отладки
            return;
        }

        const productId = productElement.dataset.productId;
        console.log("[addToCart] Извлечен productId:", productId);

        if (!productId) {
            console.error("[addToCart] КРИТИЧЕСКАЯ ОШИБКА: productId отсутствует у элемента.", productElement);
            // alert("Ошибка: Не удалось определить ID товара."); // Можно раскомментировать для отладки
            return;
        }

        const productNameElement = productElement.querySelector("h3");
        const productName = productNameElement ? productNameElement.innerText : "Название не найдено";
        console.log("[addToCart] Извлечено productName:", productName);

        const productPriceElement = productElement.querySelector("p");
        let productPrice = 0;
        if (productPriceElement) {
            const productPriceText = productPriceElement.innerText;
            console.log("[addToCart] Извлечен productPriceText:", productPriceText);
            const productPriceMatch = productPriceText.match(/(\d[\d\s]*\.\d{2}|\d[\d\s]*)/);
            productPrice = productPriceMatch ? parseFloat(productPriceMatch[0].replace(/\s/g, '').replace(',', '.')) : 0;
        } else {
            console.warn("[addToCart] Элемент цены не найден для товара:", productName);
        }
        console.log("[addToCart] Разобранная productPrice:", productPrice);

        const productImageElement = productElement.querySelector("img");
        const productImage = productImageElement ? productImageElement.src : "";
        console.log("[addToCart] Извлечен productImage:", productImage);

        let cart = getCookie("cart") || {};
        if (cart[productId]) {
            cart[productId].quantity += 1;
        } else {
            cart[productId] = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
        }

        setCookie("cart", cart, 7);
        console.log("[addToCart] Cookie 'cart' обновлен.");
        console.log("[addToCart] Вызов updateCartCounter изнутри addToCart.");
        updateCartCounter(); // Вызов здесь должен работать, т.к. updateCartCounter уже объявлена выше
        console.log("[addToCart] Товар добавлен/обновлен:", cart[productId]);
    }
    console.log("[Main.js] Функция addToCart объявлена.");

    // --- Инициализация Swiper ---
    console.log("[Main.js] Попытка инициализации Swiper...");
    try {
        if (document.querySelector('.reviews__container')) {
            const reviewsSwiper = new Swiper('.reviews__container', {
                slidesPerView: 3, spaceBetween: 20,
                navigation: { nextEl: '#arrow_right', prevEl: '#arrow_left' },
                loop: true,
                breakpoints: { 0: { slidesPerView: 1, spaceBetween: 10 }, 700: { slidesPerView: 1, spaceBetween: 10 }, 1050: { slidesPerView: 2, spaceBetween: 15 }, 1150: { slidesPerView: 3, spaceBetween: 15 }}
            });
            console.log("[Main.js] Swiper '.reviews__container' инициализирован.");
        }

        if (document.querySelector('.product__container')) {
            const productSwiper = new Swiper('.product__container', {
                slidesPerView: 3, spaceBetween: 20,
                navigation: { nextEl: '#arrow_right_product', prevEl: '#arrow_left_product' },
                loop: true,
                breakpoints: { 0: { slidesPerView: 1, spaceBetween: 10 }, 700: { slidesPerView: 1, spaceBetween: 10 }, 1050: { slidesPerView: 2, spaceBetween: 15 }, 1150: { slidesPerView: 3, spaceBetween: 15 }}
            });
            console.log("[Main.js] Swiper '.product__container' инициализирован.");
        }
        
        if (document.querySelector('.catalog__all__tovar__img__img')) {
           const catalogImageSwiper = new Swiper('.catalog__all__tovar__img__img', {
                slidesPerView: 1, spaceBetween: 20,
                navigation: { nextEl: '#arrow_right_catalog_img', prevEl: '#arrow_left_catalog_img' },
                loop: true,
            });
            console.log("[Main.js] Swiper '.catalog__all__tovar__img__img' инициализирован.");
        }
    } catch (swiperError) {
        console.error("[Main.js] Ошибка при инициализации Swiper:", swiperError);
    }
    console.log("[Main.js] Инициализация Swiper завершена (или попытка).");

    // --- ОБРАБОТЧИКИ КНОПОК "В КОРЗИНУ" ---
    console.log("[Main.js] Попытка установки обработчиков для кнопок 'В корзину'...");
    try {
        const singleProductPageContainer = document.querySelector(".product");
        if (singleProductPageContainer) {
            const cartButton = singleProductPageContainer.querySelector(".product__about__button button:first-child");
            if (cartButton) {
                cartButton.addEventListener("click", function () { addToCart(singleProductPageContainer); });
                console.log("[Main.js] Обработчик для кнопки 'В корзину' на странице товара установлен.");
            }
        }

        const catalogItems = document.querySelectorAll(".catalog__all__tovar");
        catalogItems.forEach((itemElement) => {
            const addToCartButton = itemElement.querySelector(".catalog__all__tovar__button div button:first-child");
            if (addToCartButton) {
                addToCartButton.addEventListener("click", function () { addToCart(itemElement); });
            }
        });
        if (catalogItems.length > 0) console.log(`[Main.js] Обработчики для ${catalogItems.length} товаров в каталоге установлены.`);


        const recommendedProductSlides = document.querySelectorAll(".product__container .swiper-slide");
        recommendedProductSlides.forEach((slideElement) => {
            const button = slideElement.querySelector(".product__recomend__button button");
            if (button) {
                button.addEventListener("click", function () { addToCart(slideElement); });
            }
        });
        if (recommendedProductSlides.length > 0) console.log(`[Main.js] Обработчики для ${recommendedProductSlides.length} рекомендованных товаров установлены.`);

    } catch (eventListenerError) {
        console.error("[Main.js] Ошибка при установке обработчиков событий для кнопок 'В корзину':", eventListenerError);
    }
    console.log("[Main.js] Установка обработчиков событий завершена (или попытка).");

    // --- Первоначальный вызов для обновления счетчика ---
    // Это место, где, по вашему сообщению, происходит ошибка (строка ~193)
    console.log("[Main.js] Попытка первоначального вызова updateCartCounter...");
    if (typeof updateCartCounter === 'function') {
        console.log("[Main.js] updateCartCounter определена как функция. Вызываем...");
        updateCartCounter();
    } else {
        console.error("[Main.js] КРИТИЧЕСКАЯ ОШИБКА: updateCartCounter НЕ ЯВЛЯЕТСЯ ФУНКЦИЕЙ перед первоначальным вызовом! Тип:", typeof updateCartCounter);
        // alert("Критическая ошибка инициализации корзины! Функция updateCartCounter не найдена.");
    }
    console.log("[Main.js] Первоначальный вызов updateCartCounter завершен (или попытка).");

}); // Конец DOMContentLoaded
console.log("[Main.js] DOMContentLoaded обработчик зарегистрирован.");

// --- Глобальные функции ---
console.log("[Main.js] Попытка объявления глобальной функции burgerMenu...");
function burgerMenu() {
    const menu = document.getElementById('burger-menu');
    if (menu) {
        menu.classList.toggle('is-active');
        console.log("[burgerMenu] Класс 'is-active' переключен для #burger-menu.");
    } else {
        console.warn("[burgerMenu] Элемент #burger-menu не найден.");
    }
}
console.log("[Main.js] Глобальная функция burgerMenu объявлена.");