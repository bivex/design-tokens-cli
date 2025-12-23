/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:27
 * Last Updated: 2025-12-23T04:29:22
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';

import jetpack from 'fs-jetpack';
import { transform } from '../utils/transform.js';

const testDir = 'test-integration-output';

describe('Integration Tests - Full CLI Workflow', () => {
  beforeEach(() => {
    // Clean up any existing test output
    if (jetpack.exists(testDir)) {
      jetpack.remove(testDir);
    }
  });

  afterEach(() => {
    // Clean up test output after each test
    if (jetpack.exists(testDir)) {
      jetpack.remove(testDir);
    }
  });

  test('Full transform with multiple formats and 2025.10 features', () => {
    // Create test tokens with all 2025.10 features
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    // Create a comprehensive tokens file
    const tokensContent = {
      "color": {
        "$type": "color",
        "base": {
          "$root": {
            "$value": {
              "colorSpace": "srgb",
              "components": [0.5, 0.5, 0.5],
              "hex": "#808080"
            }
          },
          "red": {
            "$value": {
              "colorSpace": "srgb",
              "components": [1, 0, 0],
              "hex": "#ff0000"
            }
          },
          "blue": {
            "$value": {
              "colorSpace": "srgb",
              "components": [0, 0, 1],
              "hex": "#0000ff"
            }
          }
        },
        "semantic": {
          "$extends": "{color.base}",
          "primary": {
            "$value": "{color.base.blue}"
          },
          "accent": {
            "$value": {
              "$ref": "#/color/base/red/$value"
            }
          }
        }
      },
      "typography": {
        "$type": "typography",
        "base": {
          "$root": {
            "$value": {
              "fontFamily": ["Inter", "sans-serif"],
              "fontSize": {"value": 16, "unit": "px"},
              "fontWeight": 400,
              "lineHeight": 1.5
            }
          },
          "heading": {
            "$value": {
              "fontFamily": {"$ref": "#/typography/base/$root/$value/fontFamily"},
              "fontSize": {"value": 24, "unit": "px"},
              "fontWeight": 600,
              "lineHeight": 1.2
            }
          }
        }
      }
    };

    jetpack.write(`${tokensDir}/design.tokens.json`, tokensContent);

    // Create config file
    const configContent = {
      "globalPrefix": "test",
      "preserveOrder": true,
      "transforms": [
        {
          "name": "design-system",
          "from": tokensDir,
          "to": [
            {"as": "css", "to": `${testDir}/css`},
            {"as": "scss", "to": `${testDir}/scss`},
            {"as": "mjs", "to": `${testDir}/js`},
            {"as": "json", "to": `${testDir}/json`},
            {"as": "tailwind-config", "to": `${testDir}/tailwind/v3`},
            {"as": "tailwind-theme", "to": `${testDir}/tailwind/v4`}
          ]
        }
      ]
    };

    const configPath = `${testDir}/test-config.json`;
    jetpack.write(configPath, configContent);

    // Run the transform
    expect(() => {
      transform(configPath);
    }).not.toThrow();

    // Verify SCSS output
    const scssContent = jetpack.read(`${testDir}/scss/design-system.tokens.scss`);
    expect(scssContent).toContain('$test-color-base-base-hex: #808080');
    expect(scssContent).toContain('$test-color-semantic-primary-hex: #0000ff');

    // Verify JSON output
    const jsonContent = jetpack.read(`${testDir}/json/design-system.tokens.json`, 'json');
    expect(jsonContent).toHaveProperty('test-color-base-base-hex', '#808080');
    expect(jsonContent).toHaveProperty('test-color-semantic-primary-hex', '#0000ff');
  });

  test('Single transform with references works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    // Tokens with internal references
    const tokens = {
      "color": {
        "$type": "color",
        "primary": {
          "$value": {
            "colorSpace": "srgb",
            "components": [0.2, 0.6, 0.9],
            "hex": "#3399e6"
          }
        }
      },
      "button": {
        "primary": {
          "background": {"$value": "{color.primary}"},
          "text": {"$value": "#ffffff"}
        }
      }
    };

    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "transforms": [
        {"from": tokensDir, "to": [{"as": "json", "to": `${testDir}/output`}]}
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Concatenation works with named transforms', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    // Create separate token files in the same directory
    const spacingTokens = {
      "spacing": {
        "$type": "dimension",
        "small": {"$value": {"value": 8, "unit": "px"}},
        "medium": {"$value": {"value": 16, "unit": "px"}}
      }
    };

    const colorTokens = {
      "color": {
        "$type": "color",
        "primary": {"$value": "#007bff"}
      }
    };

    jetpack.write(`${tokensDir}/spacing.tokens.json`, spacingTokens);
    jetpack.write(`${tokensDir}/colors.tokens.json`, colorTokens);

    // Create config with named transform for concatenation
    const configContent = {
      "transforms": [
        {
          "name": "system",
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/concat-config.json`;
    jetpack.write(configPath, configContent);

    // Run transform
    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });
});
