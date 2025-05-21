// main.js

// Функция для инициализации всех Swiper'ов
function initializeAllSwipers() {
    // Swiper для reviews__container
    const reviewsSwiperContainer = document.querySelector('.reviews__container');
    if (reviewsSwiperContainer) {
        if (reviewsSwiperContainer.swiper) {
            reviewsSwiperContainer.swiper.destroy(true, true);
        }
        new Swiper(reviewsSwiperContainer, {
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                // Используем стандартные классы Swiper для стрелок.
                // Убедитесь, что в HTML для reviews__container добавлены
                // <div class="swiper-button-prev reviews-prev"></div>
                // <div class="swiper-button-next reviews-next"></div>
                nextEl: '.reviews-next',
                prevEl: '.reviews-prev',
            },
            loop: true,
            breakpoints: {
                1150: { slidesPerView: 3, spaceBetween: 15, },
                1050: { slidesPerView: 2, spaceBetween: 15, },
                700: { slidesPerView: 1, spaceBetween: 10, },
                0: { slidesPerView: 1, spaceBetween: 10, }
            }
        });
    }

    // Swiper для product__container (блок "Может быть интересно" на странице продукта)
    const productContainerSwiper = document.querySelector('.product__container');
    if (productContainerSwiper) {
        if (productContainerSwiper.swiper) {
            productContainerSwiper.swiper.destroy(true, true);
        }
        new Swiper(productContainerSwiper, {
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                // Используем стандартные классы Swiper для стрелок.
                // Убедитесь, что в HTML для product__container добавлены
                // <div class="swiper-button-prev product-rec-prev"></div>
                // <div class="swiper-button-next product-rec-next"></div>
                nextEl: '.product-rec-next',
                prevEl: '.product-rec-prev',
            },
            loop: true,
            breakpoints: {
                1150: { slidesPerView: 3, spaceBetween: 15, },
                1050: { slidesPerView: 2, spaceBetween: 15, },
                700: { slidesPerView: 1, spaceBetween: 10, },
                0: { slidesPerView: 1, spaceBetween: 10, }
            }
        });
    }

    // Swiper для каждого .catalog__all__tovar__img__img (слайдеры внутри карточек каталога)
    document.querySelectorAll(".catalog__all__tovar").forEach((tovar) => {
        const swiperContainer = tovar.querySelector(".catalog__all__tovar__img__img");
        // Эти селекторы prev-slide/next-slide должны быть уникальны для каждой карточки в каталоге.
        // Убедитесь, что в HTML карточки добавлены
        // <div class="swiper-button-prev catalog-item-prev"></div>
        // <div class="swiper-button-next catalog-item-next"></div>
        const prevButton = tovar.querySelector(".catalog-item-prev");
        const nextButton = tovar.querySelector(".catalog-item-next");

        if (swiperContainer && prevButton && nextButton) {
            if (swiperContainer.swiper) {
                swiperContainer.swiper.destroy(true, true);
            }
            new Swiper(swiperContainer, {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: true,
                navigation: {
                    nextEl: nextButton,
                    prevEl: prevButton,
                },
            });
        }
    });

    // Swiper для изображений на странице продукта (product.html)
    const productImagesSwiper = document.querySelector('.product-images-swiper');
    if (productImagesSwiper) {
        if (productImagesSwiper.swiper) {
            productImagesSwiper.swiper.destroy(true, true);
        }
        new Swiper(productImagesSwiper, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            navigation: {
                nextEl: '.product-next-btn', // Эти классы мы уже настроили в product.css
                prevEl: '.product-prev-btn',
            },
            // Раскомментируйте, если нужна пагинация в виде точек
            /*
            pagination: {
                el: '.swiper-pagination.product-pagination',
                clickable: true,
            },
            */
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAllSwipers(); // Инициализируем все Swiper'ы при загрузке DOM

    // --- Логика корзины (остается без изменений) ---
    const cartButton = document.querySelector(".product__about__button button:first-child");
    const basketButton = document.querySelector(".header__basket");

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

    function addToCart(productElement) {
        const productId = productElement.dataset.productId;
        let productName, productPrice, productImage;

        if (productElement.classList.contains('product')) { // Если это блок product на product.html
            productName = productElement.querySelector("h3").innerText.replace(":", "");
            productPrice = parseFloat(productElement.querySelector(".product__img button").innerText.replace(" ₽", ""));
            productImage = productElement.querySelector(".product-images-swiper img").src; // Берем активное изображение из Swiper
        } else if (productElement.classList.contains('catalog__all__tovar')) { // Если это карточка из каталога
            productName = productElement.querySelector("a").innerText;
            productPrice = parseFloat(productElement.querySelector("p").innerText.replace(" ₽", ""));
            // Важно: для карточек каталога нужно брать активное изображение из Swiper,
            // а не всегда первое. Это может потребовать получения текущего активного слайда.
            // Для простоты пока оставим первое, но имейте это в виду.
            productImage = productElement.querySelector(".swiper-slide img").src;
        } else if (productElement.classList.contains('product_product')) { // Если это карточка из "Может быть интересно"
             productName = productElement.querySelector("a").innerText;
             productPrice = parseFloat(productElement.querySelector("p").innerText.replace(" ₽", ""));
             productImage = productElement.querySelector("img").src;
        }

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
        updateCartCounter();
    }

    if (cartButton) {
        cartButton.addEventListener("click", function () {
            const productElement = document.querySelector(".product"); // Основной блок продукта
            addToCart(productElement);
        });
    }

    const catalogItems = document.querySelectorAll(".catalog__all__tovar");
    catalogItems.forEach((item) => {
        const addToCartButton = item.querySelector(".in_basket");
        if (addToCartButton) {
            addToCartButton.addEventListener("click", function () {
                console.log("Кнопка 'В корзину' нажата");
                const productElement = this.closest(".catalog__all__tovar");
                addToCart(productElement);
            });
        }
    });

    const recommendedButtons = document.querySelectorAll(".product__recomend__button__click");
    recommendedButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productElement = button.closest(".swiper-slide"); // В данном случае, это слайд из Swiper
            addToCart(productElement);
        });
    });

    updateCartCounter();

    // --- Обработка изменения размера окна (как крайняя мера, если "мигание" при ресайзе все еще есть) ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Re-initializing Swipers due to resize.");
            initializeAllSwipers(); // Переинициализируем все Swiper'ы
        }, 300);
    });
});

function burgerMenu() {
    const menu = document.getElementById('burger-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}