#!/usr/bin/env node
/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T03:00:20
 * Last Updated: 2025-12-23T03:33:26
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { program as cli } from 'commander';
import { transform } from './utils/transform.js';

cli.description('Process spec-conforming design tokens JSON');
cli.name('designTokens');
cli.usage("<command>");
cli.addHelpCommand(false);
cli.helpOption(false);

cli
  .command('transform')
  .argument('[configPath]', 'The config file path')
  .action(transform);

cli.parse(process.argv);