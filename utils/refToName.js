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
 * Convert design token references to design token names
 * @param {String} refString The design tokens reference $value
 * @returns {String} A design token name (kebab case)
 */
const refToName = refString => {
  const cropped = refString.slice(1,-1).trim();
  const kebabbed = cropped.split('.').join('-').split(' ').join('-');
  return kebabbed;
}

export { refToName }