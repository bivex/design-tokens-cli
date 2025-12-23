/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:20
 * Last Updated: 2025-12-23T04:17:50
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { sortKeys } from './sortKeys.js';

/**
 * Resolve group extensions using JSON Schema $ref semantics
 * @param {Object} tokens The token object
 * @param {Object} allTokens All available tokens for reference resolution
 * @returns {Object} The resolved token object with extensions applied
 */
const resolveGroupExtensions = (tokens, allTokens = {}) => {
  // Deep clone to avoid modifying the original
  const resolved = JSON.parse(JSON.stringify(tokens));

  const resolveExtensions = (obj, path = []) => {
    for (const key in obj) {
      if (key === '$extends') {
        const extendsRef = obj[key];
        // Remove the $extends property after processing
        delete obj[key];

        // Parse reference (support both {group} and JSON Pointer syntax)
        let targetPath;
        if (typeof extendsRef === 'string' && extendsRef.startsWith('{') && extendsRef.endsWith('}')) {
          // Curly brace syntax: {group.name}
          targetPath = extendsRef.slice(1, -1).split('.');
        } else if (typeof extendsRef === 'string') {
          // Assume it's a direct group reference
          targetPath = [extendsRef];
        }

        if (targetPath) {
          // Navigate to the target group
          let targetGroup = allTokens;
          for (const segment of targetPath) {
            if (targetGroup && typeof targetGroup === 'object') {
              targetGroup = targetGroup[segment];
            } else {
              targetGroup = null;
              break;
            }
          }

          if (targetGroup && typeof targetGroup === 'object' && !targetGroup.$value) {
            // Recursively resolve extensions in the target group first
            const resolvedTarget = JSON.parse(JSON.stringify(targetGroup));
            resolveExtensions(resolvedTarget);

            // Apply deep merge: resolved target properties first, then local overrides
            const merged = JSON.parse(JSON.stringify(resolvedTarget));
            deepMerge(merged, obj);
            Object.assign(obj, merged);
          }
        }
      } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        resolveExtensions(obj[key], [...path, key]);
      }
    }
  };

  resolveExtensions(resolved);
  return resolved;
};

/**
 * Deep merge utility for group extension resolution
 * @param {Object} target Target object
 * @param {Object} source Source object
 */
const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
};

/**
 * Extract type from a group or its ancestors
 * @param {Object} obj The object to check for type
 * @param {string[]} currentPath Current path in the object
 * @returns {string|null} The inherited type or null
 */
const getInheritedType = (obj, currentPath = []) => {
  // Check current object's $type
  if (obj.$type) {
    return obj.$type;
  }

  // Walk up the path to find inherited type
  for (let i = currentPath.length - 1; i >= 0; i--) {
    // This is a simplified version - in practice we'd need to track the full object hierarchy
    // For now, we'll handle this during the traversal
  }

  return null;
};

/**
 * Create a simple object of design token name/value pairs from sped-adhering design tokens JSON
 * @param {Array} tokens A standard design tokens object (JSON))
 * @param {Object} config Configuration object
 * @param {Object} allTokens All available tokens for reference resolution
 * @returns {Object} of token names and values
 */
const flattenJSON = (tokens, config = {}, allTokens = {}) => {
  // First resolve group extensions
  const resolvedTokens = resolveGroupExtensions(tokens, allTokens);

  const existingObjects = [];
  const path = [];
  const groupTypes = new Map(); // Track inherited types by path
  const tokensArrays = [];

  (function find(tokens, inheritedType = null) {
    // Update inherited type if this group has its own type
    const currentType = tokens.$type || inheritedType;
    const currentPath = path.join('.');

    for (const key of Object.keys(tokens)) {
      // Handle group properties
      if (key === '$type') {
        // Track type inheritance
        groupTypes.set(currentPath, tokens[key]);
        continue;
      }
      if (key === '$description' || key === '$extends' ||
          key === '$deprecated' || key === '$extensions') {
        // Skip other group properties - they don't become tokens
        continue;
      }

      if (key === '$value') {
        if (typeof tokens[key] === 'string') {
          path.push(tokens[key]);
          tokensArrays.push([...path]);
          path.pop();
        } else if (typeof tokens[key] === 'object') {
          let $values = tokens[key];
          // If token doesn't have explicit type but group has one, inherit it
          if (!$values.$type && currentType) {
            $values = { ...$values, $type: currentType };
          }
          for (const subKey in $values) {
            let pathCopy = [...path];
            pathCopy.push(subKey);
            pathCopy.push($values[subKey]);
            tokensArrays.push([...pathCopy]);
          }
        } else {
          throw new Error(`$value properties must be strings or objects.`);
        }
      } else if (key === '$root' && tokens[key] && typeof tokens[key] === 'object' && tokens[key].$value) {
        // Handle $root tokens - treat as if the key is the parent group name
        const rootValue = tokens[key].$value;
        if (typeof rootValue === 'string') {
          // For root tokens, use the group name as the key
          const groupName = path[path.length - 1];
          if (groupName) {
            path.push(groupName);
            path.push(rootValue);
            tokensArrays.push([...path]);
            path.pop();
            path.pop();
          }
        } else if (typeof rootValue === 'object') {
          // Handle composite root tokens
          const groupName = path[path.length - 1];
          if (groupName) {
            for (const subKey in rootValue) {
              let pathCopy = [...path];
              pathCopy.push(groupName);
              pathCopy.push(subKey);
              pathCopy.push(rootValue[subKey]);
              tokensArrays.push([...pathCopy]);
            }
          }
        }
      }
      const o = tokens[key];
      if (o && typeof o === "object" && !Array.isArray(o)) {
        if (!existingObjects.find(tokens => tokens === o)) {
          path.push(key);
          existingObjects.push(o);
          find(o, currentType);
          path.pop();
        }
      }
    }
  }(resolvedTokens));
  const newObject = {};
  tokensArrays.forEach(arr => {
    const keys = arr.slice(0, -1).map(k => {
      return k.split(' ').join('-');
    });

    // Apply configurable prefixes for group names
    let finalKeys = [...keys];
    if (keys.length >= 2 && config.prefixes && config.prefixes[keys[0]] !== undefined) {
      const groupName = keys[0];
      const tokenName = keys[1];
      const customPrefix = config.prefixes[groupName];

      // Replace the first two keys with the custom prefix + token name
      if (customPrefix === "") {
        // Empty prefix means no group prefix at all
        finalKeys = [tokenName, ...keys.slice(2)];
      } else {
        // Custom prefix
        finalKeys = [customPrefix + tokenName, ...keys.slice(2)];
      }
    }

    const key = finalKeys.join('-');
    const value = arr.at(-1);
    newObject[key] = value;
  });

  // Preserve input order unless explicitly set to sort alphabetically
  // Use preserveOrder (default true) or sortTokens (legacy) config options
  const shouldSort = config.sortTokens === true || config.preserveOrder === false;
  return shouldSort ? sortKeys(newObject) : newObject; 
}

export { flattenJSON, resolveGroupExtensions }