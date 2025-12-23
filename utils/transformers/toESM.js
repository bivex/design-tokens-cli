/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:22:29
 * Last Updated: 2025-12-23T03:22:29
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { refToName } from "../refToName.js";
import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert an object of design token name/value pairs into an ES module
 * @param {Object} tokensObject
 * @param {String} groupName
 * @param {Object} config
 * @returns {String}
 */
const toESM = (tokensObject, groupName, config) => {
  const prefix = config.globalPrefix ? `${config.globalPrefix}-` : '';
  groupName = groupName.replace(/-./g, x=>x[1].toUpperCase());
  const keys = Object.keys(tokensObject);
  let string = '';
  string += `export const ${groupName} = {\n`;
  keys.forEach(key => {
    let comma = (keys.indexOf(key) + 1) === keys.length ? '' : ',';
    let value = tokensObject[key];

    // Handle references when keepReferences is enabled
    if (config.keepReferences && typeof value === 'string' && value.startsWith('{')) {
      const refName = refToName(value);
      // For JS, we'll keep the reference as a string that indicates the variable name
      // This can be resolved by consumers of the module
      value = `{${refName}}`;
    }
    // Apply color format conversion if specified and token is a color (but not a reference)
    else if (config.outputColorFormat && config.outputColorFormat !== 'auto' && isColorToken(key, value)) {
      value = convertColor(value, config.outputColorFormat);
    }

    // Quote strings, leave other types as-is, and escape single quotes
    const formattedValue = typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : value;
    string += `\t'${prefix}${key}': ${formattedValue}${comma}\n`;
  });
  string += `}`;
  return string;
}

export { toESM }