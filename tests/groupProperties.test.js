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
import { flattenJSON } from '../utils/flattenJSON.js';

test('Group type inheritance applies to child tokens', () => {
  const tokens = {
    "spacing": {
      "$type": "dimension",
      "small": { "$value": { "value": 8, "unit": "px" } },
      "medium": { "$value": { "value": 16, "unit": "px" } },
      "large": { "$value": { "value": 32, "unit": "px" } }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that all tokens inherited the dimension type
  expect(flattened['spacing-small-$type']).toBe('dimension');
  expect(flattened['spacing-medium-$type']).toBe('dimension');
  expect(flattened['spacing-large-$type']).toBe('dimension');
});

test('Token-level type overrides group-level type', () => {
  const tokens = {
    "mixed": {
      "$type": "dimension",
      "width": { "$value": { "value": 100, "unit": "px" } }, // Inherits dimension
      "color": {
        "$type": "color",
        "$value": {
          "colorSpace": "srgb",
          "components": [1, 0, 0],
          "hex": "#ff0000"
        }
      } // Overrides with color
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check inheritance and override
  expect(flattened['mixed-width-$type']).toBe('dimension');
  expect(flattened['mixed-color-$type']).toBe('color');
});

test('Nested group type inheritance works hierarchically', () => {
  const tokens = {
    "ui": {
      "$type": "color",
      "button": {
        "primary": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0, 0.4, 0.8],
            "hex": "#0066cc"
          }
        }, // Inherits color from ui
        "secondary": {
          "$type": "dimension", // Overrides with dimension
          "$value": { "value": 2, "unit": "px" }
        }
      },
      "input": {
        "border": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0.8, 0.8, 0.8],
            "hex": "#cccccc"
          }
        } // Inherits color from ui
      }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check hierarchical inheritance
  expect(flattened['ui-button-primary-$type']).toBe('color'); // Inherited from ui
  expect(flattened['ui-button-secondary-$type']).toBe('dimension'); // Override
  expect(flattened['ui-input-border-$type']).toBe('color'); // Inherited from ui
});

test('Group extensions inherit type information', () => {
  const tokens = {
    "base": {
      "$type": "color",
      "primary": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0, 0.4, 0.8],
          "hex": "#0066cc"
        }
      }
    },
    "extended": {
      "$extends": "{base}",
      "secondary": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0.4, 0.6, 1],
          "hex": "#6699ff"
        }
      } // Should inherit color type
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that extended group inherited the type
  expect(flattened['extended-primary-$type']).toBe('color');
  expect(flattened['extended-secondary-$type']).toBe('color');
});

test('Group description property is preserved but not flattened', () => {
  const tokens = {
    "colors": {
      "$type": "color",
      "$description": "Brand color palette",
      "primary": {
        "$value": {
          "colorSpace": "srgb",
          "components": [0, 0.4, 0.8],
          "hex": "#0066cc"
        }
      }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that description is not in flattened output
  const keys = Object.keys(flattened);
  expect(keys).not.toContain('$description');
  expect(keys).not.toContain('colors-$description');

  // But the token should still be there
  expect(flattened['colors-primary-colorSpace']).toBe('srgb');
  expect(flattened['colors-primary-$type']).toBe('color');
});

test('Group extensions property is processed but not preserved', () => {
  const tokens = {
    "base": {
      "$type": "color",
      "value": { "$value": "#000000" }
    },
    "extended": {
      "$extends": "{base}",
      "extra": { "$value": "#ffffff" }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that $extends is not in output
  const keys = Object.keys(flattened);
  expect(keys.some(key => key.includes('$extends'))).toBe(false);

  // But inheritance should have worked
  expect(flattened['extended-value']).toBe('#000000');
  expect(flattened['extended-extra']).toBe('#ffffff');
});

test('Group deprecated property is preserved for metadata', () => {
  const tokens = {
    "deprecated": {
      "$deprecated": true,
      "oldToken": { "$value": "old-value" }
    },
    "alsoDeprecated": {
      "$deprecated": "Use new tokens instead",
      "anotherToken": { "$value": "another-value" }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that deprecated is not in flattened output (as it's a group property)
  const keys = Object.keys(flattened);
  expect(keys.some(key => key.includes('$deprecated'))).toBe(false);

  // But tokens should still exist
  expect(flattened['deprecated-oldToken']).toBe('old-value');
  expect(flattened['alsoDeprecated-anotherToken']).toBe('another-value');
});

test('Group extensions property is processed correctly', () => {
  const tokens = {
    "base": {
      "$extensions": {
        "org.example.tool": { "customData": "value" }
      },
      "token": { "$value": "base-value" }
    },
    "extended": {
      "$extends": "{base}",
      "extraToken": { "$value": "extended-value" }
    }
  };

  const flattened = flattenJSON(tokens, {}, tokens);

  // Check that $extensions is not in output
  const keys = Object.keys(flattened);
  expect(keys.some(key => key.includes('$extensions'))).toBe(false);

  // But inheritance should have worked
  expect(flattened['extended-token']).toBe('base-value');
  expect(flattened['extended-extraToken']).toBe('extended-value');
});
