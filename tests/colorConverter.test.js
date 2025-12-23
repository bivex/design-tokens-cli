/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:06:29
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { parseColor, isColor, convertColor, isColorToken, toHex, toRgb, toHsl } from "../utils/colorConverter.js";

describe('Color Converter Utilities', () => {

  describe('parseColor', () => {
    test('parses hex colors correctly', () => {
      expect(parseColor('#ff0000')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('#00ff00')).toEqual({ type: 'rgb', r: 0, g: 255, b: 0, a: 1 });
      expect(parseColor('#0000ff')).toEqual({ type: 'rgb', r: 0, g: 0, b: 255, a: 1 });
      expect(parseColor('#f00')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('#ff000080')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 0.502 });
    });

    test('parses RGB/RGBA colors correctly', () => {
      expect(parseColor('rgb(255, 0, 0)')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 0.5 });
      expect(parseColor('rgb(0, 255, 0)')).toEqual({ type: 'rgb', r: 0, g: 255, b: 0, a: 1 });
    });

    test('parses HSL/HSLA colors correctly', () => {
      expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ type: 'hsl', h: 0, s: 100, l: 50, a: 1 });
      expect(parseColor('hsla(120, 100%, 50%, 0.5)')).toEqual({ type: 'hsl', h: 120, s: 100, l: 50, a: 0.5 });
      expect(parseColor('hsl(240, 100%, 50%)')).toEqual({ type: 'hsl', h: 240, s: 100, l: 50, a: 1 });
    });

    test('returns null for invalid colors', () => {
      expect(parseColor('invalid')).toBeNull();
      expect(parseColor('#gggggg')).toBeNull();
      expect(parseColor('rgb(300, 0, 0)')).toBeNull();
      expect(parseColor('hsl(0, 200%, 50%)')).toBeNull();
    });

    test('handles whitespace and case insensitivity', () => {
      expect(parseColor('  #FF0000  ')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('RGB(255, 0, 0)')).toEqual({ type: 'rgb', r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('Hsl(0, 100%, 50%)')).toEqual({ type: 'hsl', h: 0, s: 100, l: 50, a: 1 });
    });
  });

  describe('isColor', () => {
    test('returns true for valid colors', () => {
      expect(isColor('#ff0000')).toBe(true);
      expect(isColor('rgb(255, 0, 0)')).toBe(true);
      expect(isColor('hsl(0, 100%, 50%)')).toBe(true);
      expect(isColor('#f00')).toBe(true);
      expect(isColor('rgba(255, 0, 0, 0.5)')).toBe(true);
    });

    test('returns false for invalid colors', () => {
      expect(isColor('invalid')).toBe(false);
      expect(isColor('#gggggg')).toBe(false);
      expect(isColor('notacolor')).toBe(false);
      expect(isColor(123)).toBe(false);
      expect(isColor(null)).toBe(false);
    });
  });

  describe('convertColor', () => {
    test('converts hex to RGB', () => {
      expect(convertColor('#ff0000', 'rgb')).toBe('rgb(255, 0, 0)');
      expect(convertColor('#00ff00', 'rgb')).toBe('rgb(0, 255, 0)');
      expect(convertColor('#0000ff', 'rgb')).toBe('rgb(0, 0, 255)');
      expect(convertColor('#ff000080', 'rgb')).toBe('rgba(255, 0, 0, 0.502)');
    });

    test('converts hex to HSL', () => {
      expect(convertColor('#ff0000', 'hsl')).toBe('hsl(0, 100%, 50%)');
      expect(convertColor('#00ff00', 'hsl')).toBe('hsl(120, 100%, 50%)');
      expect(convertColor('#0000ff', 'hsl')).toBe('hsl(240, 100%, 50%)');
      expect(convertColor('#ff000080', 'hsl')).toBe('hsla(0, 100%, 50%, 0.502)');
    });

    test('converts RGB to hex', () => {
      expect(convertColor('rgb(255, 0, 0)', 'hex')).toBe('#ff0000');
      expect(convertColor('rgb(0, 255, 0)', 'hex')).toBe('#00ff00');
      expect(convertColor('rgba(255, 0, 0, 0.5)', 'hex')).toBe('#ff000080');
    });

    test('converts RGB to HSL', () => {
      expect(convertColor('rgb(255, 0, 0)', 'hsl')).toBe('hsl(0, 100%, 50%)');
      expect(convertColor('rgb(0, 255, 0)', 'hsl')).toBe('hsl(120, 100%, 50%)');
      expect(convertColor('rgba(255, 0, 0, 0.5)', 'hsl')).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    test('converts HSL to hex', () => {
      expect(convertColor('hsl(0, 100%, 50%)', 'hex')).toBe('#ff0000');
      expect(convertColor('hsl(120, 100%, 50%)', 'hex')).toBe('#00ff00');
      expect(convertColor('hsla(0, 100%, 50%, 0.5)', 'hex')).toBe('#ff000080');
    });

    test('converts HSL to RGB', () => {
      expect(convertColor('hsl(0, 100%, 50%)', 'rgb')).toBe('rgb(255, 0, 0)');
      expect(convertColor('hsl(120, 100%, 50%)', 'rgb')).toBe('rgb(0, 255, 0)');
      expect(convertColor('hsla(0, 100%, 50%, 0.5)', 'rgb')).toBe('rgba(255, 0, 0, 0.5)');
    });

    test('returns original value for auto format', () => {
      expect(convertColor('#ff0000', 'auto')).toBe('#ff0000');
      expect(convertColor('rgb(255, 0, 0)', 'auto')).toBe('rgb(255, 0, 0)');
    });

    test('returns original value for invalid colors', () => {
      expect(convertColor('invalid', 'rgb')).toBe('invalid');
      expect(convertColor('#gggggg', 'hsl')).toBe('#gggggg');
    });

    test('returns original value for unsupported formats', () => {
      expect(convertColor('#ff0000', 'unsupported')).toBe('#ff0000');
    });
  });

  describe('isColorToken', () => {
    test('identifies color tokens by key name', () => {
      expect(isColorToken('background-color', '#ff0000')).toBe(true);
      expect(isColorToken('text-color', 'rgb(255, 0, 0)')).toBe(true);
      expect(isColorToken('border-color', 'hsl(0, 100%, 50%)')).toBe(true);
      expect(isColorToken('fill-color', '#f00')).toBe(true);
      expect(isColorToken('bg', '#000')).toBe(true);
      expect(isColorToken('fg', '#fff')).toBe(true);
    });

    test('returns false for non-color tokens', () => {
      expect(isColorToken('font-size', '16px')).toBe(false);
      expect(isColorToken('spacing', '10px')).toBe(false);
      expect(isColorToken('background-color', 'invalid')).toBe(false);
      expect(isColorToken('color', 123)).toBe(false);
    });

    test('returns false for color keys with invalid values', () => {
      expect(isColorToken('background-color', 'invalid')).toBe(false);
      expect(isColorToken('text-color', 'notacolor')).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('round-trip conversions maintain accuracy', () => {
      const original = '#ff6b35';
      const rgb = convertColor(original, 'rgb');
      const backToHex = convertColor(rgb, 'hex');
      expect(backToHex.toLowerCase()).toBe(original.toLowerCase());
    });

    test('handles edge cases', () => {
      // Black
      expect(convertColor('#000000', 'rgb')).toBe('rgb(0, 0, 0)');
      expect(convertColor('#000000', 'hsl')).toBe('hsl(0, 0%, 0%)');

      // White
      expect(convertColor('#ffffff', 'rgb')).toBe('rgb(255, 255, 255)');
      expect(convertColor('#ffffff', 'hsl')).toBe('hsl(0, 0%, 100%)');

      // Gray
      expect(convertColor('#808080', 'rgb')).toBe('rgb(128, 128, 128)');
      expect(convertColor('#808080', 'hsl')).toBe('hsl(0, 0%, 50%)');
    });
  });
});
