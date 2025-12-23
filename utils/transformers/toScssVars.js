/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:22:28
 * Last Updated: 2025-12-23T03:22:28
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { refToName } from "../refToName.js";
import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert an object of design token name/value pairs into Scss (Sass) variables
 * @param {Object} tokensObject
 * @param {Object} config
 * @returns {String}
 */
const toScssVars = (tokensObject, config) => {
  const prefix = config.globalPrefix ? `${config.globalPrefix}-` : '';
  let string = '';

  // If keeping references, we need to ensure proper ordering
  // The tokens should already be ordered by the keepReferences function
  Object.keys(tokensObject).forEach(key => {
    let value = tokensObject[key];

    // Convert token references to Sass variable syntax if keepReferences is enabled
    if (config.keepReferences && typeof value === 'string' && value.startsWith('{')) {
      const refName = refToName(value);
      value = `$${prefix}${refName}`;
    }
    // Apply color format conversion if specified and token is a color (but not a reference)
    else if (config.outputColorFormat && config.outputColorFormat !== 'auto' && isColorToken(key, value)) {
      value = convertColor(value, config.outputColorFormat);
    }

    string += `$${prefix}${key}: ${value};\n`;
  });
  return string;
}

export { toScssVars }