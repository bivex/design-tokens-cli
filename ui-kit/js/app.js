// Design Tokens UI Kit - Interactive Demo

document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
    initializeNavigation();
});

/**
 * Initialize the interactive demo controls
 */
function initializeDemo() {
    const primaryColorInput = document.getElementById('primary-color');
    const borderRadiusInput = document.getElementById('border-radius');
    const fontSizeInput = document.getElementById('font-size');
    const radiusValue = document.getElementById('radius-value');
    const fontValue = document.getElementById('font-value');
    const demoCard = document.querySelector('.demo-card');
    const demoBtn = document.querySelector('.demo-btn');

    // Set initial values
    updateRadiusValue(borderRadiusInput.value);
    updateFontValue(fontSizeInput.value);

    // Primary color change
    primaryColorInput.addEventListener('input', function(e) {
        const color = e.target.value;
        document.documentElement.style.setProperty('--color-primary', color);

        // Update button background
        demoBtn.style.backgroundColor = color;
        demoBtn.style.borderColor = color;
    });

    // Border radius change
    borderRadiusInput.addEventListener('input', function(e) {
        const radius = e.target.value + 'px';
        document.documentElement.style.setProperty('--border-radius-md', radius);
        updateRadiusValue(e.target.value);
    });

    // Font size change
    fontSizeInput.addEventListener('input', function(e) {
        const fontSize = e.target.value + 'px';
        document.documentElement.style.setProperty('--font-size-base', fontSize);
        updateFontValue(e.target.value);
    });

    function updateRadiusValue(value) {
        radiusValue.textContent = value + 'px';
    }

    function updateFontValue(value) {
        fontValue.textContent = value + 'px';
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });
}

/**
 * Utility functions for design token manipulation
 */
const DesignTokens = {
    /**
     * Update a CSS custom property
     * @param {string} property - CSS custom property name (without --)
     * @param {string} value - New value
     */
    setToken: function(property, value) {
        document.documentElement.style.setProperty(`--${property}`, value);
    },

    /**
     * Get a CSS custom property value
     * @param {string} property - CSS custom property name (without --)
     * @returns {string} Current value
     */
    getToken: function(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(`--${property}`).trim();
    },

    /**
     * Generate a random color
     * @returns {string} Hex color code
     */
    randomColor: function() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    /**
     * Apply a theme preset
     * @param {string} theme - Theme name ('light', 'dark', 'colorful')
     */
    applyTheme: function(theme) {
        const themes = {
            light: {
                'color-primary': '#007bff',
                'color-secondary': '#6c757d',
                'color-background': '#ffffff',
                'color-text': '#212529'
            },
            dark: {
                'color-primary': '#4dabf7',
                'color-secondary': '#868e96',
                'color-background': '#212529',
                'color-text': '#ffffff'
            },
            colorful: {
                'color-primary': '#ff6b35',
                'color-secondary': '#f7931e',
                'color-success': '#28a745',
                'color-danger': '#dc3545'
            }
        };

        if (themes[theme]) {
            Object.entries(themes[theme]).forEach(([property, value]) => {
                this.setToken(property, value);
            });
        }
    }
};

// Make DesignTokens available globally for console experimentation
window.DesignTokens = DesignTokens;

// Add keyboard shortcuts for demo
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + R = Random primary color
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        const randomColor = DesignTokens.randomColor();
        document.getElementById('primary-color').value = randomColor;
        DesignTokens.setToken('color-primary', randomColor);
        document.querySelector('.demo-btn').style.backgroundColor = randomColor;
    }

    // Ctrl/Cmd + Shift + T = Cycle themes
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        const themes = ['light', 'dark', 'colorful'];
        const currentTheme = document.body.dataset.theme || 'light';
        const nextThemeIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        const nextTheme = themes[nextThemeIndex];

        DesignTokens.applyTheme(nextTheme);
        document.body.dataset.theme = nextTheme;

        // Show notification
        showNotification(`Applied ${nextTheme} theme`);
    }
});

/**
 * Show a temporary notification
 * @param {string} message - Notification message
 */
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--border-radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 'var(--z-tooltip)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification styles to head
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    font-family: var(--font-family-base);
}
`;
document.head.appendChild(notificationStyles);

// Console welcome message
console.log(`
🎨 Design Tokens UI Kit Demo
============================

Welcome to the interactive demo!

Try these commands in the console:

// Change primary color
DesignTokens.setToken('color-primary', '#ff6b35');

// Apply a theme
DesignTokens.applyTheme('dark');

// Generate random color
DesignTokens.randomColor();

// Keyboard shortcuts:
// Ctrl/Cmd + Shift + R: Random primary color
// Ctrl/Cmd + Shift + T: Cycle themes

Happy experimenting! 🚀
`);
