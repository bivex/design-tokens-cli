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
 * Convert an object of design token name/value pairs into JSON (pass through, basically)
 * @param {Object} tokensObject 
 * @returns {String}
 */
 const toJSON = (tokensObject, config) => {
  if (config.globalPrefix) {
    tokensObject = Object.fromEntries(
      Object.entries(tokensObject).map(([k, v]) => [`${config.globalPrefix}-${k}`, v])
    )
  }
  return JSON.stringify(tokensObject, undefined, '\t');
}

export { toJSON }