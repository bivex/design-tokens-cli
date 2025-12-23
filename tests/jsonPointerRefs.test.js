/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:27
 * Last Updated: 2025-12-23T04:11:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { parseJsonPointer, resolveJsonPointer, isJsonPointerRef } from '../utils/jsonPointer.js';
import { findTrueValues } from '../utils/findTrueValues.js';

test('parseJsonPointer correctly parses JSON Pointer strings', () => {
  expect(parseJsonPointer('#/group/token')).toEqual(['group', 'token']);
  expect(parseJsonPointer('#/group/nested/deep')).toEqual(['group', 'nested', 'deep']);
  expect(parseJsonPointer('#/')).toEqual([]);
  expect(parseJsonPointer('#/group/token/$value')).toEqual(['group', 'token', '$value']);
});

test('parseJsonPointer handles escaped characters', () => {
  expect(parseJsonPointer('#/group~1with~1slashes/token')).toEqual(['group/with/slashes', 'token']);
  expect(parseJsonPointer('#/group~0with~0tildes/token')).toEqual(['group~with~tildes', 'token']);
  expect(parseJsonPointer('#/path~1to~1file~1name.txt')).toEqual(['path/to/file/name.txt']);
});

test('resolveJsonPointer resolves paths in documents', () => {
  const document = {
    color: {
      primary: {
        $value: { hex: '#0066cc' }
      }
    }
  };

  expect(resolveJsonPointer(document, ['color', 'primary', '$value', 'hex'])).toBe('#0066cc');
  expect(resolveJsonPointer(document, ['color', 'primary'])).toEqual({ $value: { hex: '#0066cc' } });
  expect(resolveJsonPointer(document, ['nonexistent'])).toBeUndefined();
});

test('resolveJsonPointer handles array indices', () => {
  const document = {
    colors: ['red', 'green', 'blue']
  };

  expect(resolveJsonPointer(document, ['colors', '0'])).toBe('red');
  expect(resolveJsonPointer(document, ['colors', '2'])).toBe('blue');
  expect(resolveJsonPointer(document, ['colors', '3'])).toBeUndefined();
});

test('isJsonPointerRef correctly identifies JSON Pointer references', () => {
  expect(isJsonPointerRef('#/group/token')).toBe(true);
  expect(isJsonPointerRef('#/')).toBe(true);
  expect(isJsonPointerRef('{group.token}')).toBe(false);
  expect(isJsonPointerRef('not-a-reference')).toBe(false);
  expect(isJsonPointerRef('#invalid')).toBe(false);
});

test('JSON Pointer references resolve in token values', () => {
  const document = {
    base: {
      spacing: {
        $value: { value: 16, unit: 'px' }
      }
    }
  };

  // Test that JSON Pointer can resolve values
  const valueRef = resolveJsonPointer(document, ['base', 'spacing', '$value', 'value']);
  const unitRef = resolveJsonPointer(document, ['base', 'spacing', '$value', 'unit']);

  expect(valueRef).toBe(16);
  expect(unitRef).toBe('px');
});

test('JSON Pointer references work with complex nested structures', () => {
  const document = {
    theme: {
      colors: {
        primary: {
          $value: {
            colorSpace: 'srgb',
            components: [0, 0.4, 0.8],
            hex: '#0066cc'
          }
        }
      }
    }
  };

  // Test resolving complex nested structures
  const fullColor = resolveJsonPointer(document, ['theme', 'colors', 'primary', '$value']);
  const colorSpace = resolveJsonPointer(document, ['theme', 'colors', 'primary', '$value', 'colorSpace']);
  const firstComponent = resolveJsonPointer(document, ['theme', 'colors', 'primary', '$value', 'components', '0']);

  expect(fullColor).toEqual({
    colorSpace: 'srgb',
    components: [0, 0.4, 0.8],
    hex: '#0066cc'
  });
  expect(colorSpace).toBe('srgb');
  expect(firstComponent).toBe(0);
});

test('JSON Pointer references handle arrays correctly', () => {
  const document = {
    font: {
      families: {
        $value: ['Arial', 'Helvetica', 'sans-serif']
      }
    }
  };

  // Test array access
  const fullArray = resolveJsonPointer(document, ['font', 'families', '$value']);
  const firstItem = resolveJsonPointer(document, ['font', 'families', '$value', '0']);
  const secondItem = resolveJsonPointer(document, ['font', 'families', '$value', '1']);

  expect(fullArray).toEqual(['Arial', 'Helvetica', 'sans-serif']);
  expect(firstItem).toBe('Arial');
  expect(secondItem).toBe('Helvetica');
});

test('Invalid JSON Pointer references throw errors', () => {
  const document = {
    component: {
      invalid: {
        $value: { $ref: '#/nonexistent/path' }
      }
    }
  };

  expect(() => findTrueValues({ test: document }, document)).toThrow('JSON Pointer reference not found: #/nonexistent/path');
});

test('Invalid JSON Pointer references return undefined', () => {
  const document = {
    valid: { $value: 'test' }
  };

  // Test invalid paths
  const invalid1 = resolveJsonPointer(document, ['nonexistent']);
  const invalid2 = resolveJsonPointer(document, ['valid', '$value', 'missing', 'property']);

  expect(invalid1).toBeUndefined();
  expect(invalid2).toBeUndefined();
});
