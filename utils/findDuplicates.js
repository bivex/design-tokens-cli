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
 * Finds duplicates in an array
 * @param {Array} arr The starting array
 * @returns {Array}
 */
const findDuplicates = arr => {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}

export { findDuplicates }