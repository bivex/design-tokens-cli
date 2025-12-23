/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Color format conversion utilities for design tokens
 */

/**
 * Parse a color string and return its components
 * @param {string} colorString - The color string to parse
 * @returns {Object|null} - Parsed color object or null if invalid
 */
const parseColor = (colorString) => {
  if (!colorString || typeof colorString !== 'string') return null;

  const trimmed = colorString.trim().toLowerCase();

  // Hex formats: #rgb, #rrggbb, #rrggbbaa
  const hexMatch = trimmed.match(/^#([a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r, g, b, a = 1;

    if (hex.length === 3) {
      // #rgb -> #rrggbb
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      // #rrggbb
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
      // #rrggbbaa
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 1000) / 1000; // Round to 3 decimal places
    }

    return { type: 'rgb', r, g, b, a };
  }

  // RGB/RGBA formats
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
      return { type: 'rgb', r, g, b, a };
    }
  }

  // HSL/HSLA formats
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+)\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%(?:\s*,\s*([0-9.]+))?\s*\)$/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;

    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1) {
      return { type: 'hsl', h, s, l, a };
    }
  }

  return null; // Invalid or unsupported format
};

/**
 * Check if a value is a valid color
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a valid color
 */
const isColor = (value) => {
  return parseColor(value) !== null;
};

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} - RGB values {r, g, b}
 */
const hslToRgb = (h, s, l) => {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} - HSL values {h, s, l}
 */
const rgbToHsl = (r, g, b) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Convert a parsed color to hex format
 * @param {Object} color - Parsed color object
 * @returns {string} - Hex color string
 */
const toHex = (color) => {
  if (color.type === 'hex') return color.original;

  let { r, g, b, a = 1 } = color;
  if (color.type === 'hsl') {
    ({ r, g, b } = hslToRgb(color.h, color.s, color.l));
    a = color.a;
  }

  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  if (a < 1) {
    // Include alpha channel
    const alpha = Math.round(a * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${alpha.toString(16).padStart(2, '0')}`;
  } else {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

/**
 * Convert a parsed color to RGB/RGBA format
 * @param {Object} color - Parsed color object
 * @returns {string} - RGB/RGBA color string
 */
const toRgb = (color) => {
  if (color.type === 'rgb') {
    const { r, g, b, a = 1 } = color;
    if (a < 1) {
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    } else {
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
  }

  if (color.type === 'hsl') {
    const { r, g, b } = hslToRgb(color.h, color.s, color.l);
    const a = color.a;
    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  if (color.type === 'hex') {
    return toRgb(parseColor(color.original));
  }

  return color.original;
};

/**
 * Convert a parsed color to HSL/HSLA format
 * @param {Object} color - Parsed color object
 * @returns {string} - HSL/HSLA color string
 */
const toHsl = (color) => {
  if (color.type === 'hsl') {
    const { h, s, l, a = 1 } = color;
    if (a < 1) {
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    } else {
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }

  if (color.type === 'rgb') {
    const { h, s, l } = rgbToHsl(color.r, color.g, color.b);
    const a = color.a;
    if (a < 1) {
      return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    } else {
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }

  if (color.type === 'hex') {
    return toHsl(parseColor(color.original));
  }

  return color.original;
};

/**
 * Convert a color string to the specified format
 * @param {string} colorString - The color string to convert
 * @param {string} targetFormat - Target format ('hex', 'rgb', 'hsl', 'auto')
 * @returns {string} - Converted color string or original if conversion fails
 */
const convertColor = (colorString, targetFormat) => {
  if (!colorString || typeof colorString !== 'string') return colorString;
  if (targetFormat === 'auto') return colorString;

  const parsed = parseColor(colorString);
  if (!parsed) return colorString; // Not a valid color, return as-is

  switch (targetFormat) {
    case 'hex':
      return toHex(parsed);
    case 'rgb':
      return toRgb(parsed);
    case 'hsl':
      return toHsl(parsed);
    default:
      return colorString;
  }
};

/**
 * Check if a token key represents a color token
 * @param {string} key - Token key
 * @param {*} value - Token value
 * @returns {boolean} - True if the token is likely a color
 */
const isColorToken = (key, value) => {
  if (typeof value !== 'string') return false;

  // Check if key contains color-related words
  const colorKeywords = ['color', 'colour', 'bg', 'background', 'fg', 'foreground', 'text', 'border', 'fill', 'stroke'];
  const keyLower = key.toLowerCase();
  const hasColorKeyword = colorKeywords.some(keyword => keyLower.includes(keyword));

  // Check if value is a valid color
  const isValidColor = isColor(value);

  return hasColorKeyword && isValidColor;
};

export {
  parseColor,
  isColor,
  convertColor,
  isColorToken,
  toHex,
  toRgb,
  toHsl
};
