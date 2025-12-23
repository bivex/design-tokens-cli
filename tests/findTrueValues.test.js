/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:04:36
 * Last Updated: 2025-12-23T03:33:26
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

test('configurable prefixes allow custom or no prefixes per group', () => {
  const inputTokens = {
    "colors": {
      "error": { "$value": "red" },
      "success": { "$value": "green" }
    },
    "sizes": {
      "small": { "$value": "16px" },
      "large": { "$value": "32px" }
    },
    "spacing": {
      "margin": { "$value": "8px" }
    }
  };

  // With custom prefixes - colors get no prefix, sizes get "size-" prefix
  const withPrefixes = flattenJSON(inputTokens, {
    prefixes: {
      "colors": "",      // No prefix for colors
      "sizes": "size-"   // Custom prefix for sizes
      // spacing uses default behavior (no config = "spacing-" prefix)
    }
  });

  const keys = Object.keys(withPrefixes);
  expect(keys).toEqual([
    'error',        // colors group with no prefix
    'success',      // colors group with no prefix
    'size-small',   // sizes group with custom prefix
    'size-large',   // sizes group with custom prefix
    'spacing-margin' // spacing group with default prefix
  ]);

  expect(withPrefixes['error']).toBe('red');
  expect(withPrefixes['success']).toBe('green');
  expect(withPrefixes['size-small']).toBe('16px');
  expect(withPrefixes['size-large']).toBe('32px');
  expect(withPrefixes['spacing-margin']).toBe('8px');
});

test('cross-transform reference resolution works globally', () => {
  // Test the scenario where tokens from different transforms reference each other
  const globalTokens = {
    'primary': 'blue',
    'secondary': 'gray',
    'primary-bg': '{primary}',
    'secondary-bg': '{secondary}'
  };

  // Resolve references globally (as the new implementation does)
  const resolved = findTrueValues({ global: globalTokens });

  // Check that cross-transform references were resolved
  expect(resolved['primary-bg']).toBe('blue');
  expect(resolved['secondary-bg']).toBe('gray');
  expect(resolved['primary']).toBe('blue');
  expect(resolved['secondary']).toBe('gray');
});