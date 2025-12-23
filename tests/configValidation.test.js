/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:27
 * Last Updated: 2025-12-23T04:35:53
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';

import { transform } from '../utils/transform.js';
import jetpack from 'fs-jetpack';

const testDir = 'test-config-output';

describe('Configuration Validation Tests', () => {
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

  test('Minimal valid configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {"color": {"primary": {"$value": "#000"}}};
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "json", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Global prefix configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {"color": {"primary": {"$value": "#000"}}};
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "globalPrefix": "my-prefix",
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Empty global prefix works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {"color": {"primary": {"$value": "#000"}}};
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "globalPrefix": "",
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Preserve order configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {
      "z": {"last": {"$value": "#000"}},
      "a": {"first": {"$value": "#fff"}}
    };
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "preserveOrder": true,
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "json", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Sort tokens configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {
      "z": {"last": {"$value": "#000"}},
      "a": {"first": {"$value": "#fff"}}
    };
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "preserveOrder": false, // This should sort alphabetically
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "json", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Prefixes configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {
      "colors": {"primary": {"$value": "#000"}},
      "spacing": {"small": {"$value": "8px"}},
      "typography": {"body": {"$value": "16px"}}
    };
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "prefixes": {
        "colors": "brand",
        "spacing": "",
        "typography": "text"
      },
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Keep references configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {
      "color": {
        "primary": {"$value": "#000"},
        "secondary": {"$value": "{color.primary}"}
      }
    };
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "keepReferences": true,
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Output color format configuration works', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {
      "color": {
        "primary": {"$value": "#ff6b35"}
      }
    };
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "outputColorFormat": "rgb",
      "transforms": [
        {
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Multiple transforms in configuration work', () => {
    const tokens1Dir = `${testDir}/tokens1`;
    const tokens2Dir = `${testDir}/tokens2`;
    jetpack.dir(tokens1Dir);
    jetpack.dir(tokens2Dir);

    const tokens1 = {"color": {"primary": {"$value": "#000"}}};
    const tokens2 = {"spacing": {"small": {"$value": "8px"}}};

    jetpack.write(`${tokens1Dir}/test1.tokens.json`, tokens1);
    jetpack.write(`${tokens2Dir}/test2.tokens.json`, tokens2);

    const config = {
      "transforms": [
        {
          "from": tokens1Dir,
          "to": [{"as": "json", "to": `${testDir}/output1`}]
        },
        {
          "from": tokens2Dir,
          "to": [{"as": "json", "to": `${testDir}/output2`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });

  test('Named transforms work correctly', () => {
    const tokensDir = `${testDir}/tokens`;
    jetpack.dir(tokensDir);

    const tokens = {"color": {"primary": {"$value": "#000"}}};
    jetpack.write(`${tokensDir}/test.tokens.json`, tokens);

    const config = {
      "transforms": [
        {
          "name": "my-system",
          "from": tokensDir,
          "to": [{"as": "css", "to": `${testDir}/output`}]
        }
      ]
    };

    const configPath = `${testDir}/config.json`;
    jetpack.write(configPath, config);

    expect(() => {
      transform(configPath);
    }).not.toThrow();
  });
});
