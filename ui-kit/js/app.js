/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T04:42:14
 * Last Updated: 2025-12-23T04:42:48
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

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

    // Set initial values - use luxury champagne gold
    primaryColorInput.value = '#d3ac74';
    updateRadiusValue(borderRadiusInput.value);
    updateFontValue(fontSizeInput.value);

    // Primary color change
    primaryColorInput.addEventListener('input', function(e) {
        const color = e.target.value;
        // Update the generated token directly
        document.documentElement.style.setProperty('--base-primary-500', color);
        // Update button background
        demoBtn.style.backgroundColor = color;
        demoBtn.style.borderColor = color;
    });

    // Border radius change
    borderRadiusInput.addEventListener('input', function(e) {
        const radius = e.target.value + 'px';
        // Update the generated radius token
        document.documentElement.style.setProperty('--radius-md', radius);
        updateRadiusValue(e.target.value);
    });

    // Font size change
    fontSizeInput.addEventListener('input', function(e) {
        const fontSize = e.target.value + 'px';
        // Update the generated size token
        document.documentElement.style.setProperty('--size-base', fontSize);
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
     * Apply a theme preset using luxury generated tokens
     * @param {string} theme - Theme name ('light', 'dark', 'elegant')
     */
    applyTheme: function(theme) {
        const themes = {
            light: {
                'base-primary-500': '#d3ac74',     // Champagne gold
                'base-secondary-500': '#dbd3c1',   // Warm ivory
                'base-secondary-50': '#fefefc',   // Pure ivory
                'base-secondary-900': '#5b4d30'   // Deep charcoal
            },
            dark: {
                'base-primary-500': '#bb8f57',     // Rich gold
                'base-secondary-500': '#bcb19b',   // Warm taupe
                'base-secondary-50': '#352b18',    // Deep espresso
                'base-secondary-900': '#fefefc'    // Ivory accent
            },
            elegant: {
                'base-primary-500': '#9b4d88',     // Deep plum
                'base-secondary-500': '#9b8f74',   // Antique gold
                'semantic-success-success': '#15674d', // Forest green
                'base-accent-500': '#7f2a6b'      // Burgundy
            }
        };

        if (themes[theme]) {
            Object.entries(themes[theme]).forEach(([property, value]) => {
                this.setToken(property, value);
            });
        }
    },

    /**
     * Get all available design tokens
     * @returns {Object} Object with all token categories
     */
    getAllTokens: function() {
        return {
            colors: {
                primary: this.getToken('base-primary-500'),
                secondary: this.getToken('base-secondary-500'),
                success: this.getToken('semantic-success-success'),
                danger: this.getToken('base-accent-500'),
                warning: this.getToken('semantic-warning-warning'),
                info: this.getToken('base-primary-400')
            },
            spacing: {
                xs: this.getToken('space-1'),
                sm: this.getToken('space-2'),
                md: this.getToken('space-4'),
                lg: this.getToken('space-6'),
                xl: this.getToken('space-8')
            },
            typography: {
                family: {
                    base: this.getToken('font-family-body'),
                    heading: this.getToken('font-family-heading')
                },
                size: {
                    base: this.getToken('size-base'),
                    lg: this.getToken('size-lg'),
                    xl: this.getToken('size-xl')
                },
                weight: {
                    normal: this.getToken('font-weight-regular'),
                    medium: this.getToken('font-weight-medium'),
                    bold: this.getToken('font-weight-bold')
                }
            },
            borders: {
                radius: {
                    sm: this.getToken('radius-sm'),
                    md: this.getToken('radius-md'),
                    lg: this.getToken('radius-lg')
                }
            },
            shadows: {
                sm: this.getToken('sm'),
                md: this.getToken('md'),
                lg: this.getToken('lg')
            }
        };
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
        DesignTokens.setToken('base-primary-500', randomColor);
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

        // Update demo button color after theme change
        const newPrimaryColor = DesignTokens.getToken('base-primary-500');
        document.querySelector('.demo-btn').style.backgroundColor = newPrimaryColor;
        document.querySelector('.demo-btn').style.borderColor = newPrimaryColor;

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
🎨 LuxeDesign UI Kit Demo (Italian Vogue Luxury)
================================================

Premium typography with Crimson Text, Playfair Display, and Source Sans Pro!
Champagne gold, ivory, and jewel tone palettes inspired by Italian Vogue luxury!

Try these commands in the console:

// Change primary color using luxury token names
DesignTokens.setToken('base-primary-500', '#d3ac74');

// Apply a luxury theme
DesignTokens.applyTheme('elegant');

// View all available luxury tokens
console.table(DesignTokens.getAllTokens());

// Generate random luxury color
DesignTokens.randomColor();

// Keyboard shortcuts:
// Ctrl/Cmd + Shift + R: Random champagne gold
// Ctrl/Cmd + Shift + T: Cycle themes (light/dark/elegant)

Luxury Token System:
🎨 Colors: --base-primary-500 (champagne), --base-secondary-500 (ivory)
✍️  Fonts: --font-family-primary (Crimson Text), --font-family-accent (Playfair)
📏 Spacing: --space-1 to --space-96 (generous luxury spacing)
🎯 Typography: --size-xs to --size-6xl with sophisticated letter spacing

Experience Italian Vogue luxury in your design system! 🇮🇹✨
`);
