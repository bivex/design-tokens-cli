/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:18:28
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { refToName } from "../refToName.js";
import { convertColor, isColorToken } from "../colorConverter.js";

/**
 * Convert an object of design token name/value pairs into CSS custom Properties
 * @param {Object} tokensObject
 * @param {Object} config
 * @param {boolean} includeRoot
 * @returns {String}
 */
const toCustomProps = (tokensObject, config, includeRoot = true) => {
  const prefix = config.globalPrefix ? `${config.globalPrefix}-` : '';
  let string = '';
  if (includeRoot) string += ':root {\n';

  Object.keys(tokensObject).forEach(key => {
    if (includeRoot) string += ' ';
    let value = tokensObject[key];

    // Convert token references to CSS var() syntax if keepReferences is enabled
    if (config.keepReferences && typeof value === 'string' && value.startsWith('{')) {
      const refName = refToName(value);
      value = `var(--${prefix}${refName})`;
    }
    // Apply color format conversion if specified and token is a color (but not a reference)
    else if (config.outputColorFormat && config.outputColorFormat !== 'auto' && isColorToken(key, value)) {
      value = convertColor(value, config.outputColorFormat);
    }

    // Special handling for composite color tokens - only output the hex value for the main variable
    // Skip the other properties (colorSpace, components, alpha) to avoid cluttering CSS
    if (key.includes('-hex') && key.includes('$type') === false) {
      // This is a hex property of a color token, use the simplified name
      const colorName = key.replace(/-hex$/, '');
      string += `\t--${prefix}${colorName}: ${value};\n`;
    } else if (!key.includes('-colorSpace') && !key.includes('-components') && !key.includes('-alpha') && !key.includes('-$type')) {
      // Only output non-color-component properties and non-type properties
      string += `\t--${prefix}${key}: ${value};\n`;
    }
  });
  if (includeRoot) string += '}\n';
  return string;
}

export { toCustomProps }