/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:01
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import jetpack from 'fs-jetpack';
import { findDuplicates } from "./findDuplicates.js";
import { findTrueValues, keepReferences } from "./findTrueValues.js";
import { flattenJSON, resolveGroupExtensions } from './flattenJSON.js';
import { chooseTransform } from './chooseTransform.js';
import { resolveAllJsonPointers, parseJsonPointer, resolveJsonPointer } from './jsonPointer.js';

/**
 * Resolve references within a structured token object
 * @param {Object} obj The token structure to resolve references in
 * @param {Object} globalTokens Global token context for resolution
 */
const resolveReferencesInStructure = (obj, globalTokens) => {
  const resolveValue = (value, visited = new Set()) => {
    if (typeof value === 'string') {
      if (value.startsWith('{')) {
        // Curly brace reference
        const refName = value.slice(1, -1); // Remove { }
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
        throw new Error(`Reference ${value} not found`);
      }
      return value;
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(item => resolveValue(item, visited));
      } else {
        const result = {};
        for (const [key, val] of Object.entries(value)) {
          if (key === '$ref') {
            // JSON Pointer reference
            const pathSegments = parseJsonPointer(val);
            const resolved = resolveJsonPointer(globalTokens, pathSegments);
            if (resolved === undefined) {
              throw new Error(`JSON Pointer reference ${val} not found`);
            }
            return resolved;
          } else {
            result[key] = resolveValue(val, visited);
          }
        }
        return result;
      }
    }
    return value;
  };

  const resolveInObject = (obj) => {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key].$value) {
          // This is a token, resolve its value
          obj[key].$value = resolveValue(obj[key].$value);
        } else {
          // Recurse into nested objects
          resolveInObject(obj[key]);
        }
      }
    }
  };

  resolveInObject(obj);
};

const transform = (configPath, options) => {
  // If no config path argument, look for config file
  if (!configPath) {
    configPath = jetpack.find('./', { matching: 'tokens.config.json' })[0];
  }
  if (!configPath) {
    throw new Error('No config file found in current working directory.');
  }

  // Read the config file as JSON
  const config = jetpack.read(configPath, 'json');

  // First pass: collect all tokens from all transforms into a global set
  const globalTokens = {};
  const transformTokens = {}; // Track which tokens belong to which transform

  // First pass: collect all raw token files for reference resolution
  const rawTokenFiles = {};
  config.transforms.forEach((transform, transformIndex) => {
    let from = jetpack.cwd(transform.from);
    from.find({ matching: ['*.tokens.json', '*.tokens'] }).forEach(path => {
      const json = from.read(path, 'json');
      const fileKey = `${transformIndex}-${path}`;
      rawTokenFiles[fileKey] = json;
    });
  });

  // Build global structured token document for reference resolution
  const globalStructuredTokens = {};
  Object.values(rawTokenFiles).forEach(tokenFile => {
    // Deep merge to handle conflicting top-level keys
    mergeDeep(globalStructuredTokens, tokenFile);
  });

  // Helper function for deep merging
  function mergeDeep(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {};
        }
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  // Resolve group extensions in the global context
  const resolvedGlobalTokens = {};
  Object.keys(globalStructuredTokens).forEach(key => {
    resolvedGlobalTokens[key] = resolveGroupExtensions(globalStructuredTokens[key], globalStructuredTokens);
  });


  // Second pass: process each transform
  config.transforms.forEach((transform, transformIndex) => {
    let from = jetpack.cwd(transform.from);
    let transformTokenSet = {};
    from.find({ matching: ['*.tokens.json', '*.tokens'] }).forEach(path => {
      const fileKey = `${transformIndex}-${path}`;
      const originalJson = rawTokenFiles[fileKey];

      // Resolve group extensions for this file
      const resolvedJson = {};
      Object.keys(originalJson).forEach(key => {
        resolvedJson[key] = resolveGroupExtensions(originalJson[key], resolvedGlobalTokens);
      });

      // Resolve references within the structured tokens
      const resolvedWithRefs = JSON.parse(JSON.stringify(resolvedJson));
      resolveReferencesInStructure(resolvedWithRefs, resolvedGlobalTokens);

      // Flatten the resolved tokens
      let pairs = flattenJSON(resolvedWithRefs, config, resolvedGlobalTokens);
      transformTokenSet[path.split('.')[0]] = pairs;
    });
    transformTokens[transformIndex] = transformTokenSet;
  });

  // Build the root document for JSON Pointer resolution
  // This includes all tokens from all transforms
  const rootDocument = { ...globalTokens };

  // Resolve references globally across all transforms
  let globallyResolvedTokens;
  if (config.keepReferences) {
    // For keepReferences, we still need to maintain per-transform structure
    // but resolve references within the global context
    globallyResolvedTokens = { pairs: globalTokens };
  } else {
    globallyResolvedTokens = { pairs: findTrueValues({ global: globalTokens }, rootDocument) };
  }

  // Check for duplicates in the global token set
  const duplicates = findDuplicates(Object.keys(globallyResolvedTokens.pairs));
  if (duplicates.length) {
    throw new Error(`You have duplicate token names across all transforms: ${duplicates.join(', ')}`);
  }

  // Second pass: generate output for each transform using globally resolved tokens
  config.transforms.forEach((transform, transformIndex) => {
    const transformTokenSet = transformTokens[transformIndex];
    let allTokens = {};

    // Update tokens with globally resolved values
    for (let group in transformTokenSet) {
      allTokens[group] = {};
      Object.keys(transformTokenSet[group]).forEach(token => {
        allTokens[group][token] = globallyResolvedTokens.pairs[token];
      });
    }

    // If the transform has a name, concatenate under name
    if (transform.name) {
      // Collect all tokens from this transform
      let allTransformTokens = {};
      Object.values(transformTokenSet).forEach(fileTokens => {
        Object.assign(allTransformTokens, fileTokens);
      });

      transform.to.forEach(format => {
        let code = chooseTransform(allTransformTokens, format.as, transform.name, config);
        let formatTo = jetpack.cwd(format.to);
        let newPath = `${transform.name}.tokens.${format.as}`;
        formatTo.write(newPath, code);
      });
      return;
    // Otherwise, create separate files after file names
    } else {
      // For each file in the transform, create grouped output
      Object.keys(transformTokenSet).forEach(fileName => {
        const fileTokens = transformTokenSet[fileName];
        
        // Group flattened tokens by their prefix (first part before first dash)
        const groupedTokens = {};
        Object.keys(fileTokens).forEach(tokenKey => {
          const groupName = tokenKey.split('-')[0];
          if (!groupedTokens[groupName]) {
            groupedTokens[groupName] = {};
          }
          groupedTokens[groupName][tokenKey] = fileTokens[tokenKey];
        });

        // Create output files for each group
        Object.keys(groupedTokens).forEach(groupName => {
          transform.to.forEach(format => {
            let code = chooseTransform(groupedTokens[groupName], format.as, groupName, config);
            let formatTo = jetpack.cwd(format.to);
            let newPath = `${groupName}.tokens.${format.as}`;
            formatTo.write(newPath, code);
          });
        });
      });
    }
  });
}

export { transform }