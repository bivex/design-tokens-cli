/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { filterByGroup } from '../utils/filterByGroup.js';

test('Filters tokens key/value pairs by group name', () => {
  const tokens = {
    "color-token-1": "#000",
    "color-token-2": "#fff",
    "size-token-1": "1em",
    "size-token-2": "2em"
  }

  const filtered = filterByGroup(tokens, 'color');
  expect(Object.keys(filtered).length).toEqual(2);
});