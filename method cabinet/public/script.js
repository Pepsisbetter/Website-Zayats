// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация прелоадера
    initPreloader();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация табов
    initTabs();
    
    // Инициализация модального окна
    initModal();
    
    // Инициализация админ-панели
    initAdminPanel();
    
    // Инициализация хлебных крошек
    initBreadcrumbs();
    
    // Инициализация формы обратной связи
    initContactForm();
    
    // Инициализация прогресс-бара чтения
    initReadingProgress();
    
    // Инициализация кнопки "Наверх"
    initScrollToTop();
    
    // Инициализация фильтров календарного плана
    initCalendarFilters();
    
    // Загрузка данных из localStorage
    loadStoredData();
});

// Прелоадер
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.progress');
    const particles = document.getElementById('particles');
    
    // Анимация частиц
    if (particles) {
        const ctx = particles.getContext('2d');
        particles.width = window.innerWidth;
        particles.height = window.innerHeight;
        
        const particlesArray = [];
        const numberOfParticles = 100;
        
        class Particle {
            constructor() {
                this.x = Math.random() * particles.width;
                this.y = Math.random() * particles.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > particles.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > particles.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, particles.width, particles.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animate);
        }
        
        init();
        animate();
        
        window.addEventListener('resize', () => {
            particles.width = window.innerWidth;
            particles.height = window.innerHeight;
        });
    }
    
    // Имитация загрузки
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        } else {
            width += Math.random() * 10;
            progress.style.width = Math.min(width, 100) + '%';
        }
    }, 100);
}

// Навигация
function initNavigation() {
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');
    
    // Бургер-меню
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Обновление активной ссылки
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Изменение шапки при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.padding = '5px 0';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.padding = '15px 0';
        }
    });
}

// Анимации при скролле
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(el => observer.observe(el));
}

// Табы
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            tabButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
                btn.classList.remove('active');
            });

            // Добавляем активный класс текущей кнопке
            button.setAttribute('aria-selected', 'true');
            button.classList.add('active');

            // Скрываем все панели
            tabPanels.forEach(panel => {
                panel.hidden = true;
                panel.classList.remove('active');

                // 🔥 Сбросить анимации внутри всех панелей
                const animElems = panel.querySelectorAll('.animate');
                animElems.forEach(el => el.classList.remove('animated'));
            });

            // Показываем выбранную панель
            const panelId = button.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            panel.hidden = false;
            panel.classList.add('active');

            // 🔥 Перезапускаем анимацию только в активной панели
            const activeElems = panel.querySelectorAll('.animate');
            activeElems.forEach(el => {
                void el.offsetWidth; // триггер перерисовки
                el.classList.add('animated');
            });
        });
    });
}


// Модальное окно
function initModal() {
    const loginModal = document.getElementById('loginModal');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('adminLoginForm');
    
    // Открытие модального окна
    adminLoginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        document.body.classList.add('no-scroll');
    });
    
    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    // Закрытие при клике вне модального окна
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
    
    // Форма входа
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = document.getElementById('adminLogin').value;
        const password = document.getElementById('adminPassword').value;
        
        // Простая проверка (в реальном приложении нужно использовать серверную аутентификацию)
        if (login === 'admin' && password === 'admin') {
            loginModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            showAdminPanel();
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            alert('Неверные учетные данные!');
        }
    });
}

// Админ-панель
function initAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');
    
    // Переключение вкладок админ-панели
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Удаляем активный класс у всех вкладок
            adminTabs.forEach(t => t.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            tab.classList.add('active');
            
            // Показываем соответствующий контент
            const tabId = tab.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Выход из админ-панели
    logoutBtn.addEventListener('click', () => {
        hideAdminPanel();
        localStorage.removeItem('adminLoggedIn');
    });
    
    // Инициализация форм админ-панели
    initAdminForms();
}

function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.add('active');
}

function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.remove('active');
}

function initAdminForms() {
    // Форма классного руководства
    const classroomForm = document.getElementById('classroomForm');
    if (classroomForm) {
        classroomForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addClassroomItem();
        });
    }
    
    // Форма внеурочной деятельности
    const extracurricularForm = document.getElementById('extracurricularForm');
    if (extracurricularForm) {
        extracurricularForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addExtracurricularProgram();
        });
    }
    
    // Форма календарного плана
    const calendarForm = document.getElementById('calendarForm');
    if (calendarForm) {
        calendarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addCalendarTopic();
        });
    }
    
    // Форма управления контентом
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveContent();
        });
    }
}

// Хлебные крошки
function initBreadcrumbs() {
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const currentPage = document.title;
    
    // Простая реализация хлебных крошек
    breadcrumbsContainer.innerHTML = `
        <a href="#home">Главная</a> / <span>${currentPage}</span>
    `;
}

// Форма обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Получение данных формы
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // В реальном приложении здесь будет отправка на сервер
            console.log('Данные формы:', data);
            
            // Очистка формы и показ сообщения
            contactForm.reset();
            alert('Сообщение отправлено! Спасибо за ваше обращение.');
        });
    }
}

// Прогресс-бар чтения
function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = (window.scrollY / documentHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Кнопка "Наверх"
function initScrollToTop() {
    const toTopButton = document.querySelector('.to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            toTopButton.classList.add('visible');
        } else {
            toTopButton.classList.remove('visible');
        }
    });
    
    toTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Фильтры календарного плана
function initCalendarFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            // Фильтрация данных (в реальном приложении будет загрузка разных данных)
            const semester = button.getAttribute('data-semester');
            filterCalendarData(semester);
        });
    });
}

function filterCalendarData(semester) {
    // В реальном приложении здесь будет загрузка данных для выбранного семестра
    console.log('Загрузка данных для семестра:', semester);
}

// Загрузка данных из localStorage
function loadStoredData() {
    // Проверка авторизации
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Загрузка данных классного руководства
    loadClassroomData();
    
    // Загрузка данных внеурочной деятельности
    loadExtracurricularData();
    
    // Загрузка данных календарного плана
    loadCalendarData();
}

// Управление классным руководством
function addClassroomItem() {
    const title = document.getElementById('classroomTitle').value;
    const date = document.getElementById('classroomDate').value;
    const description = document.getElementById('classroomDescription').value;
    const imageInput = document.getElementById('classroomImage');
    
    // В реальном приложении здесь будет загрузка изображения на сервер
    const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'https://source.unsplash.com/random/600x400/?education';
    
    const item = {
        id: Date.now(),
        title,
        date: new Date(date).toLocaleDateString('ru-RU'),
        description,
        image: imageUrl
    };
    
    // Сохранение в localStorage
    let items = JSON.parse(localStorage.getItem('classroomItems') || '[]');
    items.push(item);
    localStorage.setItem('classroomItems', JSON.stringify(items));
    
    // Обновление отображения
    renderClassroomItems();
    
    // Очистка формы
    document.getElementById('classroomForm').reset();
}

function loadClassroomData() {
    renderClassroomItems();
}

function renderClassroomItems() {
    const container = document.getElementById('classroomGrid');
    const items = JSON.parse(localStorage.getItem('classroomItems') || '[]');
    
    if (items.length === 0) {
        return; // Используем стандартные данные из HTML
    }
    
    container.innerHTML = items.map(item => `
        <div class="classroom-item animate">
            <img src="${item.image}" alt="${item.title}" class="classroom-item__img">
            <div class="classroom-item__content">
                <h3 class="classroom-item__title">${item.title}</h3>
                <p class="classroom-item__date">${item.date}</p>
                <p class="classroom-item__desc">${item.description}</p>
            </div>
        </div>
    `).join('');
}

// Управление внеурочной деятельностью
function addExtracurricularProgram() {
    const title = document.getElementById('programTitle').value;
    const description = document.getElementById('programDescription').value;
    const schedule = document.getElementById('programSchedule').value;
    const location = document.getElementById('programLocation').value;
    
    const program = {
        id: Date.now(),
        title,
        description,
        schedule,
        location
    };
    
    // Сохранение в localStorage
    let programs = JSON.parse(localStorage.getItem('extracurricularPrograms') || '[]');
    programs.push(program);
    localStorage.setItem('extracurricularPrograms', JSON.stringify(programs));
    
    // Обновление отображения
    renderExtracurricularPrograms();
    
    // Очистка формы
    document.getElementById('extracurricularForm').reset();
}

function loadExtracurricularData() {
    renderExtracurricularPrograms();
}

function renderExtracurricularPrograms() {
    const container = document.getElementById('extracurricularContent');
    const programs = JSON.parse(localStorage.getItem('extracurricularPrograms') || '[]');
    
    if (programs.length === 0) {
        return; // Используем стандартные данные из HTML
    }
    
    container.innerHTML = programs.map(program => `
        <div class="program-card animate">
            <div class="program-card__header">
                <i class="fas fa-chart-line program-card__icon"></i>
                <h3 class="program-card__title">${program.title}</h3>
            </div>
            <div class="program-card__body">
                <p class="program-card__desc">${program.description}</p>
                <ul class="program-card__list">
                    <li><strong>Время проведения:</strong> ${program.schedule}</li>
                    <li><strong>Место проведения:</strong> ${program.location}</li>
                </ul>
            </div>
        </div>
    `).join('');
}

// Управление календарным планом
function addCalendarTopic() {
    const semester = document.getElementById('semesterSelect').value;
    const week = document.getElementById('weekNumber').value;
    const topic = document.getElementById('topicTitle').value;
    const hours = document.getElementById('hoursCount').value;
    const control = document.getElementById('controlForm').value;
    
    const topicData = {
        id: Date.now(),
        semester,
        week,
        topic,
        hours,
        control
    };
    
    // Сохранение в localStorage
    let topics = JSON.parse(localStorage.getItem('calendarTopics') || '[]');
    topics.push(topicData);
    localStorage.setItem('calendarTopics', JSON.stringify(topics));
    
    // Обновление отображения
    renderCalendarTopics();
    
    // Очистка формы
    document.getElementById('calendarForm').reset();
}

function loadCalendarData() {
    renderCalendarTopics();
}

function renderCalendarTopics() {
    const container = document.getElementById('calendarTable');
    const topics = JSON.parse(localStorage.getItem('calendarTopics') || '[]');
    
    if (topics.length === 0) {
        return; // Используем стандартные данные из HTML
    }
    
    const tbody = topics.map(topic => `
        <tr>
            <td>${topic.week}</td>
            <td>${topic.topic}</td>
            <td>${topic.hours}</td>
            <td>${topic.control}</td>
            <td><a href="#" class="btn btn--outline btn--small">Скачать</a></td>
        </tr>
    `).join('');
    
    container.querySelector('tbody').innerHTML = tbody;
}

// Управление контентом
function saveContent() {
    const section = document.getElementById('contentSection').value;
    const content = document.getElementById('contentText').value;
    
    // Сохранение в localStorage
    localStorage.setItem(`content_${section}`, content);
    
    alert('Изменения сохранены!');
}

// Вспомогательные функции
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработчики событий для админ-панели
function uploadDocuments() {
    const fileInput = document.getElementById('documentUpload');
    if (fileInput.files.length > 0) {
        alert(`Загружено ${fileInput.files.length} документов`);
        // В реальном приложении здесь будет загрузка на сервер
    }
}

function uploadGalleryImage() {
    const fileInput = document.getElementById('galleryUpload');
    const description = document.getElementById('imageDescription').value;
    
    if (fileInput.files.length > 0 && description) {
        alert('Изображение добавлено в галерею');
        // В реальном приложении здесь будет загрузка на сервер
    }
}