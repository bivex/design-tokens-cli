/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:04:36
 * Last Updated: 2025-12-23T03:06:29
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { findTrueValues, keepReferences } from '../utils/findTrueValues.js';
import { flattenJSON } from '../utils/flattenJSON.js';

test('Searches through references to find true value and apply it', () => {
  const tokens = {
    'color': {
      'color-white': '#ffffff',
      'color-blanche': '{color.white}',
      'color-weiss': '{color.blanche}'
    }
  }

  const resolved = findTrueValues(tokens);
  expect(resolved['color-weiss']).toBe('#ffffff');
});

test('keepReferences keeps references as variable references with proper ordering', () => {
  const tokens = {
    'color': {
      'color-white': '#ffffff',
      'color-blanche': '{color.white}',
      'color-weiss': '{color.blanche}'
    }
  }

  const result = keepReferences(tokens);

  // Check that references are kept
  expect(result.pairs['color-white']).toBe('#ffffff');
  expect(result.pairs['color-blanche']).toBe('{color.white}');
  expect(result.pairs['color-weiss']).toBe('{color.blanche}');

  // Check ordering - dependencies should come first
  const orderedIndex = result.orderedTokens;
  expect(orderedIndex.indexOf('color-white')).toBeLessThan(orderedIndex.indexOf('color-blanche'));
  expect(orderedIndex.indexOf('color-blanche')).toBeLessThan(orderedIndex.indexOf('color-weiss'));
});

test('preserveOrder maintains logical grouping from input files', () => {
  // Test that tokens maintain their order from the input JSON structure
  const inputTokens = {
    "spacing": {
      "tiny": { "$value": "8px" },
      "small": { "$value": "16px" },
      "medium": { "$value": "24px" }
    },
    "color": {
      "error": { "$value": "red" },
      "success": { "$value": "green" }
    },
    "border": {
      "radius": { "$value": "3px" }
    }
  };

  // With preserveOrder: true (preserve order, default)
  const preservedOrder = flattenJSON(inputTokens, { preserveOrder: true });

  const keys = Object.keys(preservedOrder);
  expect(keys).toEqual([
    'spacing-tiny',
    'spacing-small',
    'spacing-medium',
    'color-error',
    'color-success',
    'border-radius'
  ]);

  // With preserveOrder: false (alphabetical)
  const sortedOrder = flattenJSON(inputTokens, { preserveOrder: false });
  const sortedKeys = Object.keys(sortedOrder);
  expect(sortedKeys).toEqual([
    'border-radius',
    'color-error',
    'color-success',
    'spacing-medium',
    'spacing-small',
    'spacing-tiny'
  ]);
});