/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:01
 * Last Updated: 2025-12-23T03:09:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import jetpack from 'fs-jetpack';
import { findDuplicates } from "./findDuplicates.js";
import { findTrueValues, keepReferences } from "./findTrueValues.js";
import { flattenJSON } from './flattenJSON.js';
import { chooseTransform } from './chooseTransform.js';

const transform = (configPath, options) => {
  // If no config path argument, look for config file
  if (!configPath) {
    configPath = jetpack.find('./', { matching: 'tokens.config.json' })[0];
  }
  if (!configPath) {
    throw new Error('No config file found in current working directory.');
  }

  // Read the config file as JSON
  const config = jetpack.read(configPath, 'json');

  // First pass: collect all tokens from all transforms into a global set
  const globalTokens = {};
  const transformTokens = {}; // Track which tokens belong to which transform

  config.transforms.forEach((transform, transformIndex) => {
    let from = jetpack.cwd(transform.from);
    let transformTokenSet = {};
    from.find({ matching: ['*.tokens.json', '*.tokens'] }).forEach(path => {
      const json = from.read(path, 'json');
      let pairs = flattenJSON(json, config);
      transformTokenSet[path.split('.')[0]] = pairs;

      // Add to global tokens for cross-transform reference resolution
      Object.assign(globalTokens, pairs);
    });
    transformTokens[transformIndex] = transformTokenSet;
  });

  // Resolve references globally across all transforms
  let globallyResolvedTokens;
  if (config.keepReferences) {
    // For keepReferences, we still need to maintain per-transform structure
    // but resolve references within the global context
    globallyResolvedTokens = { pairs: globalTokens };
  } else {
    globallyResolvedTokens = { pairs: findTrueValues({ global: globalTokens }) };
  }

  // Check for duplicates in the global token set
  const duplicates = findDuplicates(Object.keys(globallyResolvedTokens.pairs));
  if (duplicates.length) {
    throw new Error(`You have duplicate token names across all transforms: ${duplicates.join(', ')}`);
  }

  // Second pass: generate output for each transform using globally resolved tokens
  config.transforms.forEach((transform, transformIndex) => {
    const transformTokenSet = transformTokens[transformIndex];
    let allTokens = {};

    // Update tokens with globally resolved values
    for (let group in transformTokenSet) {
      allTokens[group] = {};
      Object.keys(transformTokenSet[group]).forEach(token => {
        allTokens[group][token] = globallyResolvedTokens.pairs[token];
      });
    }

    // If the transform has a name, concatenate under name
    if (transform.name) {
      transform.to.forEach(format => {
        let code = chooseTransform(globallyResolvedTokens.pairs, format.as, transform.name, config);
        let formatTo = jetpack.cwd(format.to);
        let newPath = `${transform.name}.tokens.${format.as}`;
        formatTo.write(newPath, code);
      });
      return;
    // Otherwise, create separate files after file names
    } else {
      for (let group in allTokens) {
        transform.to.forEach(format => {
          let code = chooseTransform(allTokens[group], format.as, group, config);
          let formatTo = jetpack.cwd(format.to);
          let newPath = `${group}.tokens.${format.as}`;
          formatTo.write(newPath, code);
        });
      }
    }
  });
}

export { transform }