/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:20
 * Last Updated: 2025-12-23T03:06:20
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { sortKeys } from './sortKeys.js';

/**
 * Create a simple object of design token name/value pairs from sped-adhering design tokens JSON
 * @param {Array} tokens A standard design tokens object (JSON))
 * @param {Object} config Configuration object
 * @returns {Object} of token names and values
 */
const flattenJSON = (tokens, config = {}) => {
  const existingObjects = [];
  const path = [];
  const tokensArrays = [];
  (function find(tokens) {
    for (const key of Object.keys(tokens)) {
      if (key === '$value') {
        if (typeof tokens[key] === 'string') {
          path.push(tokens[key]);
          tokensArrays.push([...path]);
          path.pop();
        } else if (typeof tokens[key] === 'object') {
          let $values = tokens[key];
          for (const key in $values) {
            let pathCopy = [...path];
            pathCopy.push(key);
            pathCopy.push($values[key]);
            tokensArrays.push([...pathCopy]);
          }
        } else {
          throw new Error(`$value properties must be strings or objects.`);
        }
      }
      const o = tokens[key];
      if (o && typeof o === "object" && !Array.isArray(o)) {
        if (!existingObjects.find(tokens => tokens === o)) {
          path.push(key);
          existingObjects.push(o);
          find(o);
          path.pop();
        }
      }
    }
  }(tokens));
  const newObject = {};
  tokensArrays.forEach(arr => {
    const keys = arr.slice(0, -1).map(k => {
      return k.split(' ').join('-');
    });
    const key = keys.join('-');
    const value = arr.at(-1);
    newObject[key] = value;
  });

  // Preserve input order unless explicitly set to sort alphabetically
  // Use preserveOrder (default true) or sortTokens (legacy) config options
  const shouldSort = config.sortTokens === true || config.preserveOrder === false;
  return shouldSort ? sortKeys(newObject) : newObject; 
}

export { flattenJSON }