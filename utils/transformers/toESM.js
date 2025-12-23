import { refToName } from "../refToName.js";

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

    // Quote strings, leave other types as-is
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;
    string += `\t'${prefix}${key}': ${formattedValue}${comma}\n`;
  });
  string += `}`;
  return string;
}

export { toESM }