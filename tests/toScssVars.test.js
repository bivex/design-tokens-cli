'use strict';
import { toScssVars } from "../utils/transformers/toScssVars.js";

test('Converts tokens to CSS Sass (scss) variables', () => {
  const tokens = {
    'token-color-1': '#000',
    'token-color-2': '#fff'
  }

  const expectedString = `
    $token-color-1: #000;
    $token-color-2: #fff;
  `;

  const returnedString = toScssVars(tokens, {});
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

  const returnedString = toScssVars(tokens, config);

  // Should convert rgb and hsl to hex, leave hex as-is, and ignore non-colors
  expect(returnedString).toContain('$background-color: #ff0000;');
  expect(returnedString).toContain('$text-color: #00ff00;');
  expect(returnedString).toContain('$border-color: #0000ff;');
  expect(returnedString).toContain('$font-size: 16px;');
});

test('Handles references with keepReferences enabled', () => {
  const tokens = {
    'primary-color': '#ff0000',
    'background-color': '{primary-color}'
  }

  const config = { keepReferences: true, outputColorFormat: 'rgb' };

  const returnedString = toScssVars(tokens, config);

  // Resolved values should be converted, references should become Sass vars
  expect(returnedString).toContain('$primary-color: rgb(255, 0, 0);');
  expect(returnedString).toContain('$background-color: $primary-color;');
});