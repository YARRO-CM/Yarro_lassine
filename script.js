// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functions
    initLoader();
    initScrollProgress();
    initTiltEffect();
    initParticles();
    initAOS();
    initNavbar();
    initThemeToggle();
    initTypingEffect();
    initBackToTop();
    initProjectsFilter();
    initProjectsData();
    initContactForm();
    initHaptics();
    initCustomCursor();
    setCurrentYear();
});

// Custom Cursor Logic
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .project-item, .skill-item, .tech-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Loader logic
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.style.overflow = 'visible';
        }, 500);
    });
}

// Scroll progress bar logic
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });
}

// Interactive Tilt Effect (Vanilla JS)
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-item, .skill-item, .detail-item');

    cards.forEach(card => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Initialize particles.js
function initParticles() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    if (document.getElementById('particles-js')) {
        const run = () => particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#4a6cf7'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#4a6cf7',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
        if ('requestIdleCallback' in window) {
            requestIdleCallback(run);
        } else {
            setTimeout(run, 0);
        }
    }
}

// Initialize AOS animation library
function initAOS() {
    const run = () => AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    if ('requestIdleCallback' in window) {
        requestIdleCallback(run);
    } else {
        setTimeout(run, 0);
    }
}

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu with Escape key
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Add active class to nav links on scroll
    window.addEventListener('scroll', function () {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';

        if (currentTheme !== 'dark') {
            newTheme = 'dark';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Typing effect for hero section
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const phrases = [
        'Élève Ingénieur en Génie Rural',
        'Spécialiste Eau & Environnement',
        'Passionné d\'IA & Data Science',
        'Expert en SIG & Modélisation',
        'Futur Ingénieur E.I.E',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// Scroll animations for elements
function initScrollAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');

    // Initialize progress bars at 0 width
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.progress-bar');
        const percentage = item.querySelector('.skill-percentage').textContent;
        progressBar.style.width = '0%';
    });

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Function to animate elements when they come into view
    function animateOnScroll() {
        skillItems.forEach(item => {
            if (isInViewport(item)) {
                const progressBar = item.querySelector('.progress-bar');
                const percentage = item.querySelector('.skill-percentage').textContent;
                progressBar.style.width = percentage;
            }
        });
    }

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Run once on page load
    animateOnScroll();
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Projects filter functionality
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const projectItems = document.querySelectorAll('.project-item');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
// Dynamically populate projects
function initProjectsData() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    const projects = [
        {
            id: 1,
            title: "Conception et Dimensionnement d'une STEP",
            date: "nov. 2025 – janv. 2026",
            description: "Projet académique de conception et dimensionnement d'une STEP pour une commune rurale de 20 000 habitants (Province d'El Jadida). Dimensionnement de 3 filières : boues activées, filtres plantés de roseaux, lagunage naturel.",
            image: "image/ressoucre.png",
            category: "geo",
            tags: ['Hydraulique', 'AutoCAD', 'STEP', 'Environnement']
        },
        {
            id: 2,
            title: "Barrage Multifonction (AEP & Irrigation)",
            date: "oct. 2025 – déc. 2025",
            description: "Conception complète d'un grand barrage pour l'AEP et l'irrigation de 1 000 ha. Analyse multicritère du site, dimensionnement hydraulique (BCR) et ouvrages annexes.",
            image: "image/gis.jpeg",
            category: "geo",
            tags: ['Hydrologie', 'Géotechnique', 'BCR', 'AEP']
        },
        {
            id: 3,
            title: "Modélisation Nappe (GMS/MODFLOW)",
            date: "oct. 2025 – déc. 2025",
            description: "Modèle hydrogéologique sous GMS pour simuler l'écoulement souterrain dans un aquifère de 33 750 ha. Analyse d'impact des pompages et bilan hydrique.",
            image: "image/geostat.jpg",
            category: "geo",
            tags: ['GMS', 'MODFLOW', 'Hydrogéologie', 'QGIS']
        },
        {
            id: 4,
            title: "Business Plan : HYDER Ingénierie",
            date: "nov. 2025 – déc. 2025",
            description: "Cocréation d'un bureau d'études fictif spécialisé en Hydraulique & Énergies Renouvelables. Étude de marché, stratégie commerciale et modélisation financière (VAN/TRI).",
            image: "image/dashboard.png",
            category: "ai",
            tags: ['Business Plan', 'Management', 'Finances', 'Stratégie']
        },
        {
            id: 5,
            title: "Gestion des Déchets Campus IAV",
            date: "oct. 2025 – nov. 2025",
            description: "Conception d'un système intégré de gestion et de valorisation des déchets solides pour le campus de l'IAV Hassan II (restaurant et internat).",
            image: "image/ressoucre.png",
            category: "geo",
            tags: ['Déchets', 'Valorisation', 'Environnement', 'Diagnostic']
        },
        {
            id: 6,
            title: "Irrigation par Énergies Renouvelables",
            date: "juin 2025 – juil. 2025",
            description: "Analyse technico-économique et environnementale (empreinte carbone, OPEX/CAPEX) de l'irrigation photovoltaïque vs butane/gasoil pour une parcelle d'avocatiers (15 ha).",
            image: "image/geostat.jpg",
            category: "energy",
            tags: ['PV', 'Avocatier', 'Économie', 'Carbone']
        },
        {
            id: 7,
            title: "Système d'Irrigation Goutte à Goutte",
            date: "avr. 2025 – juil. 2025",
            description: "Conception et simulation hydraulique sous EPANET d'un réseau localisé. Calcul des besoins en eau, dimensionnement des rampes et systèmes de filtration/fertigation.",
            image: "image/gis.jpeg",
            category: "irrigation",
            tags: ['EPANET', 'Hydraulique', 'Gestion de l\'eau']
        },
        {
            id: 8,
            title: "Pompage Solaire (Ain Sfa, Oujda)",
            date: "juil. 2025",
            description: "Étude et simulation RETScreen d'un système PV de 10 kWc (61 panneaux) pour pomper 120 m³/jour. Réduction de 26 tCO₂/an.",
            image: "image/dashboard.png",
            category: "energy",
            tags: ['RETScreen', 'PV', 'Solaire', 'Oujda']
        },
        {
            id: 9,
            title: "Assainissement Agricole (Gharb)",
            date: "mai 2025 – juin 2025",
            description: "Dimensionnement de drains et collecteurs selon la méthode de Hooghoudt. Élaboration de plans AutoCAD et devis estimatif global.",
            image: "image/ml-classification.png",
            category: "geo",
            tags: ['AutoCAD', 'Excel', 'Drainage', 'Gharb']
        },
        {
            id: 10,
            title: "Détection Intelligente de Fuites",
            date: "oct. 2024 – juin 2025",
            description: "Développement d'un prototype IA (Isolation Forest) couplé à Arduino pour la détection et localisation de fuites en temps réel. Présenté au SIAV devant le Ministre.",
            image: "image/ml-classification.png",
            category: "ai",
            tags: ['IA', 'Arduino', 'Python', 'Hydraulique']
        },
        {
            id: 11,
            title: "Réseau d'Assainissement EU/EP",
            date: "avr. 2025 – mai 2025",
            description: "Dimensionnement hydraulique automatisé (Excel) pour les eaux usées et modélisation Covadis 17.0 pour les eaux pluviales (bassins versants).",
            image: "image/gis.jpeg",
            category: "geo",
            tags: ['Covadis', 'Excel', 'Assainissement', 'Pluvial']
        },
        {
            id: 12,
            title: "Modélisation BIM Revit (R+3)",
            date: "mai 2025",
            description: "Conception architecturale et modélisation BIM complète d'une maison R+3 sous Autodesk Revit (plans, coupes, vues 3D).",
            image: "image/webdev.jpg",
            category: "structure",
            tags: ['BIM', 'Revit', 'AutoCAD', 'Conception 3D']
        },
        {
            id: 13,
            title: "Analyse Structurelle RSA (Portique)",
            date: "mai 2025",
            description: "Modélisation par éléments finis d'un portique 2D sous Autodesk RSA. Analyse des déplacements, diagrammes de sollicitations et stabilité.",
            image: "image/ml-classification.png",
            category: "structure",
            tags: ['RSA', 'Éléments Finis', 'Structure', 'Mécanique']
        },
        {
            id: 14,
            title: "Stabilité Mur de Soutènement",
            date: "mai 2025",
            description: "Étude géotechnique de stabilité (glissement, renversement, tassement) d'un mur en sol pulvérulent avec optimisation géométrique.",
            image: "image/geostat.jpg",
            category: "structure",
            tags: ['Géotechnique', 'Stabilité', 'Sols', 'Génie Civil']
        },
        {
            id: 15,
            title: "Réseau AEP Lotissement Urbain",
            date: "févr. 2025 – avr. 2025",
            description: "Dimensionnement et simulation hydraulique sous EPANET d'un réseau AEP pour 1500 habitants. Optimisation des pressions et vitesses.",
            image: "image/gis.jpeg",
            category: "geo",
            tags: ['EPANET', 'AEP', 'Hydraulique Urbaine', 'AutoCAD']
        }
    ];

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = `project-item ${project.category}`;
        projectItem.setAttribute('data-aos', 'fade-up');
        projectItem.setAttribute('data-aos-delay', (project.id * 100).toString());

        projectItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" decoding="async">
            <div class="project-content">
                <span class="project-date" style="font-size: 0.8rem; color: var(--text-color-light);">${project.date}</span>
                <h3 style="margin-top: 5px;">${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectItem);
    });
}
// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulation d'envoi
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

            setTimeout(() => {
                showToast('Votre message a été envoyé avec succès !');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Gentle haptic feedback for key interactions (mobile/touch only)
function initHaptics() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const canVibrate = 'vibrate' in navigator;
    if (!isTouch || !canVibrate) return;

    const vibrateTap = () => navigator.vibrate?.(12);
    const vibrateStrong = () => navigator.vibrate?.([8, 12]);

    const tapSelectors = [
        '.btn',
        '.nav-link',
        '#theme-toggle',
        '.filter-btn',
        '#back-to-top',
        '.project-link',
        '.social-link'
    ];
    const elements = document.querySelectorAll(tapSelectors.join(','));
    elements.forEach(el => {
        el.addEventListener('click', vibrateTap, { passive: true });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') vibrateTap();
        }, { passive: true });
    });

    // Stronger feedback for theme toggle and back-to-top
    document.getElementById('theme-toggle')?.addEventListener('click', vibrateStrong, { passive: true });
    document.getElementById('back-to-top')?.addEventListener('click', vibrateStrong, { passive: true });
}
