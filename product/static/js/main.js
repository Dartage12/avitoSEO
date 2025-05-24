// main.js

// Функция для инициализации всех Swiper'ов
function initializeAllSwipers() {
    console.log("[Swiper] Попытка инициализации всех слайдеров...");
    // Swiper для reviews__container
    const reviewsSwiperContainer = document.querySelector('.reviews__container');
    if (reviewsSwiperContainer) {
        if (reviewsSwiperContainer.swiper) {
            reviewsSwiperContainer.swiper.destroy(true, true);
        }
        new Swiper(reviewsSwiperContainer, {
            slidesPerView: 3, spaceBetween: 20,
            navigation: { nextEl: '.reviews-next', prevEl: '.reviews-prev' }, // Убедитесь, что HTML содержит эти классы
            loop: true,
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 10 }, 700: { slidesPerView: 1, spaceBetween: 10 },
                1050: { slidesPerView: 2, spaceBetween: 15 }, 1150: { slidesPerView: 3, spaceBetween: 15 }
            }
        });
        console.log("[Swiper] '.reviews__container' инициализирован.");
    }

    // Swiper для product__container (блок "Может быть интересно" на странице продукта)
    const productContainerSwiper = document.querySelector('.product__container');
    if (productContainerSwiper) {
        if (productContainerSwiper.swiper) {
            productContainerSwiper.swiper.destroy(true, true);
        }
        new Swiper(productContainerSwiper, {
            slidesPerView: 3, spaceBetween: 20,
            navigation: { nextEl: '.product-rec-next', prevEl: '.product-rec-prev' }, // Убедитесь, что HTML содержит эти классы
            loop: true,
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 10 }, 700: { slidesPerView: 1, spaceBetween: 10 },
                1050: { slidesPerView: 2, spaceBetween: 15 }, 1150: { slidesPerView: 3, spaceBetween: 15 }
            }
        });
        console.log("[Swiper] '.product__container' инициализирован.");
    }

    // Swiper для каждого .catalog__all__tovar__img__img (слайдеры внутри карточек каталога)
    document.querySelectorAll(".catalog__all__tovar").forEach((tovar) => {
        const swiperContainer = tovar.querySelector(".catalog__all__tovar__img__img");
        const prevButton = tovar.querySelector(".catalog-item-prev"); // Убедитесь, что HTML содержит эти классы
        const nextButton = tovar.querySelector(".catalog-item-next");

        if (swiperContainer && prevButton && nextButton) {
            if (swiperContainer.swiper) {
                swiperContainer.swiper.destroy(true, true);
            }
            new Swiper(swiperContainer, {
                slidesPerView: 1, spaceBetween: 10, loop: true,
                navigation: { nextEl: nextButton, prevEl: prevButton },
            });
        }
    });
    if(document.querySelectorAll(".catalog__all__tovar .catalog__all__tovar__img__img").length > 0) {
        console.log("[Swiper] Слайдеры для карточек каталога инициализированы.");
    }


    // Swiper для изображений на странице продукта (product.html)
    const productImagesSwiperContainer = document.querySelector('.product-images-swiper');
    if (productImagesSwiperContainer) {
        if (productImagesSwiperContainer.swiper) {
            productImagesSwiperContainer.swiper.destroy(true, true);
        }
        new Swiper(productImagesSwiperContainer, {
            slidesPerView: 1, spaceBetween: 0, loop: true,
            navigation: { nextEl: '.product-next-btn', prevEl: '.product-prev-btn' }, // Эти классы должны быть в HTML product.html
             pagination: { el: '.product-images-swiper .swiper-pagination', clickable: true }, // Если нужна пагинация
        });
        console.log("[Swiper] '.product-images-swiper' инициализирован.");
    }
    console.log("[Swiper] Инициализация всех слайдеров завершена.");
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Main.js] DOMContentLoaded событие запущено.");
    initializeAllSwipers(); // Инициализируем все Swiper'ы при загрузке DOM

    const basketButton = document.querySelector(".header__basket");
    if (!basketButton) {
        console.warn("Кнопка корзины в шапке (.header__basket) не найдена!");
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return JSON.parse(decodeURIComponent(match[2]));
        return {};
    }

    function updateCartCounter() {
        if (!basketButton) return;
        let cart = getCookie("cart") || {};
        let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        basketButton.innerHTML = `<img src="/static/img/basket.png" alt="Корзина">${totalItems}`; // Путь к иконке для JS
        console.log("[Корзина] Счетчик обновлен:", totalItems);
    }

    function addToCart(productElement) {
        console.log("[addToCart] Попытка добавления товара. ProductElement:", productElement);
        if (!productElement) {
            console.error("[addToCart] ProductElement не определен.");
            return;
        }

        const productId = productElement.dataset.productId;
        let productName, productPrice, productImage;

        if (!productId) {
            console.error("[addToCart] CRITICAL: data-product-id не найден на productElement:", productElement);
            alert("Ошибка: ID товара не найден. Товар не может быть добавлен.");
            return;
        }
        console.log(`[addToCart] productId: ${productId}`);

        // Определяем тип карточки и извлекаем данные
        // 1. Страница товара (.product)
        if (productElement.classList.contains('product')) {
            console.log("[addToCart] Это страница товара (.product)");
            const nameEl = productElement.querySelector(".product__about h3"); // Имя товара
            const priceButtonEl = productElement.querySelector(".product__img button"); // Кнопка с ценой, как в вашем JS
            const imageEl = productElement.querySelector(".product-images-swiper .swiper-slide-active img") || productElement.querySelector(".product-images-swiper img"); // Активное или первое изображение

            productName = nameEl ? nameEl.innerText.replace(":", "").trim() : "Название не найдено";
            productPrice = priceButtonEl ? parseFloat(priceButtonEl.innerText.replace(/[^0-9.,]/g, '').replace(',', '.')) : 0;
            productImage = imageEl ? imageEl.src : "";

        // 2. Карточка товара в каталоге (.catalog__all__tovar)
        } else if (productElement.classList.contains('catalog__all__tovar')) {
            console.log("[addToCart] Это карточка из каталога (.catalog__all__tovar)");
            const nameLinkEl = productElement.querySelector(".catalog__all__tovar__text a"); // Ссылка с названием
            const priceEl = productElement.querySelector(".catalog__all__tovar__text p"); // Параграф с ценой
            // Изображение из внутреннего Swiper (если есть) или просто первое img
            const imageEl = productElement.querySelector(".catalog__all__tovar__img__img .swiper-slide-active img") || productElement.querySelector(".catalog__all__tovar__img__img img");

            productName = nameLinkEl ? nameLinkEl.innerText.trim() : "Название не найдено";
            productPrice = priceEl ? parseFloat(priceEl.innerText.replace(/[^0-9.,]/g, '').replace(',', '.')) : 0;
            productImage = imageEl ? imageEl.src : "";

        // 3. Карточка рекомендованного товара (предположим, это .swiper-slide внутри .product__container и он имеет класс .product_product)
        // или просто .swiper-slide, если класс .product_product не используется для слайдов.
        // В вашем JS используется button.closest(".swiper-slide"), значит productElement - это .swiper-slide
        } else if (productElement.classList.contains('swiper-slide') && productElement.closest('.product__container')) { // Уточняем, что это слайд из рекомендованных
            console.log("[addToCart] Это карточка рекомендованного товара (.swiper-slide в .product__container)");
            // Предположим, что внутри .swiper-slide для рекомендованных есть структура, похожая на .product__recomend
            const nameLinkEl = productElement.querySelector(".product__recomend a");
            const priceEl = productElement.querySelector(".product__recomend p");
            const imageEl = productElement.querySelector(".product__recomend img");
            // Если класс product_product используется на swiper-slide, то можно добавить: && productElement.classList.contains('product_product')

            productName = nameLinkEl ? nameLinkEl.innerText.trim() : "Название не найдено";
            productPrice = priceEl ? parseFloat(priceEl.innerText.replace(/[^0-9.,]/g, '').replace(',', '.')) : 0;
            productImage = imageEl ? imageEl.src : "";
        } else {
            console.error("[addToCart] Неизвестный тип productElement:", productElement);
            alert("Ошибка: Не удалось обработать товар.");
            return;
        }

        console.log(`[addToCart] Данные для productId ${productId}: Имя='${productName}', Цена=${productPrice}, Изображение='${productImage}'`);

        if (!productName || productName === "Название не найдено" || isNaN(productPrice)) {
             console.error(`[addToCart] Некорректные данные для товара ${productId}: Имя='${productName}', Цена=${productPrice}`);
             alert(`Не удалось добавить товар '${productName || 'Неизвестный товар'}' в корзину. Данные некорректны.`);
             return;
        }

        let cart = getCookie("cart") || {};
        if (cart[productId]) {
            cart[productId].quantity += 1;
        } else {
            cart[productId] = {
                name: productName, price: productPrice, image: productImage, quantity: 1
            };
        }
        setCookie("cart", cart, 7);
        updateCartCounter();
        console.log("[addToCart] Товар успешно добавлен/обновлен в корзине:", cart[productId]);
        // alert(`${productName} добавлен в корзину!`); // Раскомментируйте для уведомления
    }

    // Обработчик для кнопки "В корзину" на странице товара (product.html)
    const productPageContainer = document.querySelector(".product");
    if (productPageContainer) {
        // Предполагаем, что кнопка добавления в корзину имеет класс .add-to-cart-btn или вы можете использовать ваш селектор
        const addToCartBtnProductPage = productPageContainer.querySelector(".product__about__button button:first-child"); // ваш селектор
        if (addToCartBtnProductPage) {
            addToCartBtnProductPage.addEventListener("click", function () {
                console.log("Нажата кнопка 'В корзину' на странице товара.");
                addToCart(productPageContainer); // productPageContainer должен иметь data-product-id
            });
        }
    }

    // Обработчики для кнопок "В корзину" в каталоге
    const catalogItems = document.querySelectorAll(".catalog__all__tovar");
    catalogItems.forEach((item) => {
        const addToCartButton = item.querySelector(".in_basket"); // Селектор из вашего последнего JS
        if (addToCartButton) {
            addToCartButton.addEventListener("click", function (event) {
                event.preventDefault(); // Предотвращаем стандартное действие, если кнопка - ссылка
                console.log("Нажата кнопка 'В корзину' в каталоге.");
                // item (это .catalog__all__tovar) должен иметь data-product-id
                addToCart(item);
            });
        }
    });

    // Обработчики для кнопок "В корзину" в рекомендованных товарах
    // Используем класс .product__recomend__button__click из вашего JS
    const recommendedButtons = document.querySelectorAll(".product__recomend__button__click");
    recommendedButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Нажата кнопка 'В корзину' в рекомендованных.");
            const productElement = this.closest(".swiper-slide"); // productElement должен иметь data-product-id
            if (productElement) {
                addToCart(productElement);
            } else {
                console.error("Не удалось найти родительский .swiper-slide для рекомендованного товара.");
            }
        });
    });

    updateCartCounter(); // Первоначальное обновление счетчика

    // Переинициализация Swiper'ов при изменении размера окна для предотвращения "мигания"
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Переинициализация Swiper'ов из-за изменения размера окна.");
            initializeAllSwipers();
        }, 300);
    });

    console.log("[Main.js] Все обработчики событий DOMContentLoaded установлены.");
});

// Функция для бургер-меню (из вашего последнего JS)
function burgerMenu() {
    const menu = document.getElementById('burger-menu');
    if (menu) {
        // Предпочтительнее classList.toggle, но оставляю ваш вариант
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        console.log("[BurgerMenu] Состояние меню изменено.");
    } else {
        console.warn("[BurgerMenu] Элемент #burger-menu не найден!");
    }
}
console.log("[Main.js] Файл загружен и выполнен (до DOMContentLoaded).");