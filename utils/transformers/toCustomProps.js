import { refToName } from "../refToName.js";

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

    string += `\t--${prefix}${key}: ${value};\n`;
  });
  if (includeRoot) string += '}\n';
  return string;
}

export { toCustomProps }