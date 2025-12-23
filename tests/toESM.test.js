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