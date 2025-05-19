document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.reviews__container', {
        slidesPerView: 3, 
        spaceBetween: 20, 
        navigation: {
            nextEl: '#arrow_right', 
            prevEl: '#arrow_left', 
        },
        loop: true,
        breakpoints: {
            1150: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1050: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            700: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            0: {
                slidesPerView: 1,
                spaceBetween: 10,
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.product__container', {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: '#arrow_right',
            prevEl: '#arrow_left',
        },
        loop: true,
        breakpoints: {
            1150: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1050: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            700: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            0: {
                slidesPerView: 1,
                spaceBetween: 10,
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.catalog__all__tovar__img__img', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '#arrow_right',
            prevEl: '#arrow_left',
        },
        loop: true,
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cartButton = document.querySelector(".product__about__button button:first-child");
const catalogButton = document.querySelector(".catalog__all__tovar__button div button:first-child");
    const basketButton = document.querySelector(".header__basket");

    // Функция для работы с cookies
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

    // Функция добавления товара в корзину
    function addToCart(productElement) {
        const productId = productElement.dataset.productId;



        const productName = productElement.querySelector("a").innerText;
        const productPrice = parseFloat(productElement.querySelector("p").innerText.replace(" ₽", ""));
        const productImage = productElement.querySelector("img").src;

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

        setCookie("cart", cart, 7);  // Сохраняем корзину в cookies на 7 дней
        updateCartCounter();  // Обновляем счетчик корзины
    }

    // Обновление счетчика корзины
    function updateCartCounter() {
        let cart = getCookie("cart") || {};
        let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

        basketButton.innerHTML = `<img src="/static/img/basket.png" alt="">${totalItems}`;
    }

    // Обработчик для кнопки на основной странице товара
    if (cartButton) {
        cartButton.addEventListener("click", function () {
            const productElement = document.querySelector(".product");
            addToCart(productElement);
        });
    }
    const catalogItems = document.querySelectorAll(".catalog__all__tovar");
    catalogItems.forEach((item) => {
        // Предполагается, что кнопка "В корзину" находится внутри этого товара
        const addToCartButton = item.querySelector(".catalog__all__tovar__button div button:first-child");
        if (addToCartButton) {
            addToCartButton.addEventListener("click", function () {
                // Используем `closest` для определения текущего товара
                const productElement = this.closest(".catalog__all__tovar");
                addToCart(productElement);
            });
        }
    });
    // Обработчик для кнопок на рекомендованных товарах
    const recommendedButtons = document.querySelectorAll(".product__recomend__button__click");
    recommendedButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productElement = button.closest(".swiper-slide");
            addToCart(productElement);
        });
    });

    // Обновление счетчика корзины при загрузке страницы
    updateCartCounter();
});

function burgerMenu(){
    const menu = document.getElementById('burger-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}