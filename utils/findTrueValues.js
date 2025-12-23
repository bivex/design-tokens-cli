/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:33:26
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { refToName } from "./refToName.js";
import { resolveAllJsonPointers, isJsonPointerRef, parseJsonPointer, resolveJsonPointer } from "./jsonPointer.js";

/**
 * Searches through chained references to replace reference with originating value
 * @param {Object} groups The flattened token key/value pairs
 * @param {Object} rootDocument The root document for JSON Pointer resolution
 * @returns {Object}
 */
const findTrueValues = (groups, rootDocument = null) => {
  const newGroups = JSON.parse(JSON.stringify(groups));
  let justPairs = {};
  Object.keys(newGroups).forEach(group => {
    Object.assign(justPairs, newGroups[group]);
  });

  // Resolve references in a specific order:
  // 1. First resolve JSON Pointer references within the token values themselves
  // 2. Then resolve curly brace references

  const resolveValue = (value, visited = new Set()) => {
    if (typeof value === 'string') {
      if (value.startsWith('{')) {
        const refName = refToName(value);
        if (!justPairs[refName]) {
          console.log('Available tokens:', Object.keys(justPairs));
          throw new Error(`The token reference name '${refName}' does not exist.`);
        }
        if (visited.has(refName)) {
          throw new Error(`Circular reference detected: ${refName}`);
        }
        visited.add(refName);
        return resolveValue(justPairs[refName], visited);
      }
      return value;
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(item => resolveValue(item, visited));
      } else {
        const result = {};
        for (const [key, val] of Object.entries(value)) {
          if (key === '$ref' && isJsonPointerRef(val)) {
            // Resolve JSON Pointer reference
            const pathSegments = parseJsonPointer(val);
            const resolved = resolveJsonPointer(rootDocument, pathSegments);
            if (resolved === undefined) {
              throw new Error(`JSON Pointer reference not found: ${val}`);
            }
            return resolveValue(resolved, visited);
          } else {
            result[key] = resolveValue(val, visited);
          }
        }
        return result;
      }
    }
    return value;
  };

  // Resolve all references in the token values
  for (const pair in justPairs) {
    justPairs[pair] = resolveValue(justPairs[pair]);
  }

  return justPairs;
}

/**
 * Keeps references as variable references instead of resolving to values
 * @param {Object} groups The grouped token pairs
 * @param {Object} config The configuration object
 * @param {Object} rootDocument The root document for JSON Pointer resolution
 * @returns {Object} Object with ordered pairs and dependency info
 */
const keepReferences = (groups, rootDocument = null) => {
  const newGroups = JSON.parse(JSON.stringify(groups));
  let justPairs = {};
  Object.keys(newGroups).forEach(group => {
    Object.assign(justPairs, newGroups[group]);
  });

  // Build dependency graph
  const dependencies = {};
  const dependents = {};

  Object.keys(justPairs).forEach(token => {
    dependencies[token] = [];
    dependents[token] = [];
  });

  // Find all references (both curly brace and JSON Pointer)
  Object.keys(justPairs).forEach(token => {
    const value = justPairs[token];
    if (typeof value === 'string' && value.startsWith('{')) {
      const refName = refToName(value);
      if (!justPairs[refName]) {
        throw new Error(`The token reference name '${refName}' does not exist.`);
      }
      dependencies[token].push(refName);
      dependents[refName].push(token);
    }
    // Note: JSON Pointer references in $ref properties are handled differently
    // and don't create the same dependency relationships as curly brace references
  });

  // Topological sort to resolve dependencies
  const visited = new Set();
  const tempVisited = new Set();
  const orderedTokens = [];

  const visit = (token) => {
    if (tempVisited.has(token)) {
      throw new Error(`Circular reference detected involving token '${token}'`);
    }
    if (visited.has(token)) {
      return;
    }

    tempVisited.add(token);

    // Visit all dependencies first
    dependencies[token].forEach(dep => visit(dep));

    tempVisited.delete(token);
    visited.add(token);
    orderedTokens.push(token);
  };

  // Visit all tokens
  Object.keys(justPairs).forEach(token => {
    if (!visited.has(token)) {
      visit(token);
    }
  });

  // Convert references to variable syntax for each format
  const result = {};
  orderedTokens.forEach(token => {
    result[token] = justPairs[token];
  });

  return {
    pairs: result,
    orderedTokens,
    dependencies,
    dependents
  };
}

export { findTrueValues, keepReferences }
