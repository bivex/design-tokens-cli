/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:09:11
 * Last Updated: 2025-12-23T03:09:11
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { toCustomProps } from "../utils/transformers/toCustomProps.js";

test('Converts tokens to CSS custom properties', () => {
  const tokens = {
    'token-color-1': '#000',
    'token-color-2': '#fff'
  }

  const expectedString = `
    :root {
      --token-color-1: #000;
      --token-color-2: #fff;
    }
  `;

  const returnedString = toCustomProps(tokens, {});
  expect(expectedString.replace(/\s/g, '')).toEqual(returnedString.replace(/\s/g, ''));
});