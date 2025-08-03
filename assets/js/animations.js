/* ==========================================
   SISTEMA DE ANIMACIONES
   ========================================== */

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isInitialized = false;
    }

    /**
     * Inicializa el sistema de animaciones
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupRippleEffects();
        this.isInitialized = true;
    }

    /**
     * Configura el Intersection Observer para animaciones de scroll
     */
    setupIntersectionObserver() {
        if (!Utils.getBrowserSupport().intersectionObserver) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar secciones
        document.querySelectorAll('.distro-section').forEach(section => {
            observer.observe(section);
        });

        this.observers.set('scroll', observer);
    }

    /**
     * Activa animaciones al hacer scroll
     * @param {Element} element - Elemento a animar
     */
    triggerScrollAnimation(element) {
        element.classList.add('animate-fade-in');
        
        // Animar tarjetas con delay
        const cards = element.querySelectorAll('.distro-card');
        cards.forEach((card, index) => {
            Utils.addClassWithDelay(card, 'animate-scale-in', index * 100);
        });
    }

    /**
     * Configura animaciones de scroll
     */
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        
        scrollElements.forEach(element => {
            element.classList.add('scroll-reveal');
        });

        // Parallax effect
        this.setupParallaxEffect();
    }

    /**
     * Configura efectos de parallax
     */
    setupParallaxEffect() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('header');
            const sections = document.querySelectorAll('.distro-section');
            
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            sections.forEach((section, index) => {
                const offset = scrolled * 0.05 * (index % 2 === 0 ? 1 : -1);
                section.style.transform = `translateY(${offset}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', Utils.throttle(requestTick, 16));
    }

    /**
     * Configura efectos hover avanzados
     */
    setupHoverEffects() {
        // Efectos para tarjetas cyber
        document.querySelectorAll('.cyber-border').forEach(element => {
            this.addHoverEffect(element, {
                enter: () => {
                    element.style.transform = 'translateY(-5px)';
                    element.classList.add('animate-pulse-glow');
                },
                leave: () => {
                    element.style.transform = 'translateY(0)';
                    element.classList.remove('animate-pulse-glow');
                }
            });
        });

        // Efectos para tarjetas de distribuciones
        document.querySelectorAll('.distro-card').forEach(card => {
            this.addAdvancedHoverEffect(card);
        });
    }

    /**
     * Agrega efecto hover a un elemento
     * @param {Element} element - Elemento objetivo
     * @param {Object} callbacks - Callbacks de enter y leave
     */
    addHoverEffect(element, callbacks) {
        element.addEventListener('mouseenter', callbacks.enter);
        element.addEventListener('mouseleave', callbacks.leave);
        
        // Touch support
        element.addEventListener('touchstart', callbacks.enter);
        element.addEventListener('touchend', callbacks.leave);
    }

    /**
     * Agrega efectos hover avanzados
     * @param {Element} card - Tarjeta a animar
     */
    addAdvancedHoverEffect(card) {
        const handleMouseEnter = (e) => {
            card.style.transform = 'scale(1.05) translateY(-2px)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            
            // Efecto de brillo
            this.createShineEffect(card, e);
        };

        const handleMouseLeave = () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = 'none';
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    }

    /**
     * Crea efecto de brillo en una tarjeta
     * @param {Element} card - Tarjeta objetivo
     * @param {Event} e - Evento del mouse
     */
    createShineEffect(card, e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`;
        
        setTimeout(() => {
            card.style.background = '';
        }, 500);
    }

    /**
     * Configura efectos ripple
     */
    setupRippleEffects() {
        const clickableElements = document.querySelectorAll('.distro-card, .cyber-border');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(element, e);
            });
        });
    }

    /**
     * Crea efecto ripple
     * @param {Element} element - Elemento objetivo
     * @param {Event} e - Evento del click
     */
    createRipple(element, e) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Anima la entrada de elementos
     * @param {NodeList} elements - Elementos a animar
     * @param {string} animationClass - Clase de animación
     * @param {number} stagger - Delay entre elementos
     */
    staggerAnimation(elements, animationClass, stagger = 100) {
        elements.forEach((element, index) => {
            Utils.addClassWithDelay(element, animationClass, index * stagger);
        });
    }

    /**
     * Crea animación de texto typewriter
     * @param {Element} element - Elemento de texto
     * @param {string} text - Texto a escribir
     * @param {number} speed - Velocidad de escritura
     */
    typewriterEffect(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    /**
     * Limpia animaciones y observadores
     */
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animationQueue = [];
        this.isInitialized = false;
    }
}

// Crear instancia global
window.AnimationManager = new AnimationManager();