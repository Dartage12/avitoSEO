// Функция для инициализации всех Swiper'ов
function initializeAllSwipers() {
    // Swiper для reviews__container
    if (document.querySelector('.reviews__container')) {
        // Уничтожаем, если уже существует
        if (document.querySelector('.reviews__container').swiper) {
            document.querySelector('.reviews__container').swiper.destroy(true, true);
        }
        new Swiper('.reviews__container', {
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                nextEl: '#arrow_right', // Убедитесь, что у вас есть элементы с ID "arrow_right" и "arrow_left"
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
    }

    // Swiper для product__container (если он есть на странице)
    if (document.querySelector('.product__container')) {
        // Уничтожаем, если уже существует
        if (document.querySelector('.product__container').swiper) {
            document.querySelector('.product__container').swiper.destroy(true, true);
        }
        new Swiper('.product__container', {
            slidesPerView: 3,
            spaceBetween: 20,
            navigation: {
                nextEl: '#arrow_right', // Убедитесь, что у вас есть элементы с ID "arrow_right" и "arrow_left"
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
    }

    // Swiper для каждого .catalog__all__tovar__img__img (слайдеры внутри карточек)
    document.querySelectorAll(".catalog__all__tovar").forEach((tovar) => {
        const swiperContainer = tovar.querySelector(".catalog__all__tovar__img__img"); // Используем более специфичный селектор
        const prevButton = tovar.querySelector(".prev-slide");
        const nextButton = tovar.querySelector(".next-slide");

        if (swiperContainer && prevButton && nextButton) {
            // Уничтожаем существующий Swiper, если он есть
            if (swiperContainer.swiper) {
                swiperContainer.swiper.destroy(true, true); // true, true для полного уничтожения и очистки стилей
            }
            // Инициализируем новый Swiper
            new Swiper(swiperContainer, {
                slidesPerView: 1,
                spaceBetween: 10, // Swiper-слайды внутри одной карточки
                loop: true,
                navigation: {
                    nextEl: nextButton,
                    prevEl: prevButton,
                },
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAllSwipers(); // Инициализируем все Swiper'ы при загрузке DOM

    // --- Логика корзины (остается без изменений) ---
    const cartButton = document.querySelector(".product__about__button button:first-child");
    // const catalogButton = document.querySelector("#in_basket"); // Этот селектор может быть неверным, если вы используете class
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
        const productName = productElement.querySelector("a").innerText;
        const productPrice = parseFloat(productElement.querySelector("p").innerText.replace(" ₽", ""));
        const productImage = productElement.querySelector("img").src; // Используем первый img, может потребоваться уточнение

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

    function updateCartCounter() {
        let cart = getCookie("cart") || {};
        let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        basketButton.innerHTML = `<img src="/static/img/basket.png" alt="">${totalItems}`;
    }

    if (cartButton) {
        cartButton.addEventListener("click", function () {
            const productElement = document.querySelector(".product");
            addToCart(productElement);
        });
    }

    const catalogItems = document.querySelectorAll(".catalog__all__tovar");
    catalogItems.forEach((item) => {
        const addToCartButton = item.querySelector(".in_basket"); // Убедитесь, что у кнопки есть класс 'in_basket'
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
            const productElement = button.closest(".swiper-slide"); // Будьте внимательны: если это Swiper-слайд, он может не иметь всех данных
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