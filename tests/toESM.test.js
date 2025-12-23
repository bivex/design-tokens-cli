/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:09:12
 * Last Updated: 2025-12-23T03:09:15
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { toESM } from "../utils/transformers/toESM.js";

test('Converts tokens to ES modules', () => {
  const tokens = {
    'token-color-1': '#000',
    'token-color-2': '#fff'
  }

  const groupName = 'my-colors';

  const expectedString = `
    export const myColors = {
      'token-color-1': '#000',
      'token-color-2': '#fff'
    }
  `;

  const returnedString = toESM(tokens, groupName, {});
  expect(expectedString.replace(/\s/g, '')).toEqual(returnedString.replace(/\s/g, ''));
});

test('Applies color format conversion when specified', () => {
  const tokens = {
    'background-color': '#ff0000',
    'text-color': 'rgb(0, 255, 0)',
    'border-color': 'hsl(240, 100%, 50%)',
    'font-size': '16px' // Non-color token should remain unchanged
  }

  const groupName = 'my-colors';
  const config = { outputColorFormat: 'hsl' };

  const returnedString = toESM(tokens, groupName, config);

  // Should convert hex and rgb to hsl, leave hsl as-is, and ignore non-colors
  expect(returnedString).toContain("'background-color': 'hsl(0, 100%, 50%)'");
  expect(returnedString).toContain("'text-color': 'hsl(120, 100%, 50%)'");
  expect(returnedString).toContain("'border-color': 'hsl(240, 100%, 50%)'");
  expect(returnedString).toContain("'font-size': '16px'");
});

test('Handles references with keepReferences enabled', () => {
  const tokens = {
    'primary-color': '#ff0000',
    'background-color': '{primary-color}'
  }

  const groupName = 'my-colors';
  const config = { keepReferences: true, outputColorFormat: 'rgb' };

  const returnedString = toESM(tokens, groupName, config);

  // Resolved values should be converted, references should be kept as strings
  expect(returnedString).toContain("'primary-color': 'rgb(255, 0, 0)'");
  expect(returnedString).toContain("'background-color': '{primary-color}'");
});