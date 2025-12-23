# How to Apply Design Tokens to Bootstrap 5

This guide explains how to integrate a custom design token system with Bootstrap 5 components, creating a cohesive branded experience while maintaining Bootstrap's functionality.

## 🎯 Overview

Design tokens provide a systematic approach to design consistency. When applied to Bootstrap 5, they transform generic components into branded, accessible, and cohesive UI elements that reflect your design system's unique identity.

## 📁 Project Structure

```
your-project/
├── brand-output/
│   └── css/
│       └── brand-system.tokens.css  # Generated design tokens
├── bs5/
│   ├── node_modules/
│   │   └── bootstrap/               # Bootstrap 5 installation
│   ├── index.html                   # Your customized Bootstrap demo
│   └── docs/
│       └── how_to_apply_to_bs5_designtokens.md
```

## 🚀 Quick Start

### 1. Include Design Tokens CSS

Add these links to your HTML `<head>` section:

```html
<!-- Google Fonts (if using custom fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">

<!-- Design Tokens CSS (load first) -->
<link href="../brand-output/css/brand-system.tokens.css" rel="stylesheet">

<!-- Bootstrap CSS (load second) -->
<link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
```

### 2. Override Bootstrap Variables

Add CSS custom properties to override Bootstrap's default values:

```css
:root {
  /* Primary Colors */
  --bs-primary: var(--base-primary-600, #bb8f57);
  --bs-primary-rgb: 187, 143, 87;

  /* Secondary Colors */
  --bs-secondary: var(--base-secondary-500, #dbd3c1);
  --bs-secondary-rgb: 219, 211, 193;

  /* Semantic Colors */
  --bs-success: var(--semantic-success-success, #15674d);
  --bs-success-rgb: 21, 103, 77;
  --bs-warning: var(--semantic-warning-warning, #b27516);
  --bs-warning-rgb: 178, 117, 22;
  --bs-danger: var(--semantic-error-error, #dc2626);
  --bs-danger-rgb: 220, 38, 38;

  /* Neutral Colors */
  --bs-light: var(--base-secondary-100, #fdfcf9);
  --bs-light-rgb: 253, 252, 249;
  --bs-dark: var(--base-base, #181018);
  --bs-dark-rgb: 24, 16, 24;

  /* Custom Accent */
  --bs-accent: var(--base-accent-500, #9b4d88);
  --bs-accent-rgb: 155, 77, 136;
}
```

### 3. Apply Typography System

```css
/* Base Typography */
body {
  font-family: var(--typography-font-family-body, 'Source Sans Pro', sans-serif);
  line-height: var(--typography-line-height-normal, 1.5);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--typography-font-family-heading, 'Crimson Text', serif);
  font-weight: var(--typography-font-weight-medium, 500);
  line-height: var(--typography-line-height-tight, 1.25);
}

/* Display Classes */
.display-4 {
  font-size: var(--typography-size-5xl, 3rem);
  font-weight: var(--typography-font-weight-bold, 700);
}
```

## 🎨 Component-Specific Customizations

### Buttons

```css
.btn-primary {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  font-family: var(--typography-font-family-body);
  font-weight: var(--typography-font-weight-medium);
  border-radius: var(--radius-lg, 0.5rem);
  transition: all var(--a11y-interaction-transition-duration) var(--a11y-interaction-transition-timing);
}

.btn-primary:hover {
  background-color: var(--base-primary-700, #a0713a);
  border-color: var(--base-primary-700, #a0713a);
  transform: scale(var(--a11y-interaction-active-scale, 0.98));
}
```

### Cards

```css
.card {
  border-radius: var(--radius-xl, 0.75rem);
  border: 1px solid var(--base-secondary-300, #f4f1ea);
  box-shadow: var(--sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
  font-family: var(--typography-font-family-body);
}

.card-header {
  background-color: var(--base-secondary-50, #fefefc);
  border-bottom: 1px solid var(--base-secondary-200, #faf8f3);
  border-radius: var(--radius-xl, 0.75rem) var(--radius-xl, 0.75rem) 0 0 !important;
  font-weight: var(--typography-font-weight-semibold, 600);
}
```

### Navigation

```css
.navbar {
  background: linear-gradient(135deg, var(--base-primary-600, #bb8f57) 0%, var(--base-primary-800, #875724) 100%);
  border-bottom: 2px solid var(--base-accent-600, #7f2a6b);
  box-shadow: var(--md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
}

.navbar-brand {
  font-family: var(--typography-font-family-accent, 'Playfair Display', serif);
  font-weight: var(--typography-font-weight-bold, 700);
  color: var(--base-secondary-50, #fefefc) !important;
}
```

### Forms

```css
.form-control, .form-select {
  border: 2px solid var(--base-secondary-300, #f4f1ea);
  border-radius: var(--radius-lg, 0.5rem);
  font-family: var(--typography-font-family-body);
  transition: border-color var(--a11y-interaction-transition-duration) var(--a11y-interaction-transition-timing),
              box-shadow var(--a11y-interaction-transition-duration) var(--a11y-interaction-transition-timing);
}

.form-control:focus, .form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 var(--a11y-spacing-focus-outline-offset, 0.125rem) rgba(var(--bs-primary-rgb), 0.25);
}
```

### Progress Bars

```css
.progress {
  background-color: var(--base-secondary-200, #faf8f3);
  border-radius: var(--radius-full, 9999px);
  height: var(--spacing-4, 1rem);
}

.progress-bar {
  background: linear-gradient(135deg, var(--bs-primary) 0%, var(--base-primary-700, #a0713a) 100%);
  border-radius: var(--radius-full, 9999px);
}
```

## 🔧 Design Token Categories

### Colors
- **Base Colors**: Primary, secondary, accent color palettes
- **Semantic Colors**: Success, warning, error, info states
- **Neutral Colors**: Light, dark, and gray variations

### Typography
- **Font Families**: Heading, body, mono, and accent fonts
- **Font Weights**: Thin to black weight scale
- **Font Sizes**: XS to 6XL responsive scale
- **Line Heights**: Tight, normal, relaxed spacing

### Spacing
- **Scale**: 0.25rem to 24rem spacing system
- **Accessibility**: WCAG AA compliant touch targets (2.75rem minimum)

### Borders & Radii
- **Radius Scale**: None to 3XL border radius options
- **Border Widths**: 0px to 8px thickness scale

### Shadows
- **Elevation Scale**: SM to 2XL shadow depths
- **Special Shadows**: Inner, none for specific use cases

### Interactions
- **Transitions**: Duration and timing functions
- **Hover States**: Opacity and scale transforms
- **Focus States**: Outline width and color

## 📋 Implementation Checklist

- [ ] Include Google Fonts for custom typography
- [ ] Load design tokens CSS before Bootstrap CSS
- [ ] Override Bootstrap CSS custom properties in `:root`
- [ ] Apply typography system to body and headings
- [ ] Customize component-specific styles
- [ ] Test responsive behavior across breakpoints
- [ ] Verify accessibility compliance
- [ ] Test color contrast ratios
- [ ] Validate touch target sizes on mobile

## 🎯 Best Practices

### 1. **Layering Strategy**
- Load design tokens first
- Override Bootstrap variables second
- Apply component-specific customizations last

### 2. **CSS Custom Properties**
- Use `var()` function for all design token references
- Provide fallbacks for robustness
- Document token usage in comments

### 3. **Component Consistency**
- Apply design tokens systematically across all components
- Maintain consistent spacing and typography
- Use semantic color tokens for states

### 4. **Responsive Design**
- Ensure design tokens work across all breakpoints
- Test touch targets on mobile devices
- Verify readability at all screen sizes

### 5. **Accessibility**
- Maintain WCAG AA compliance
- Test keyboard navigation
- Ensure sufficient color contrast
- Provide descriptive focus indicators

## 🛠️ Maintenance

### Updating Design Tokens
1. Modify token files in `brand-tokens/` directory
2. Regenerate CSS using the design tokens CLI
3. Test updated styles across all components

### Adding New Components
1. Identify design token requirements
2. Apply consistent styling patterns
3. Test component in various states
4. Document component-specific customizations

### Version Control
- Track design token changes
- Version CSS output files
- Document breaking changes
- Maintain backward compatibility

## 📚 Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens Format](https://design-tokens.github.io/community-group/)
- [WCAG Accessibility Guidelines](https://www.w3.org/TR/WCAG21/)

## 🔍 Troubleshooting

### Common Issues

**Design tokens not loading:**
- Verify CSS file path is correct
- Check that CSS file was generated properly
- Ensure proper loading order

**Styles not applying:**
- Check CSS specificity conflicts
- Verify token variable names
- Use browser dev tools to inspect computed styles

**Responsive issues:**
- Test breakpoints individually
- Verify spacing tokens work on mobile
- Check font sizes at different screen sizes

**Accessibility problems:**
- Test with screen readers
- Verify color contrast ratios
- Check keyboard navigation flow

---

*This guide demonstrates how to create a cohesive, branded Bootstrap 5 experience using design tokens while maintaining accessibility, performance, and maintainability.*
