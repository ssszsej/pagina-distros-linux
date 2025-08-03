/* ==========================================
   FUNCIONES DE UTILIDAD
   ========================================== */

/**
 * Debounce function para optimizar eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
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

/**
 * Throttle function para limitar ejecuciones
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en ms
 * @returns {Function} Función throttled
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Genera un número aleatorio entre min y max
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica si un elemento está en el viewport
 * @param {Element} element - Elemento a verificar
 * @returns {boolean} True si está visible
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Agrega una clase con animación
 * @param {Element} element - Elemento objetivo
 * @param {string} className - Clase a agregar
 * @param {number} delay - Retraso en ms
 */
function addClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/**
 * Remueve una clase después de un tiempo
 * @param {Element} element - Elemento objetivo
 * @param {string} className - Clase a remover
 * @param {number} delay - Retraso en ms
 */
function removeClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.remove(className);
    }, delay);
}

/**
 * Crea un elemento con atributos
 * @param {string} tag - Tag del elemento
 * @param {Object} attributes - Atributos del elemento
 * @param {string} content - Contenido del elemento
 * @returns {Element} Elemento creado
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

/**
 * Obtiene información del dispositivo
 * @returns {Object} Información del dispositivo
 */
function getDeviceInfo() {
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)|Silk/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1
    };
}

/**
 * Detecta soporte para características del navegador
 * @returns {Object} Características soportadas
 */
function getBrowserSupport() {
    return {
        intersectionObserver: 'IntersectionObserver' in window,
        requestAnimationFrame: 'requestAnimationFrame' in window,
        localStorage: 'localStorage' in window,
        webGL: !!window.WebGLRenderingContext,
        css3d: 'perspective' in document.documentElement.style,
        touch: 'ontouchstart' in window
    };
}

/**
 * Maneja errores de manera consistente
 * @param {Error} error - Error a manejar
 * @param {string} context - Contexto del error
 */
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    
    // En producción, podrías enviar esto a un servicio de logging
    if (process && process.env && process.env.NODE_ENV === 'production') {
        // Enviar error a servicio de logging
    }
}

/**
 * Valida que el DOM esté cargado
 * @param {Function} callback - Función a ejecutar
 */
function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Exporta funciones para uso global
 */
window.Utils = {
    debounce,
    throttle,
    random,
    isElementInViewport,
    addClassWithDelay,
    removeClassWithDelay,
    createElement,
    getDeviceInfo,
    getBrowserSupport,
    handleError,
    onDOMReady
};