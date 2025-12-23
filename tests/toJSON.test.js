/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:22:25
 * Last Updated: 2025-12-23T03:22:25
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { toJSON } from "../utils/transformers/toJSON.js";

test('Converts tokens to (flat) JSON', () => {
  const tokens = {
    "token-color-1": "#000",
    "token-color-2": "#fff"
  }

  const expectedString = `
    {
      "token-color-1": "#000",
      "token-color-2": "#fff"
    }
  `;

  const returnedString = toJSON(tokens, {});
  expect(expectedString.replace(/\s/g, '')).toEqual(returnedString.replace(/\s/g, ''));
});

test('Applies color format conversion when specified', () => {
  const tokens = {
    'background-color': '#ff0000',
    'text-color': 'rgb(0, 255, 0)',
    'border-color': 'hsl(240, 100%, 50%)',
    'font-size': '16px' // Non-color token should remain unchanged
  }

  const config = { outputColorFormat: 'hex' };

  const returnedString = toJSON(tokens, config);
  const parsed = JSON.parse(returnedString);

  // Should convert rgb and hsl to hex, leave hex as-is, and ignore non-colors
  expect(parsed['background-color']).toBe('#ff0000');
  expect(parsed['text-color']).toBe('#00ff00');
  expect(parsed['border-color']).toBe('#0000ff');
  expect(parsed['font-size']).toBe('16px');
});

test('Works with globalPrefix', () => {
  const tokens = {
    'background-color': '#ff0000',
    'font-size': '16px'
  }

  const config = { globalPrefix: 'my-app', outputColorFormat: 'rgb' };

  const returnedString = toJSON(tokens, config);
  const parsed = JSON.parse(returnedString);

  // Should apply both globalPrefix and color conversion
  expect(parsed['my-app-background-color']).toBe('rgb(255, 0, 0)');
  expect(parsed['my-app-font-size']).toBe('16px');
});