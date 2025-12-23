import { refToName } from "./refToName.js";

/**
 * Searches through chained references to replace reference with originating value
 * @param {Object} pairs The flattened token key/value pairs
 * @returns {Object}
 */
const findTrueValues = groups => {
  const newGroups = JSON.parse(JSON.stringify(groups));
  let justPairs = {};
  Object.keys(newGroups).forEach(group => {
    Object.assign(justPairs, newGroups[group]);
  });
  for (const pair in justPairs) {
    let val = justPairs[pair];
    while (val.startsWith('{')) {
      let name = refToName(justPairs[pair]);
      if (!justPairs[name]) {
        throw new Error(`The token reference name '${name}' does not exist.`);
      }
      val = justPairs[name];
    }
    justPairs[pair] = val;
  }
  return justPairs;
}

/**
 * Keeps references as variable references instead of resolving to values
 * @param {Object} groups The grouped token pairs
 * @param {Object} config The configuration object
 * @returns {Object} Object with ordered pairs and dependency info
 */
const keepReferences = groups => {
  const newGroups = JSON.parse(JSON.stringify(groups));
  let justPairs = {};
  Object.keys(newGroups).forEach(group => {
    Object.assign(justPairs, newGroups[group]);
  });

  // Build dependency graph
  const dependencies = {};
  const dependents = {};

  Object.keys(justPairs).forEach(token => {
    dependencies[token] = [];
    dependents[token] = [];
  });

  // Find all references
  Object.keys(justPairs).forEach(token => {
    const value = justPairs[token];
    if (typeof value === 'string' && value.startsWith('{')) {
      const refName = refToName(value);
      if (!justPairs[refName]) {
        throw new Error(`The token reference name '${refName}' does not exist.`);
      }
      dependencies[token].push(refName);
      dependents[refName].push(token);
    }
  });

  // Topological sort to resolve dependencies
  const visited = new Set();
  const tempVisited = new Set();
  const orderedTokens = [];

  const visit = (token) => {
    if (tempVisited.has(token)) {
      throw new Error(`Circular reference detected involving token '${token}'`);
    }
    if (visited.has(token)) {
      return;
    }

    tempVisited.add(token);

    // Visit all dependencies first
    dependencies[token].forEach(dep => visit(dep));

    tempVisited.delete(token);
    visited.add(token);
    orderedTokens.push(token);
  };

  // Visit all tokens
  Object.keys(justPairs).forEach(token => {
    if (!visited.has(token)) {
      visit(token);
    }
  });

  // Convert references to variable syntax for each format
  const result = {};
  orderedTokens.forEach(token => {
    result[token] = justPairs[token];
  });

  return {
    pairs: result,
    orderedTokens,
    dependencies,
    dependents
  };
}

export { findTrueValues, keepReferences }
