/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:18:28
 * Last Updated: 2025-12-23T03:18:28
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { toTailwindTheme } from "../utils/transformers/toTailwindTheme.js";

describe('Tailwind Theme Transformer (v4)', () => {
  test('converts color tokens to Tailwind v4 @theme format', () => {
    const tokens = {
      'color-primary': '#ff6b35',
      'color-secondary': '#007bff',
      'text-color': '#333333'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('@theme {');
    expect(result).toContain('--color-primary: #ff6b35;');
    expect(result).toContain('--color-secondary: #007bff;');
    expect(result).toContain('--color-color: #333333;');
    expect(result).toContain('}');
  });

  test('converts spacing tokens to Tailwind v4 @theme format', () => {
    const tokens = {
      'spacing-sm': '8px',
      'spacing-md': '16px',
      'spacing-lg': '24px'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--spacing-sm: 8px;');
    expect(result).toContain('--spacing-md: 16px;');
    expect(result).toContain('--spacing-lg: 24px;');
  });

  test('converts font size tokens to Tailwind v4 @theme format', () => {
    const tokens = {
      'font-size-sm': '14px',
      'font-size-base': '16px',
      'font-size-lg': '18px'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--font-size-sm: 14px;');
    expect(result).toContain('--font-size-base: 16px;');
    expect(result).toContain('--font-size-lg: 18px;');
  });

  test('converts font family tokens to Tailwind v4 @theme format', () => {
    const tokens = {
      'font-family-sans': 'Inter, sans-serif',
      'font-family-mono': 'Fira Code, monospace'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--font-family-sans: Inter, sans-serif;');
    expect(result).toContain('--font-family-mono: Fira Code, monospace;');
  });

  test('converts border radius tokens to Tailwind v4 @theme format', () => {
    const tokens = {
      'border-radius-sm': '4px',
      'border-radius-md': '8px',
      'border-radius-full': '9999px'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--border-radius-sm: 4px;');
    expect(result).toContain('--border-radius-md: 8px;');
    expect(result).toContain('--border-radius-full: 9999px;');
  });

  test('handles nested color tokens correctly', () => {
    const tokens = {
      'color-primary-50': '#fef2f2',
      'color-primary-100': '#fee2e2',
      'color-primary-500': '#ef4444',
      'color-primary-900': '#7f1d1d'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--color-primary-50: #fef2f2;');
    expect(result).toContain('--color-primary-100: #fee2e2;');
    expect(result).toContain('--color-primary-500: #ef4444;');
    expect(result).toContain('--color-primary-900: #7f1d1d;');
  });

  test('applies color format conversion when specified', () => {
    const tokens = {
      'color-primary': 'rgb(255, 107, 53)',
      'color-secondary': '#007bff'
    };

    const result = toTailwindTheme(tokens, { outputColorFormat: 'hex' });

    expect(result).toContain('--color-primary: #ff6b35;'); // rgb converted to hex
    expect(result).toContain('--color-secondary: #007bff;'); // already hex
  });

  test('generates valid CSS with @theme directive', () => {
    const tokens = {
      'color-primary': '#ff6b35'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('@theme {');
    expect(result).toContain('}');
    expect(result.trim()).toBe('@theme {\n  --color-primary: #ff6b35;\n}');
  });

  test('returns valid @theme block for empty tokens', () => {
    const result = toTailwindTheme({}, {});

    expect(result).toBe('@theme {\n}\n');
  });

  test('handles complex token names correctly', () => {
    const tokens = {
      'box-shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'z-index-dropdown': '1000',
      'letter-spacing-tight': '-0.025em'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--box-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);');
    expect(result).toContain('--z-index-dropdown: 1000;');
    expect(result).toContain('--spacing-letter-spacing-tight: -0.025em;');
  });

  test('converts camelCase token names to kebab-case CSS properties', () => {
    const tokens = {
      'colorPrimary': '#ff6b35',
      'fontSizeBase': '16px',
      'borderRadiusLarge': '12px'
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--color-primary: #ff6b35;');
    expect(result).toContain('--font-size-size-base: 16px;');
    expect(result).toContain('--border-radius-radius-large: 12px;');
  });

  test('categorizes tokens correctly based on naming patterns', () => {
    const tokens = {
      'bg-primary': '#ff6b35', // should be color
      'text-secondary': '#007bff', // should be color
      'space-sm': '8px', // should be spacing
      'margin-md': '16px', // should be spacing
      'typography-size-lg': '18px', // should be fontSize
      'font-family-heading': 'Inter', // should be fontFamily
      'border-radius-lg': '8px', // should be borderRadius
      'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)', // should be boxShadow
      'z-dropdown': '1000' // should be zIndex
    };

    const result = toTailwindTheme(tokens, {});

    expect(result).toContain('--color-primary: #ff6b35;');
    expect(result).toContain('--color-secondary: #007bff;');
    expect(result).toContain('--spacing-sm: 8px;');
    expect(result).toContain('--spacing-margin-md: 16px;');
    expect(result).toContain('--color-typography-size-lg: 18px;');
    expect(result).toContain('--font-family-heading: Inter;');
    expect(result).toContain('--border-radius-lg: 8px;');
    expect(result).toContain('--box-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);');
    expect(result).toContain('--color-z-dropdown: 1000;');
  });
});
