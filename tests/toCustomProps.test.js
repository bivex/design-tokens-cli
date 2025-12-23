/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:09:11
 * Last Updated: 2025-12-23T03:33:26
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

test('Applies color format conversion when specified', () => {
  const tokens = {
    'background-color': '#ff0000',
    'text-color': 'rgb(0, 255, 0)',
    'border-color': 'hsl(240, 100%, 50%)',
    'font-size': '16px' // Non-color token should remain unchanged
  }

  const config = { outputColorFormat: 'rgb' };

  const returnedString = toCustomProps(tokens, config);

  // Should convert hex and hsl to rgb, leave rgb as-is, and ignore non-colors
  expect(returnedString).toContain('--background-color: rgb(255, 0, 0);');
  expect(returnedString).toContain('--text-color: rgb(0, 255, 0);');
  expect(returnedString).toContain('--border-color: rgb(0, 0, 255);');
  expect(returnedString).toContain('--font-size: 16px;');
});

test('Does not apply color conversion when format is auto', () => {
  const tokens = {
    'background-color': '#ff0000'
  }

  const config = { outputColorFormat: 'auto' };

  const returnedString = toCustomProps(tokens, config);

  expect(returnedString).toContain('--background-color: #ff0000;');
});

test('Handles references with keepReferences enabled', () => {
  const tokens = {
    'primary-color': '#ff0000',
    'background-color': '{primary-color}'
  }

  const config = { keepReferences: true, outputColorFormat: 'rgb' };

  const returnedString = toCustomProps(tokens, config);

  // Resolved values should be converted, references should become CSS vars
  expect(returnedString).toContain('--primary-color: rgb(255, 0, 0);');
  expect(returnedString).toContain('--background-color: var(--primary-color);');
});