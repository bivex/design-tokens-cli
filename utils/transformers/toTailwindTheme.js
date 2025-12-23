/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:18:28
 * Last Updated: 2025-12-23T03:21:15
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert design tokens to Tailwind CSS v4 @theme directive format
 * @param {Object} tokensObject - Flattened token key/value pairs
 * @param {Object} config - CLI configuration
 * @returns {String} - CSS with @theme directive
 */
const toTailwindTheme = (tokensObject, config) => {
  const themeVars = [];

  // Process each token and map to appropriate Tailwind v4 CSS custom property
  Object.entries(tokensObject).forEach(([key, value]) => {
    // Apply color format conversion if specified
    if (config.outputColorFormat && config.outputColorFormat !== 'auto' && isColorToken(key, value)) {
      value = convertColor(value, config.outputColorFormat);
    }

    // Map tokens to Tailwind v4 CSS custom properties based on naming conventions
    const tokenType = categorizeToken(key, value);
    const cssVar = mapToTailwindCSSVar(tokenType.category, tokenType.path, value);

    if (cssVar) {
      themeVars.push(cssVar);
    }
  });

  // Generate the CSS with @theme directive
  return generateTailwindThemeCSS(themeVars);
};

/**
 * Categorize a token based on its key and value to determine Tailwind theme section
 * @param {string} key - Token key
 * @param {*} value - Token value
 * @returns {Object} - Category and path information
 */
const categorizeToken = (key, value) => {
  const keyLower = key.toLowerCase();

  // Color tokens
  if (isColorToken(key, value) ||
      keyLower.includes('color') ||
      keyLower.includes('bg') ||
      keyLower.includes('background') ||
      keyLower.includes('fg') ||
      keyLower.includes('foreground') ||
      keyLower.includes('text') ||
      keyLower.includes('fill') ||
      keyLower.includes('stroke') ||
      keyLower.includes('border') && keyLower.includes('color')) {
    return { category: 'color', path: extractColorPath(key) };
  }

  // Spacing tokens
  if (keyLower.includes('spacing') ||
      keyLower.includes('space') ||
      keyLower.includes('margin') ||
      keyLower.includes('padding') ||
      keyLower.includes('gap') ||
      keyLower.includes('inset')) {
    return { category: 'spacing', path: extractSpacingPath(key) };
  }

  // Font size tokens
  if (keyLower.includes('font') && keyLower.includes('size')) {
    return { category: 'fontSize', path: extractFontSizePath(key) };
  }

  // Font family tokens
  if (keyLower.includes('font') && keyLower.includes('family')) {
    return { category: 'fontFamily', path: extractFontFamilyPath(key) };
  }

  // Font weight tokens
  if (keyLower.includes('font') && keyLower.includes('weight')) {
    return { category: 'fontWeight', path: extractFontWeightPath(key) };
  }

  // Border radius tokens
  if (keyLower.includes('border') && keyLower.includes('radius')) {
    return { category: 'borderRadius', path: extractBorderRadiusPath(key) };
  }

  // Border width tokens
  if (keyLower.includes('border') && keyLower.includes('width')) {
    return { category: 'borderWidth', path: extractBorderWidthPath(key) };
  }

  // Box shadow tokens
  if (keyLower.includes('shadow') || keyLower.includes('box-shadow')) {
    return { category: 'boxShadow', path: extractBoxShadowPath(key) };
  }

  // Z-index tokens
  if (keyLower.includes('z-index') || keyLower.includes('zindex')) {
    return { category: 'zIndex', path: extractZIndexPath(key) };
  }

  // Line height tokens
  if (keyLower.includes('line') && keyLower.includes('height')) {
    return { category: 'lineHeight', path: extractLineHeightPath(key) };
  }

  // Letter spacing tokens (check before spacing to avoid "letter-spacing-*" being categorized as spacing)
  if (keyLower.includes('letter') && keyLower.includes('spacing')) {
    return { category: 'letterSpacing', path: extractLetterSpacingPath(key) };
  }

  // Line height tokens
  if (keyLower.includes('line') && keyLower.includes('height')) {
    return { category: 'lineHeight', path: extractLineHeightPath(key) };
  }

  // Default fallback to color
  return { category: 'color', path: key };
};

/**
 * Extract color path from token key (same as v3)
 * @param {string} key - Token key
 * @returns {string} - Color path
 */
const extractColorPath = (key) => {
  let path = key
    .replace(/^(color|colors?|bg|background|fg|foreground|text|fill|stroke|border)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractSpacingPath = (key) => {
  let path = key
    .replace(/^(spacing|space)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractFontSizePath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/size/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractFontFamilyPath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/family/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractFontWeightPath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/weight/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractBorderRadiusPath = (key) => {
  let path = key
    .replace(/^border/, '')
    .replace(/radius/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractBorderWidthPath = (key) => {
  let path = key
    .replace(/^border/, '')
    .replace(/width/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractBoxShadowPath = (key) => {
  let path = key
    .replace(/^(shadow|box.shadow)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractZIndexPath = (key) => {
  let path = key
    .replace(/^(z.index|zindex)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractLineHeightPath = (key) => {
  let path = key
    .replace(/^(line)/, '')
    .replace(/height/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

const extractLetterSpacingPath = (key) => {
  let path = key
    .replace(/^(letter)/, '')
    .replace(/spacing/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Map token to Tailwind v4 CSS custom property
 * @param {string} category - Token category
 * @param {string} path - Token path
 * @param {*} value - Token value
 * @returns {string|null} - CSS custom property declaration or null
 */
const mapToTailwindCSSVar = (category, path, value) => {
  const kebabPath = path.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  switch (category) {
    case 'color':
      return `  --color-${kebabPath}: ${value};`;
    case 'spacing':
      return `  --spacing-${kebabPath}: ${value};`;
    case 'fontSize':
      return `  --font-size-${kebabPath}: ${value};`;
    case 'fontFamily':
      return `  --font-family-${kebabPath}: ${value};`;
    case 'fontWeight':
      return `  --font-weight-${kebabPath}: ${value};`;
    case 'borderRadius':
      return `  --border-radius-${kebabPath}: ${value};`;
    case 'borderWidth':
      return `  --border-width-${kebabPath}: ${value};`;
    case 'boxShadow':
      return `  --box-shadow-${kebabPath}: ${value};`;
    case 'zIndex':
      return `  --z-index-${kebabPath}: ${value};`;
    case 'lineHeight':
      return `  --line-height-${kebabPath}: ${value};`;
    case 'letterSpacing':
      return `  --letter-spacing-${kebabPath}: ${value};`;
    default:
      return null;
  }
};

/**
 * Generate Tailwind v4 CSS with @theme directive
 * @param {Array<string>} themeVars - Array of CSS custom property declarations
 * @returns {string} - CSS code
 */
const generateTailwindThemeCSS = (themeVars) => {
  if (themeVars.length === 0) {
    return `@theme {\n}\n`;
  }

  let css = `@theme {\n`;
  css += themeVars.join('\n');
  css += '\n}\n';

  return css;
};

export { toTailwindTheme };
