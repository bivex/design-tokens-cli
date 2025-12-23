/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:22:24
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert an object of design token name/value pairs into JSON (pass through, basically)
 * @param {Object} tokensObject
 * @param {Object} config
 * @returns {String}
 */
 const toJSON = (tokensObject, config) => {
  // Apply color format conversion if specified
  if (config.outputColorFormat && config.outputColorFormat !== 'auto') {
    tokensObject = Object.fromEntries(
      Object.entries(tokensObject).map(([key, value]) => {
        if (isColorToken(key, value)) {
          return [key, convertColor(value, config.outputColorFormat)];
        }
        return [key, value];
      })
    );
  }

  if (config.globalPrefix) {
    tokensObject = Object.fromEntries(
      Object.entries(tokensObject).map(([k, v]) => [`${config.globalPrefix}-${k}`, v])
    )
  }
  return JSON.stringify(tokensObject, undefined, '\t');
}

export { toJSON }