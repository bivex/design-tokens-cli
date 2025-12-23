import { refToName } from "../refToName.js";

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

    string += `$${prefix}${key}: ${value};\n`;
  });
  return string;
}

export { toScssVars }