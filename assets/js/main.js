/* ==========================================
   APLICACIÓN PRINCIPAL
   ========================================== */

class DistroGuideApp {
    constructor() {
        this.isInitialized = false;
        this.deviceInfo = null;
        this.browserSupport = null;
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        if (this.isInitialized) return;

        Utils.onDOMReady(() => {
            this.setupApp();
        });
    }

    /**
     * Configura la aplicación principal
     */
    setupApp() {
        try {
            // Obtener información del dispositivo y navegador
            this.deviceInfo = Utils.getDeviceInfo();
            this.browserSupport = Utils.getBrowserSupport();

            // Configurar Tailwind
            this.setupTailwindConfig();

            // Inicializar módulos
            this.setupDarkMode();
            this.setupAnimations();
            this.setupInteractivity();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();

            // Marcar como inicializado
            this.isInitialized = true;

            console.log('🚀 Distro Guide App initialized successfully');
        } catch (error) {
            Utils.handleError(error, 'App Initialization');
        }
    }

    /**
     * Configura Tailwind CSS personalizado
     */
    setupTailwindConfig() {
        if (typeof tailwind !== 'undefined') {
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            'orbitron': ['Orbitron', 'monospace'],
                            'exo': ['Exo 2', 'sans-serif'],
                        },
                        animation: {
                            'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                            'float': 'float 3s ease-in-out infinite',
                            'gradient': 'gradient 3s ease infinite',
                            'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite alternate',
                        }
                    }
                }
            };
        }
    }

    /**
     * Configura el sistema de modo oscuro
     */
    setupDarkMode() {
        // Detectar preferencia inicial
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (prefersDark.matches) {
            document.documentElement.classList.add('dark');
        }

        // Escuchar cambios
        prefersDark.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }

    /**
     * Inicializa el sistema de animaciones
     */
    setupAnimations() {
        if (window.AnimationManager) {
            window.AnimationManager.init();
            this.setupInitialAnimations();
        }
    }

    /**
     * Configura animaciones iniciales
     */
    setupInitialAnimations() {
        // Animar elementos con delay escalonado
        const sections = document.querySelectorAll('.distro-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.2}s`;
        });

        // Animar header
        const header = document.querySelector('header');
        if (header) {
            Utils.addClassWithDelay(header, 'animate-fade-in', 100);
        }

        // Animar footer
        const footer = document.querySelector('.app-footer');
        if (footer) {
            Utils.addClassWithDelay(footer, 'animate-fade-in', 500);
        }
    }

    /**
     * Configura interactividad general
     */
    setupInteractivity() {
        this.setupSmoothScroll();
        this.setupKeyboardNavigation();
        this.setupClickHandlers();
    }

    /**
     * Configura scroll suave
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Configura navegación por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navegación con flechas en tarjetas
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
                e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleArrowKeyNavigation(e);
            }
            
            // Escape para cerrar elementos activos
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    /**
     * Maneja navegación con flechas
     * @param {KeyboardEvent} e - Evento de teclado
     */
    handleArrowKeyNavigation(e) {
        const activeElement = document.activeElement;
        const distroCards = Array.from(document.querySelectorAll('.distro-card'));
        const currentIndex = distroCards.indexOf(activeElement);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        const cardsPerRow = this.getCardsPerRow();
        
        switch (e.key) {
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % distroCards.length;
                break;
            case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + distroCards.length) % distroCards.length;
                break;
            case 'ArrowDown':
                nextIndex = Math.min(currentIndex + cardsPerRow, distroCards.length - 1);
                break;
            case 'ArrowUp':
                nextIndex = Math.max(currentIndex - cardsPerRow, 0);
                break;
            default:
                return;
        }
        
        distroCards[nextIndex].focus();
        e.preventDefault();
    }

    /**
     * Obtiene número de tarjetas por fila según el viewport
     * @returns {number} Número de tarjetas por fila
     */
    getCardsPerRow() {
        if (this.deviceInfo.screenWidth < 768) return 1;
        if (this.deviceInfo.screenWidth < 1024) return 2;
        return 4;
    }

    /**
     * Maneja tecla Escape
     */
    handleEscapeKey() {
        // Remover focus de elementos
        document.activeElement.blur();
        
        // Limpiar estados activos
        document.querySelectorAll('.active, .focused').forEach(element => {
            element.classList.remove('active', 'focused');
        });
    }

    /**
     * Configura manejadores de click
     */
    setupClickHandlers() {
        // Click en tarjetas de distribuciones
        document.querySelectorAll('.distro-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleDistroCardClick(card, e);
            });
        });

        // Click en secciones
        document.querySelectorAll('.distro-section').forEach(section => {
            section.addEventListener('click', (e) => {
                this.handleSectionClick(section, e);
            });
        });
    }

    /**
     * Maneja click en tarjetas de distribuciones
     * @param {Element} card - Tarjeta clickeada
     * @param {Event} e - Evento de click
     */
    handleDistroCardClick(card, e) {
        const distroName = card.querySelector('h3').textContent;
        
        // Agregar clase temporal para feedback visual
        card.classList.add('clicked');
        setTimeout(() => {
            card.classList.remove('clicked');
        }, 200);
        
        // Log para analytics (en producción podrías enviar esto a un servicio)
        console.log(`Distro clicked: ${distroName}`);
    }

    /**
     * Maneja click en secciones
     * @param {Element} section - Sección clickeada
     * @param {Event} e - Evento de click
     */
    handleSectionClick(section, e) {
        const category = section.dataset.category;
        console.log(`Section clicked: ${category}`);
    }

    /**
     * Configura mejoras de accesibilidad
     */
    setupAccessibility() {
        // Agregar atributos ARIA
        this.addARIAAttributes();
        
        // Configurar skip links
        this.setupSkipLinks();
        
        // Mejorar contraste en modo de alto contraste
        this.setupHighContrastMode();
    }

    /**
     * Agrega atributos ARIA para accesibilidad
     */
    addARIAAttributes() {
        // Hacer tarjetas focusables
        document.querySelectorAll('.distro-card').forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Distribución ${card.querySelector('h3').textContent}`);
        });

        // Agregar landmarks
        const main = document.querySelector('main');
        if (main) main.setAttribute('role', 'main');
        
        const header = document.querySelector('header');
        if (header) header.setAttribute('role', 'banner');
        
        const footer = document.querySelector('footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
    }

    /**
     * Configura skip links para navegación rápida
     */
    setupSkipLinks() {
        const skipLink = Utils.createElement('a', {
            href: '#main-content',
            className: 'skip-link',
            'aria-label': 'Saltar al contenido principal'
        }, 'Saltar al contenido');
        
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--neon-blue);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Configura modo de alto contraste
     */
    setupHighContrastMode() {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const applyHighContrast = (shouldApply) => {
            if (shouldApply) {
                document.documentElement.classList.add('high-contrast');
            } else {
                document.documentElement.classList.remove('high-contrast');
            }
        };
        
        applyHighContrast(mediaQuery.matches);
        mediaQuery.addEventListener('change', (e) => applyHighContrast(e.matches));
    }

    /**
     * Configura optimizaciones de rendimiento
     */
    setupPerformanceOptimizations() {
        // Lazy loading de imágenes
        this.setupLazyLoading();
        
        // Optimización de animaciones
        this.optimizeAnimations();
        
        // Cleanup en unload
        this.setupCleanup();
    }

    /**
     * Configura lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Optimiza animaciones según el dispositivo
     */
    optimizeAnimations() {
        if (this.deviceInfo.isMobile) {
            // Reducir animaciones en móviles
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
        
        // Pausar animaciones cuando la página no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused-animations');
            } else {
                document.body.classList.remove('paused-animations');
            }
        });
    }

    /**
     * Configura limpieza al salir
     */
    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            if (window.AnimationManager) {
                window.AnimationManager.cleanup();
            }
        });
    }

    /**
     * Método público para reinicializar la app
     */
    reinitialize() {
        this.isInitialized = false;
        this.init();
    }
}

// Inicializar aplicación
const app = new DistroGuideApp();
app.init();

// Exportar para uso global
window.DistroGuideApp = app;