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
import { sortKeys } from "../utils/sortKeys.js";

test('Sorts an object\'s keys alphabetically', () => {
  const object = {
    b: true,
    c: true,
    z: true,
    a: true
  }

  const sorted = sortKeys(object);
  expect(Object.keys(sorted)[0]).toBe('a');
});