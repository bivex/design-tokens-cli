/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:18:28
 * Last Updated: 2025-12-23T03:22:17
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert design tokens to Tailwind CSS v3 configuration format
 * @param {Object} tokensObject - Flattened token key/value pairs
 * @param {Object} config - CLI configuration
 * @returns {String} - Tailwind config JavaScript code
 */
const toTailwindConfig = (tokensObject, config) => {
  const theme = {};

  // Process each token and map to appropriate Tailwind theme section
  Object.entries(tokensObject).forEach(([key, value]) => {
    // Apply color format conversion if specified
    if (config.outputColorFormat && config.outputColorFormat !== 'auto' && isColorToken(key, value)) {
      value = convertColor(value, config.outputColorFormat);
    }

    // Map tokens to Tailwind theme sections based on naming conventions
    const tokenType = categorizeToken(key, value);

    switch (tokenType.category) {
      case 'color':
        mapToColors(theme, tokenType.path, value);
        break;
      case 'spacing':
        mapToSpacing(theme, tokenType.path, value);
        break;
      case 'fontSize':
        mapToFontSize(theme, tokenType.path, value);
        break;
      case 'fontFamily':
        mapToFontFamily(theme, tokenType.path, value);
        break;
      case 'fontWeight':
        mapToFontWeight(theme, tokenType.path, value);
        break;
      case 'borderRadius':
        mapToBorderRadius(theme, tokenType.path, value);
        break;
      case 'borderWidth':
        mapToBorderWidth(theme, tokenType.path, value);
        break;
      case 'boxShadow':
        mapToBoxShadow(theme, tokenType.path, value);
        break;
      case 'zIndex':
        mapToZIndex(theme, tokenType.path, value);
        break;
      case 'lineHeight':
        mapToLineHeight(theme, tokenType.path, value);
        break;
      case 'letterSpacing':
        mapToLetterSpacing(theme, tokenType.path, value);
        break;
    }
  });

  // Generate the Tailwind config JavaScript code
  return generateTailwindConfig(theme);
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

  // Letter spacing tokens (check before spacing to avoid "letter-spacing-*" being categorized as spacing)
  if (keyLower.includes('letter') && keyLower.includes('spacing')) {
    return { category: 'letterSpacing', path: extractLetterSpacingPath(key) };
  }

  // Line height tokens
  if (keyLower.includes('line') && keyLower.includes('height')) {
    return { category: 'lineHeight', path: extractLineHeightPath(key) };
  }

  // Default fallback
  return { category: 'color', path: key };
};

/**
 * Extract color path from token key
 * @param {string} key - Token key
 * @returns {string} - Color path
 */
const extractColorPath = (key) => {
  // Remove common prefixes and convert to camelCase
  let path = key
    .replace(/^(color|colors?|bg|background|fg|foreground|text|fill|stroke|border)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract spacing path from token key
 * @param {string} key - Token key
 * @returns {string} - Spacing path
 */
const extractSpacingPath = (key) => {
  let path = key
    .replace(/^(spacing|space)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract font size path from token key
 * @param {string} key - Token key
 * @returns {string} - Font size path
 */
const extractFontSizePath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/size/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract font family path from token key
 * @param {string} key - Token key
 * @returns {string} - Font family path
 */
const extractFontFamilyPath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/family/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract font weight path from token key
 * @param {string} key - Token key
 * @returns {string} - Font weight path
 */
const extractFontWeightPath = (key) => {
  let path = key
    .replace(/^(font|typography)/, '')
    .replace(/weight/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract border radius path from token key
 * @param {string} key - Token key
 * @returns {string} - Border radius path
 */
const extractBorderRadiusPath = (key) => {
  let path = key
    .replace(/^border/, '')
    .replace(/radius/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract border width path from token key
 * @param {string} key - Token key
 * @returns {string} - Border width path
 */
const extractBorderWidthPath = (key) => {
  let path = key
    .replace(/^border/, '')
    .replace(/width/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract box shadow path from token key
 * @param {string} key - Token key
 * @returns {string} - Box shadow path
 */
const extractBoxShadowPath = (key) => {
  let path = key
    .replace(/^(shadow|box.shadow)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract z-index path from token key
 * @param {string} key - Token key
 * @returns {string} - Z-index path
 */
const extractZIndexPath = (key) => {
  let path = key
    .replace(/^(z.index|zindex)/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract line height path from token key
 * @param {string} key - Token key
 * @returns {string} - Line height path
 */
const extractLineHeightPath = (key) => {
  let path = key
    .replace(/^(line)/, '')
    .replace(/height/, '')
    .replace(/^[-_]+/, '')
    .replace(/^[-_]+$/, '');

  if (!path) path = key;

  return path;
};

/**
 * Extract letter spacing path from token key
 * @param {string} key - Token key
 * @returns {string} - Letter spacing path
 */
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
 * Map token to colors section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToColors = (theme, path, value) => {
  if (!theme.colors) theme.colors = {};

  // Handle nested color paths (e.g., primary.500 -> colors.primary['500'])
  const parts = path.split(/[.-]/);
  let current = theme.colors;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  if (typeof current === 'object' && current !== null) {
    current[lastPart] = value;
  }
};

/**
 * Map token to spacing section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToSpacing = (theme, path, value) => {
  if (!theme.spacing) theme.spacing = {};
  theme.spacing[path] = value;
};

/**
 * Map token to fontSize section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToFontSize = (theme, path, value) => {
  if (!theme.fontSize) theme.fontSize = {};
  theme.fontSize[path] = value;
};

/**
 * Map token to fontFamily section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToFontFamily = (theme, path, value) => {
  if (!theme.fontFamily) theme.fontFamily = {};
  theme.fontFamily[path] = value;
};

/**
 * Map token to fontWeight section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToFontWeight = (theme, path, value) => {
  if (!theme.fontWeight) theme.fontWeight = {};
  theme.fontWeight[path] = value;
};

/**
 * Map token to borderRadius section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToBorderRadius = (theme, path, value) => {
  if (!theme.borderRadius) theme.borderRadius = {};
  theme.borderRadius[path] = value;
};

/**
 * Map token to borderWidth section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToBorderWidth = (theme, path, value) => {
  if (!theme.borderWidth) theme.borderWidth = {};
  theme.borderWidth[path] = value;
};

/**
 * Map token to boxShadow section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToBoxShadow = (theme, path, value) => {
  if (!theme.boxShadow) theme.boxShadow = {};
  theme.boxShadow[path] = value;
};

/**
 * Map token to zIndex section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToZIndex = (theme, path, value) => {
  if (!theme.zIndex) theme.zIndex = {};
  theme.zIndex[path] = value;
};

/**
 * Map token to lineHeight section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToLineHeight = (theme, path, value) => {
  if (!theme.lineHeight) theme.lineHeight = {};
  theme.lineHeight[path] = value;
};

/**
 * Map token to letterSpacing section
 * @param {Object} theme - Theme object
 * @param {string} path - Token path
 * @param {*} value - Token value
 */
const mapToLetterSpacing = (theme, path, value) => {
  if (!theme.letterSpacing) theme.letterSpacing = {};
  theme.letterSpacing[path] = value;
};

/**
 * Generate Tailwind config JavaScript code
 * @param {Object} theme - Theme object
 * @returns {string} - JavaScript code
 */
const generateTailwindConfig = (theme) => {
  let config = `/** @type {import('tailwindcss').Config} */\n`;
  config += `export default {\n`;
  config += `  theme: {\n`;
  config += `    extend: {\n`;

  // Add theme sections
  const sections = Object.keys(theme);
  sections.forEach((section, index) => {
    config += `      ${section}: ${JSON.stringify(theme[section], null, 8).replace(/\n/g, '\n      ')}`;
    if (index < sections.length - 1) {
      config += ',';
    }
    config += '\n';
  });

  config += `    }\n`;
  config += `  }\n`;
  config += `}\n`;

  return config;
};

export { toTailwindConfig };
