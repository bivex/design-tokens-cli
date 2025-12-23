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

/**
 * Parse a JSON Pointer string into path segments
 * @param {string} pointer JSON Pointer string (e.g., "#/group/token/$value")
 * @returns {string[]} Array of path segments
 */
const parseJsonPointer = (pointer) => {
  if (!pointer || !pointer.startsWith('#/')) {
    return [];
  }

  const path = pointer.slice(2); // Remove #/
  if (path === '') {
    return [];
  }

  return path.split('/').map(segment => {
    // Unescape JSON Pointer special characters
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
  });
};

/**
 * Resolve a JSON Pointer path against a document
 * @param {Object} document The document to resolve against
 * @param {string[]} pathSegments Path segments from parseJsonPointer
 * @returns {*} The resolved value or undefined if not found
 */
const resolveJsonPointer = (document, pathSegments) => {
  let current = document;

  for (const segment of pathSegments) {
    if (current === null || current === undefined) {
      return undefined;
    }

    // Handle array indices
    if (Array.isArray(current) && /^\d+$/.test(segment)) {
      const index = parseInt(segment, 10);
      if (index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return undefined;
      }
    } else if (typeof current === 'object' && current !== null) {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  return current;
};

/**
 * Check if a value is a JSON Pointer reference
 * @param {*} value The value to check
 * @returns {boolean} True if the value is a JSON Pointer reference
 */
const isJsonPointerRef = (value) => {
  return typeof value === 'string' && value.startsWith('#/');
};

/**
 * Resolve all JSON Pointer references in an object recursively
 * @param {Object} obj The object to resolve references in
 * @param {Object} rootDocument The root document for resolving references
 * @param {Set} resolving Optional set to track circular references
 * @returns {Object} Object with references resolved
 */
const resolveAllJsonPointers = (obj, rootDocument, resolving = new Set()) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveAllJsonPointers(item, rootDocument, resolving));
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && isJsonPointerRef(value)) {
      // Check for circular references
      if (resolving.has(value)) {
        throw new Error(`Circular reference detected: ${value}`);
      }

      const pathSegments = parseJsonPointer(value);
      const resolved = resolveJsonPointer(rootDocument, pathSegments);

      if (resolved === undefined) {
        throw new Error(`JSON Pointer reference not found: ${value}`);
      }

      // Resolve any nested references in the resolved value
      resolving.add(value);
      try {
        result[key] = resolveAllJsonPointers(resolved, rootDocument, resolving);
      } finally {
        resolving.delete(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = resolveAllJsonPointers(value, rootDocument, resolving);
    } else {
      result[key] = value;
    }
  }

  return result;
};

export { parseJsonPointer, resolveJsonPointer, isJsonPointerRef, resolveAllJsonPointers };
