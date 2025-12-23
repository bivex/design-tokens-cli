/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:27
 * Last Updated: 2025-12-23T03:33:27
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { flattenJSON, resolveGroupExtensions } from '../utils/flattenJSON.js';

test('Root tokens are properly handled with correct path construction', () => {
  const tokens = {
    "spacing": {
      "$type": "dimension",
      "$root": { "$value": { "value": 16, "unit": "px" } },
      "small": { "$value": { "value": 8, "unit": "px" } },
      "large": { "$value": { "value": 32, "unit": "px" } }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that $root token is accessible with correct path
  expect(flattened['spacing-$root-value']).toBe(16);
  expect(flattened['spacing-$root-unit']).toBe('px');

  // Check that regular tokens work normally
  expect(flattened['spacing-small-value']).toBe(8);
  expect(flattened['spacing-small-unit']).toBe('px');
  expect(flattened['spacing-large-value']).toBe(32);
  expect(flattened['spacing-large-unit']).toBe('px');
});

test('Root tokens work with composite values', () => {
  const tokens = {
    "typography": {
      "$type": "typography",
      "$root": {
        "$value": {
          "fontFamily": ["Arial", "sans-serif"],
          "fontSize": { "value": 16, "unit": "px" },
          "fontWeight": 400,
          "lineHeight": 1.5
        }
      },
      "heading": {
        "$value": {
          "fontFamily": { "$ref": "#/typography/$root/$value/fontFamily" },
          "fontSize": { "value": 24, "unit": "px" },
          "fontWeight": 700,
          "lineHeight": 1.2
        }
      }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that $root token has all composite properties
  expect(flattened['typography-$root-fontFamily']).toEqual(["Arial", "sans-serif"]);
  expect(flattened['typography-$root-fontSize']).toEqual({ "value": 16, "unit": "px" });
  expect(flattened['typography-$root-fontWeight']).toBe(400);
  expect(flattened['typography-$root-lineHeight']).toBe(1.5);
  expect(flattened['typography-$root-$type']).toBe('typography');

  // Check that heading token exists
  expect(flattened['typography-heading-fontSize']).toEqual({ "value": 24, "unit": "px" });
  expect(flattened['typography-heading-fontWeight']).toBe(700);
});

test('Root tokens work in group extensions', () => {
  const tokens = {
    "color": {
      "$type": "color",
      "brand": {
        "$root": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0, 0.4, 0.8],
            "hex": "#0066cc"
          }
        },
        "light": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0.2, 0.533, 0.867],
            "hex": "#3388dd"
          }
        }
      }
    },
    "button": {
      "$extends": "{color.brand}",
      "background": {
        "$value": "{color.brand.$root}"
      }
    }
  };

  // Resolve group extensions and references
  const resolved = {};
  Object.keys(tokens).forEach(key => {
    resolved[key] = resolveGroupExtensions(tokens[key], tokens);
  });

  // Resolve references
  const resolveValue = (value, globalTokens) => {
    if (typeof value === 'string' && value.startsWith('{')) {
      const refName = value.slice(1, -1);
      const path = refName.split('.');
      let current = globalTokens;
      for (const segment of path) {
        if (current && typeof current === 'object') {
          current = current[segment];
        } else {
          current = null;
          break;
        }
      }
      if (current && current.$value) {
        return current.$value;
      }
    }
    return value;
  };

  const resolveInObject = (obj, globalTokens) => {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key].$value) {
          obj[key].$value = resolveValue(obj[key].$value, globalTokens);
        } else {
          resolveInObject(obj[key], globalTokens);
        }
      }
    }
  };

  resolveInObject(resolved, resolved);

  const flattened = flattenJSON(resolved, {}, tokens);

  // Check that button inherited the $root token
  expect(flattened['button-$root-colorSpace']).toBe('srgb');
  expect(flattened['button-$root-hex']).toBe('#0066cc');

  // Check that button inherited the light variant
  expect(flattened['button-light-colorSpace']).toBe('srgb');
  expect(flattened['button-light-hex']).toBe('#3388dd');

  // Check that button.background resolved to the $root value
  expect(flattened['button-background-colorSpace']).toBe('srgb');
  expect(flattened['button-background-hex']).toBe('#0066cc');
});

test('Root tokens are distinguished from regular tokens in path construction', () => {
  const tokens = {
    "theme": {
      "$root": { "$value": "base-value" },
      "variant": { "$value": "variant-value" },
      "nested": {
        "$root": { "$value": "nested-base" },
        "item": { "$value": "nested-item" }
      }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that $root tokens have correct paths
  expect(flattened['theme-$root']).toBe('base-value');
  expect(flattened['theme-variant']).toBe('variant-value');
  expect(flattened['theme-nested-$root']).toBe('nested-base');
  expect(flattened['theme-nested-item']).toBe('nested-item');
});

test('Root tokens can be referenced using $root in path', () => {
  const tokens = {
    "palette": {
      "$root": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.5, 0.5, 0.5],
          "hex": "#808080"
        }
      },
      "dark": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.3, 0.3, 0.3],
          "hex": "#4d4d4d"
        }
      }
    },
    "component": {
      "background": {
        "$value": "{palette.$root}"
      },
      "border": {
        "$value": "{palette.dark}"
      }
    }
  };

  // Resolve references
  const resolveValue = (value, globalTokens) => {
    if (typeof value === 'string' && value.startsWith('{')) {
      const refName = value.slice(1, -1);
      const path = refName.split('.');
      let current = globalTokens;
      for (const segment of path) {
        if (current && typeof current === 'object') {
          current = current[segment];
        } else {
          current = null;
          break;
        }
      }
      if (current && current.$value) {
        return current.$value;
      }
    }
    return value;
  };

  const resolveInObject = (obj, globalTokens) => {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key].$value) {
          obj[key].$value = resolveValue(obj[key].$value, globalTokens);
        } else {
          resolveInObject(obj[key], globalTokens);
        }
      }
    }
  };

  const resolved = JSON.parse(JSON.stringify(tokens));
  resolveInObject(resolved, tokens);

  const flattened = flattenJSON(resolved, {}, tokens);

  // Check that {palette.$root} resolves correctly
  expect(flattened['component-background-colorSpace']).toBe('srgb');
  expect(flattened['component-background-hex']).toBe('#808080');

  // Check that {palette.dark} resolves correctly
  expect(flattened['component-border-colorSpace']).toBe('srgb');
  expect(flattened['component-border-hex']).toBe('#4d4d4d');
});
