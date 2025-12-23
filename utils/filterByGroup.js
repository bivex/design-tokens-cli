/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:06:29
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Filter an object of token key/values by the group name
 * @param {Object} tokens The starting object (one level of key/value pairs only)
 * @returns {Object}
 */
const filterByGroup = (tokens, groupName) => {
  let filtered = Object.keys(tokens)
    .filter(key => key.startsWith(groupName))
    .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: tokens[key]
        });
    }, {});
  return filtered;
}

export { filterByGroup }