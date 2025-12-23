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

import { transform } from '../utils/transform.js';
import { flattenJSON } from '../utils/flattenJSON.js';
import { findTrueValues } from '../utils/findTrueValues.js';
import jetpack from 'fs-jetpack';

const testDir = 'test-error-output';

describe('Error Handling Tests', () => {
  beforeEach(() => {
    if (jetpack.exists(testDir)) {
      jetpack.remove(testDir);
    }
    jetpack.dir(testDir);
  });

  afterEach(() => {
    if (jetpack.exists(testDir)) {
      jetpack.remove(testDir);
    }
  });

  test('Missing config file throws error', () => {
    expect(() => {
      transform('nonexistent-config.json');
    }).toThrow();
  });

  test('Invalid config structure throws error', () => {
    const invalidConfig = {
      // Missing required transforms property
      "globalPrefix": "test"
    };

    const configPath = `${testDir}/invalid-config.json`;
    jetpack.write(configPath, invalidConfig);

    expect(() => {
      transform(configPath);
    }).toThrow();
  });

  test('Missing token files throws error', () => {
    const configContent = {
      "transforms": [
        {
          "from": "nonexistent-directory",
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/missing-files-config.json`;
    jetpack.write(configPath, configContent);

    expect(() => {
      transform(configPath);
    }).toThrow();
  });

  test('Circular reference detection', () => {
    const tokens = {
      "color": {
        "primary": {"$value": "{color.secondary}"},
        "secondary": {"$value": "{color.primary}"}
      }
    };

    expect(() => {
      flattenJSON(tokens, {}, tokens);
      const flattened = flattenJSON(tokens, {}, tokens);
      findTrueValues({test: flattened});
    }).toThrow('Circular reference detected');
  });

  test('Invalid reference throws error', () => {
    const tokens = {
      "color": {
        "primary": {"$value": "{nonexistent.reference}"}
      }
    };

    expect(() => {
      const flattened = flattenJSON(tokens, {}, tokens);
      findTrueValues({test: flattened});
    }).toThrow('does not exist');
  });

  test('Invalid JSON Pointer reference throws error', () => {
    const tokens = {
      "color": {
        "primary": {
          "$value": {"$ref": "#/nonexistent/path"}
        }
      }
    };

    expect(() => {
      const flattened = flattenJSON(tokens, {}, tokens);
      findTrueValues({test: flattened}, tokens);
    }).toThrow();
  });



  test('Invalid output format throws error', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {"color": {"primary": {"$value": "#000000"}}};
    jetpack.write(`${tokensDir}/tokens.tokens.json`, tokens);

    const configContent = {
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "invalid-format", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/invalid-format-config.json`;
    jetpack.write(configPath, configContent);

    expect(() => {
      transform(configPath);
    }).toThrow();
  });

  test('$value must be string or object', () => {
    const tokens = {
      "invalid": {
        "$value": 123 // Should be string or object
      }
    };

    expect(() => {
      flattenJSON(tokens, {}, tokens);
    }).toThrow('$value properties must be strings or objects');
  });

  test('Invalid group extension syntax is handled', () => {
    const tokens = {
      "semantic": {
        "$extends": "invalid-syntax-no-braces",
        "primary": {"$value": "#000000"}
      }
    };

    // This should not throw but should ignore the invalid extension
    const result = flattenJSON(tokens, {}, {});
    expect(result).toHaveProperty('semantic-primary');
  });

  test('Empty token files are handled gracefully', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    // Create empty token file
    jetpack.write(`${tokensDir}/empty.tokens.json`, {});

    const configContent = {
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "json", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/empty-config.json`;
    jetpack.write(configPath, configContent);

    // Should not throw
    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });
});
