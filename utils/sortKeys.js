/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Sort a shallow object alphabetically by key
 * @param {Object} object A shallow object to be sorted alphabetically, by key 
 * @returns {Object} 
 */
const sortKeys = object => {
  return Object.keys(object)
    .sort()
    .reduce((acc, key) => ({
        ...acc, [key]: object[key]
    }), {});
}

export { sortKeys }