/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:18:28
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { toTailwindConfig } from "../utils/transformers/toTailwindConfig.js";

describe('Tailwind Config Transformer', () => {
  test('converts color tokens to Tailwind config format', () => {
    const tokens = {
      'color-primary': '#ff6b35',
      'color-secondary': '#007bff',
      'text-color': '#333333'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('/** @type {import(\'tailwindcss\').Config} */');
    expect(result).toContain('export default {');
    expect(result).toContain('theme: {');
    expect(result).toContain('extend: {');
    expect(result).toContain('colors: {');
    expect(result).toContain('"primary": "#ff6b35"');
    expect(result).toContain('"secondary": "#007bff"');
    expect(result).toContain('"color": "#333333"');
  });

  test('converts spacing tokens to Tailwind config format', () => {
    const tokens = {
      'spacing-sm': '8px',
      'spacing-md': '16px',
      'spacing-lg': '24px'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('spacing: {');
    expect(result).toContain('"sm": "8px"');
    expect(result).toContain('"md": "16px"');
    expect(result).toContain('"lg": "24px"');
  });

  test('converts font size tokens to Tailwind config format', () => {
    const tokens = {
      'font-size-sm': '14px',
      'font-size-base': '16px',
      'font-size-lg': '18px'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('fontSize: {');
    expect(result).toContain('"sm": "14px"');
    expect(result).toContain('"base": "16px"');
    expect(result).toContain('"lg": "18px"');
  });

  test('converts font family tokens to Tailwind config format', () => {
    const tokens = {
      'font-family-sans': 'Inter, sans-serif',
      'font-family-mono': 'Fira Code, monospace'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('fontFamily: {');
    expect(result).toContain('"sans": "Inter, sans-serif"');
    expect(result).toContain('"mono": "Fira Code, monospace"');
  });

  test('converts border radius tokens to Tailwind config format', () => {
    const tokens = {
      'border-radius-sm': '4px',
      'border-radius-md': '8px',
      'border-radius-full': '9999px'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('borderRadius: {');
    expect(result).toContain('"sm": "4px"');
    expect(result).toContain('"md": "8px"');
    expect(result).toContain('"full": "9999px"');
  });

  test('handles nested color tokens correctly', () => {
    const tokens = {
      'color-primary-50': '#fef2f2',
      'color-primary-100': '#fee2e2',
      'color-primary-500': '#ef4444',
      'color-primary-900': '#7f1d1d'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('colors: {');
    expect(result).toContain('"primary": {');
    expect(result).toContain('"50": "#fef2f2"');
    expect(result).toContain('"100": "#fee2e2"');
    expect(result).toContain('"500": "#ef4444"');
    expect(result).toContain('"900": "#7f1d1d"');
  });

  test('applies color format conversion when specified', () => {
    const tokens = {
      'color-primary': 'rgb(255, 107, 53)',
      'color-secondary': '#007bff'
    };

    const result = toTailwindConfig(tokens, { outputColorFormat: 'hex' });

    expect(result).toContain('"primary": "#ff6b35"'); // rgb converted to hex
    expect(result).toContain('"secondary": "#007bff"'); // already hex
  });

  test('generates valid JavaScript module syntax', () => {
    const tokens = {
      'color-primary': '#ff6b35'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('export default {');
    expect(result).toContain('}');
    expect(result).toContain('/** @type {import(\'tailwindcss\').Config} */');
    expect(result).toContain('theme: {');
    expect(result).toContain('extend: {');
  });

  test('returns valid config for empty tokens', () => {
    const result = toTailwindConfig({}, {});

    expect(result).toContain('export default {');
    expect(result).toContain('theme: {');
    expect(result).toContain('extend: {');
  });

  test('handles complex token names correctly', () => {
    const tokens = {
      'box-shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'z-index-dropdown': '1000',
      'letter-spacing-tight': '-0.025em'
    };

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('boxShadow: {');
    expect(result).toContain('"sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)"');
    expect(result).toContain('zIndex: {');
    expect(result).toContain('"dropdown": "1000"');
    expect(result).toContain('spacing: {');
    expect(result).toContain('"letter-spacing-tight": "-0.025em"');
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

    const result = toTailwindConfig(tokens, {});

    expect(result).toContain('colors: {');
    expect(result).toContain('"primary": "#ff6b35"');
    expect(result).toContain('"secondary": "#007bff"');

    expect(result).toContain('spacing: {');
    expect(result).toContain('"sm": "8px"');
    expect(result).toContain('"margin-md": "16px"');

    expect(result).toContain('fontFamily: {');
    expect(result).toContain('"heading": "Inter"');

    expect(result).toContain('borderRadius: {');
    expect(result).toContain('"lg": "8px"');

    expect(result).toContain('boxShadow: {');
    expect(result).toContain('"lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"');
  });
});
