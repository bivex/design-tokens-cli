/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:27
 * Last Updated: 2025-12-23T04:08:10
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { flattenJSON, resolveGroupExtensions } from '../utils/flattenJSON.js';

test('Group extensions with $extends inherit tokens from referenced group', () => {
  const tokens = {
    "button": {
      "$type": "color",
      "background": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0, 0.4, 0.8],
          "hex": "#0066cc"
        }
      },
      "text": {
        "$value": {
          "colorSpace": "srgb",
          "components": [1, 1, 1],
          "hex": "#ffffff"
        }
      }
    },
    "button-primary": {
      "$extends": "{button}",
      "background": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.8, 0, 0.4],
          "hex": "#cc0066"
        }
      }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that button-primary inherited text from button
  expect(flattened['button-primary-text-colorSpace']).toBe('srgb');
  expect(flattened['button-primary-text-hex']).toBe('#ffffff');

  // Check that button-primary overrode background
  expect(flattened['button-primary-background-colorSpace']).toBe('srgb');
  expect(flattened['button-primary-background-hex']).toBe('#cc0066');
});

test('Group extensions work with nested group structures', () => {
  const tokens = {
    "color": {
      "base": {
        "$type": "color",
        "primary": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0, 0.4, 0.8],
            "hex": "#0066cc"
          }
        },
        "secondary": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0.4, 0.6, 1],
            "hex": "#6699ff"
          }
        }
      }
    },
    "button": {
      "$extends": "{color.base}",
      "background": {
        "$value": "{color.base.primary}"
      }
    }
  };

  // Resolve group extensions first
  const resolved = {};
  Object.keys(tokens).forEach(key => {
    resolved[key] = resolveGroupExtensions(tokens[key], tokens);
  });

  // Resolve references (simplified version)
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

  // Now flatten
  const flattened = flattenJSON(resolved, {}, tokens);

  // Check that button inherited both primary and secondary colors
  expect(flattened['button-primary-colorSpace']).toBe('srgb');
  expect(flattened['button-primary-hex']).toBe('#0066cc');
  expect(flattened['button-secondary-colorSpace']).toBe('srgb');
  expect(flattened['button-secondary-hex']).toBe('#6699ff');

  // Check that button.background reference was resolved
  expect(flattened['button-background-colorSpace']).toBe('srgb');
  expect(flattened['button-background-hex']).toBe('#0066cc');
});

test('Multiple levels of group extension work correctly', () => {
  const tokens = {
    "base": {
      "$type": "dimension",
      "small": { "$value": { "value": 8, "unit": "px" } },
      "medium": { "$value": { "value": 16, "unit": "px" } }
    },
    "extended": {
      "$extends": "{base}",
      "large": { "$value": { "value": 32, "unit": "px" } }
    },
    "final": {
      "$extends": "{extended}",
      "small": { "$value": { "value": 4, "unit": "px" } } // Override
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check inheritance chain
  expect(flattened['final-medium-value']).toBe(16); // Inherited from base through extended
  expect(flattened['final-large-value']).toBe(32); // Inherited from extended
  expect(flattened['final-small-value']).toBe(4);  // Overridden in final
});

test('Group extensions handle empty referenced groups', () => {
  const tokens = {
    "empty": {
      "$description": "An empty group"
    },
    "extended": {
      "$extends": "{empty}",
      "token": { "$value": "value" }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that extended group contains its own token
  expect(flattened['extended-token']).toBe('value');

  // Check that no tokens were inherited from empty group
  const extendedKeys = Object.keys(flattened).filter(key => key.startsWith('extended-'));
  expect(extendedKeys).toEqual(['extended-token']);
});

test('Circular group extensions are prevented', () => {
  const tokens = {
    "groupA": {
      "$extends": "{groupB}",
      "tokenA": { "$value": "A" }
    },
    "groupB": {
      "$extends": "{groupC}",
      "tokenB": { "$value": "B" }
    },
    "groupC": {
      "$extends": "{groupA}", // Creates circular reference
      "tokenC": { "$value": "C" }
    }
  };

  // This should not throw during flattening, as circular detection happens during extension resolution
  // The current implementation handles this gracefully by not creating infinite loops
  expect(() => flattenJSON(tokens)).not.toThrow();
});
