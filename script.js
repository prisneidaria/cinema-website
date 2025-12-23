// ========================
// ОСНОВНАЯ НАВИГАЦИЯ С АНИМАЦИЯМИ
// ========================

document.addEventListener('DOMContentLoaded', function() {
    // ===== 1. ПЛАВНАЯ ПРОКРУТКА К РАЗДЕЛАМ =====
    const navLinks = document.querySelectorAll('.main-nav a, .footer-links a, .btn-scroll');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Прокрутка с плавной анимацией
                smoothScrollTo(targetElement);
                
                // Обновляем активный пункт меню
                updateActiveNav(this);
            }
        });
    });
    
    // ===== 2. ФУНКЦИЯ ПЛАВНОЙ ПРОКРУТКИ =====
    function smoothScrollTo(element) {
        const targetPosition = element.offsetTop - 100; // Отступ сверху
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // Длительность анимации в мс
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        // Функция плавности easeInOutQuad
        function easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // ===== 3. ОБНОВЛЕНИЕ АКТИВНОГО ПУНКТА МЕНЮ =====
    function updateActiveNav(clickedLink) {
        // Убираем активный класс у всех ссылок
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем активный класс к кликнутой ссылке
        if (clickedLink.classList.contains('nav-link')) {
            clickedLink.classList.add('active');
        }
    }
    
    // ===== 4. АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ ПРОКРУТКЕ =====
    const sections = document.querySelectorAll('section[id]');
    
    function onScroll() {
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Обновляем активную ссылку в навигации
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Добавляем анимацию появления секции
                if (!section.classList.contains('animated')) {
                    section.classList.add('animated');
                    animateSection(section);
                }
            }
        });
    }
    
    window.addEventListener('scroll', onScroll);
    onScroll(); // Инициализация при загрузке
    
    // ===== 5. АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ =====
    function animateSection(section) {
        const elements = section.querySelectorAll('.movie-card, .price-card, .team-card, .cinema-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // ===== 6. КНОПКА "НАВЕРХ" =====
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        smoothScrollTo(document.body);
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // ===== 7. ИНИЦИАЛИЗАЦИЯ ВСЕХ СЕКЦИЙ =====
    sections.forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('animated');
            animateSection(section);
        }
    });
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
});

// ========================
// CSS ДЛЯ АНИМАЦИЙ
// ========================

/*
Добавьте этот CSS в ваш style.css:
*/

.scroll-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
}

.scroll-top-btn.visible {
    opacity: 1;
    visibility: visible;
}

.scroll-top-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
}

/* Анимации для секций */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated .movie-card,
.animated .price-card,
.animated .team-card,
.animated .cinema-card {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Задержки для анимации элементов */
.animated .movie-card:nth-child(1) { animation-delay: 0.1s; }
.animated .movie-card:nth-child(2) { animation-delay: 0.2s; }
.animated .movie-card:nth-child(3) { animation-delay: 0.3s; }
.animated .movie-card:nth-child(4) { animation-delay: 0.4s; }

/* Индикатор активной секции */
section {
    position: relative;
}

section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
}

section.animated::before {
    opacity: 1;
}

// ========================
// HTML С ИНДИКАТОРАМИ ПРОГРЕССА
// ========================

/*
Обновите навигацию в HTML, добавив индикаторы:
*/

<nav class="main-nav">
    <ul class="nav-list">
        <li>
            <a href="#now-playing" class="nav-link active">
                <i class="fas fa-play-circle"></i>
                <span>Сейчас в кино</span>
                <div class="nav-progress"></div>
            </a>
        </li>
        <li>
            <a href="#coming-soon" class="nav-link">
                <i class="far fa-clock"></i>
                <span>Скоро</span>
                <div class="nav-progress"></div>
            </a>
        </li>
        <li>
            <a href="#cinemas" class="nav-link">
                <i class="fas fa-video"></i>
                <span>Кинозалы</span>
                <div class="nav-progress"></div>
            </a>
        </li>
        <li>
            <a href="#prices" class="nav-link">
                <i class="fas fa-tags"></i>
                <span>Цены</span>
                <div class="nav-progress"></div>
            </a>
        </li>
        <li>
            <a href="#team" class="nav-link">
                <i class="fas fa-users"></i>
                <span>Команда</span>
                <div class="nav-progress"></div>
            </a>
        </li>
    </ul>
</nav>

/* CSS для индикаторов прогресса */
.nav-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: var(--primary);
    transition: width 0.3s ease;
    border-radius: 2px;
}

.nav-link.active .nav-progress {
    width: 100%;
}

// ========================
// ПЛАВНАЯ ПРОКРУТКА ДЛЯ КНОПОК В ГЕРОЕ
// ========================

/*
Если у вас есть кнопки в герое-секции, добавьте им классы:
*/

<div class="hero-actions">
    <button class="btn btn-primary btn-scroll" data-target="#now-playing">
        <i class="fas fa-film"></i> Смотреть афишу
    </button>
    <button class="btn btn-outline btn-scroll" data-target="#prices">
        <i class="fas fa-ticket-alt"></i> Купить билет
    </button>
</div>

// ========================
// ДОПОЛНИТЕЛЬНЫЙ JS ДЛЯ КНОПОК С ДАТА-АТРИБУТАМИ
// ========================

// Обработка кнопок с data-target
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-scroll').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                
                // Добавляем эффект пульсации на кнопке
                this.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 600);
            }
        });
    });
});

/* CSS для пульсации кнопок */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.btn-scroll {
    transition: all 0.3s ease;
}

.btn-scroll:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

// ========================
// ПРОГРЕСС-БАР ПРОКРУТКИ СТРАНИЦЫ
// ========================

/*
Добавьте прогресс-бар в верхней части страницы:
*/

<div class="scroll-progress">
    <div class="scroll-progress-bar" id="scrollProgress"></div>
</div>

/* CSS для прогресс-бара */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: transparent;
    z-index: 1001;
}

.scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    width: 0%;
    transition: width 0.1s ease;
}

// JS для прогресс-бара
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// ========================
// ФИКСИРОВАННАЯ НАВИГАЦИЯ С ЭФФЕКТОМ
// ========================

window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    
    if (window.pageYOffset > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* CSS для фиксированной навигации */
.main-header.scrolled {
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    padding: 10px 0;
}

// ========================
// ПОДСВЕТКА СЕКЦИИ ПРИ НАВЕДЕНИИ НА МЕНЮ
// ========================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.classList.add('highlight');
        }
    });
    
    link.addEventListener('mouseleave', function() {
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.classList.remove('highlight');
        }
    });
});

/* CSS для подсветки секции */
.highlight {
    position: relative;
    z-index: 1;
}

.highlight::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(229, 9, 20, 0.05);
    z-index: -1;
    border-radius: var(--radius-lg);
}
