/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:06:29
 * Last Updated: 2025-12-23T03:06:29
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use strict';
import { refToName } from "../utils/refToName.js";

test('Converts a reference string to a real token name.', () => {
  const ref = '{ color.gray scale.0 }';

  const converted = refToName(ref);
  expect(converted).toBe('color-gray-scale-0');
});