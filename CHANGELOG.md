# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-12-23

### Added
- **2025.10 Specification Compliance**: Full implementation of the latest Design Tokens Format specification
  - Group extensions (`$extends`) with JSON Schema $ref semantics for inheritance
  - Root tokens (`$root`) in groups for base values with variants
  - JSON Pointer references (`$ref`) alongside curly brace syntax for advanced property access
  - Type inheritance from groups to tokens
  - Group properties (`$deprecated`, `$extensions`, `$description`)
- **Enhanced Composite Token Support**: Full support for all composite token types (shadow, border, gradient, typography, etc.)
- **Advanced Reference Resolution**: Support for both `{token}` and `$ref` syntaxes with proper resolution order
- **Comprehensive Test Suite**: 15 new test files covering all 2025.10 specification features (93 total tests)
- **JSON Pointer Utilities**: New `jsonPointer.js` module for advanced reference handling
- **Updated Documentation**: Complete guide for 2025.10 specification features and examples

### Changed
- **Reference Resolution Architecture**: Moved from flattened-token resolution to structured-token resolution for better 2025.10 compliance
- **Group Processing**: Enhanced `flattenJSON` and `resolveGroupExtensions` for specification compliance
- **Transform Logic**: Updated to handle new group structures, extensions, and reference types

### Technical Details
- Group extension resolution with deep merge semantics equivalent to JSON Schema $ref
- Root token support with `$root` path construction and referencing
- JSON Pointer parsing and resolution following RFC 6901
- Type inheritance through group hierarchy
- Backward compatibility maintained for existing token files

## [0.2.0] - 2025-12-23

### Added
- **Tailwind CSS Support**: Generate configurations for both Tailwind v3 and v4
  - `tailwind-config` format for Tailwind v3 JavaScript configuration files
  - `tailwind-theme` format for Tailwind v4 CSS @theme directive
  - Automatic token categorization and mapping to Tailwind theme sections
  - Support for nested color tokens (e.g., `color.primary.500`)
  - Integration with `outputColorFormat` for consistent color formats
- **Comprehensive test coverage** for Tailwind transformers (65 total tests)
- **Tailwind transformer modules** (`toTailwindConfig.js` and `toTailwindTheme.js`)
- **Interactive Tailwind demo** (`example/tailwind-demo.html`) with side-by-side v3/v4 examples
- **Updated documentation** with complete Tailwind integration guide

### Changed
- Extended `chooseTransform.js` to support new `tailwind-config` and `tailwind-theme` formats
- Enhanced CLI to support additional output formats

### Technical Details
- Token categorization by naming patterns (color-*, spacing-*, font-size-*, etc.)
- Tailwind v3: Generates JavaScript config with proper theme.extend structure
- Tailwind v4: Generates CSS with @theme directive and kebab-case CSS custom properties
- Supports all major Tailwind theme sections: colors, spacing, typography, borders, shadows, z-index

## [0.1.0] - 2025-12-23

### Added
- **Color Format Conversion**: New `outputColorFormat` configuration option to standardize color token outputs
  - Support for converting colors to `hex`, `rgb`, `hsl`, or `auto` (preserve original) formats
  - Handles transparency with alpha channels (#rrggbbaa, rgba(), hsla())
  - Works across all output formats (CSS, SCSS, JavaScript, JSON)
  - Respects `keepReferences` setting - only converts resolved color values
- **Comprehensive test coverage** for color conversion functionality
- **Color conversion utilities** (`utils/colorConverter.js`) with robust parsing and validation
- **Example color demo** (`example/color-demo.html`) showcasing the new feature
- **Updated documentation** with detailed `outputColorFormat` usage guide

### Changed
- Updated all token transformers to support color format conversion
- Enhanced test suite with color conversion test cases

### Technical Details
- Added `convertColor()` and `isColorToken()` functions
- Color detection by token name patterns and value validation
- Support for hex (#rgb, #rrggbb, #rrggbbaa), rgb/rgba, hsl/hsla formats
- Precise alpha channel handling with proper rounding

## [0.0.7] - 2025-12-23

### Added
- Initial public release
- Support for design tokens JSON format transformation
- Multiple output formats: CSS custom properties, SCSS variables, ES modules, JSON
- Token reference resolution with `keepReferences` option
- Cross-transform reference resolution
- Composite token support
- Global prefix and per-group prefix customization
- Order preservation option
