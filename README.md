# Design Tokens CLI

A design-tokens-format-adhering token transformation CLI (Command Line Interface) implementing the [2025.10 Design Tokens Format specification](https://www.designtokens.org/TR/2025.10/format/).

## Supports

### Format Compliance
- [x] **2025.10 Specification**: Full compliance with the latest Design Tokens Format
- [x] Converting from design tokens in the [standard JSON format](https://design-tokens.github.io/community-group/format/)...
- [x] ...to CSS (custom properties)
- [x] ...to Sass (scss) variables
- [x] ...to ES modules
- [x] ...to JSON (flattened to name/value pairs)
- [x] ...to Tailwind CSS v3 configuration (JavaScript)
- [x] ...to Tailwind CSS v4 @theme directive (CSS)

### Core Features
- [x] (Chained) token reference resolution
- [x] **Keeping references as variable references** (optional)
- [x] Reference resolution _between_ separate tokens files in one transform
- [x] Reference resolution _between_ separate tokens _between_ separate transforms
- [x] Composite tokens (`$value`s as objects)
- [x] `*.tokens.json` and `*.tokens` file types
- [x] Concatenation of separate token files under a single name

### 2025.10 Specification Features
- [x] **Group Extensions**: `$extends` property for group inheritance with deep merge semantics
- [x] **Root Tokens**: `$root` tokens in groups for base values with variants
- [x] **JSON Pointer References**: `$ref` syntax alongside `{token}` references for advanced property access
- [x] **Type Inheritance**: Automatic type inheritance from groups to tokens
- [x] **Group Properties**: `$deprecated`, `$extensions`, and other group-level metadata
- [x] **Enhanced Composite Types**: Full support for shadow, border, gradient, typography, and other composite token types

## Getting started

### Installation

Install the CLI globally using **npm**:

```
npm i -g design-tokens-cli
```

### Configuration

Transformations are defined using a master config file. Here is a configuration with just one transform:

```json
{
  "globalPrefix": "",
  "preserveOrder": true,
  "keepReferences": false,
  "prefixes": {
    "colors": "",
    "sizes": "",
    "spacing": ""
  },
  "transforms": [
    {
      "from": "origin/tokens",
      "to": [
        {
          "as": "scss",
          "to": "destination/scss"
        },
        {
          "as": "css",
          "to": "destination/css"
        },
        {
          "as": "mjs",
          "to": "destination/js"
        }
      ]
    }
  ]
}
```

#### Formats

The `to` array for each transformation lists the formats you want and their respective output folders. The `as` property must be one of the supported format identifiers:

- `css` - CSS custom properties
- `scss` - Sass variables
- `mjs` or `js` - ES modules
- `json` - JSON output
- `tailwind-config` - Tailwind CSS v3 JavaScript configuration
- `tailwind-theme` - Tailwind CSS v4 CSS @theme directive

### Running the transforms

Either you explicitly define the path to the config file&hellip;

```
designTokens transform ./path/to/my-config.json
```

&hellip;or you leave that argument out and the CLI will look for a `tokens.config.json` file anywhere in the current working directory:

```
designTokens transform
```

## File names and groups

By convention, the file name for each tokens file found in `from` represents the top level "group" name for those tokens. In practice, this means converting **/origin/tokens/color-greyscale.tokens.json** will result in a set of tokens each prefixed with `color-greyscale-`. For js/mjs transformations the file would look something like the following, with `color-greyscale` converted into camel case:

```js
export const colorGreyscale = {
  'color-black': '#000000',
  'color-blanche': '#ffffff',
}
```

## `globalPrefix`

You can prefix all tokens with a common string using the top-level `globalPrefix` property in your config file. Using...

```json
"globalPrefix": "token-"
```

...`color-brand-light` becomes `token--color-brand-light`.

## `preserveOrder`

By default, tokens are output in the same order they appear in your input files, which helps maintain logical grouping (e.g., all spacing tokens together, all color tokens together). If you prefer alphabetical sorting, set `preserveOrder: false`.

## `prefixes`

Control the prefixes added to token names on a per-group basis. By default, tokens are prefixed with their group name (e.g., `colors-error`, `sizes-small`). Use the `prefixes` option to customize or disable prefixes for specific groups.

```json
{
  "prefixes": {
    "colors": "",      // No prefix for colors group
    "sizes": "size-",  // Custom prefix for sizes group
    "spacing": ""      // No prefix for spacing group
  }
}
```

**Example:**
```json
{
  "colors": {
    "error": { "$value": "red" },
    "success": { "$value": "green" }
  },
  "sizes": {
    "small": { "$value": "16px" },
    "large": { "$value": "32px" }
  }
}
```

**Output:**
```css
:root {
  --error: red;      /* No prefix */
  --success: green;  /* No prefix */
  --size-small: 16px;  /* Custom prefix */
  --size-large: 32px;  /* Custom prefix */
}
```

Groups not specified in `prefixes` use the default behavior (group name as prefix).

## `keepReferences`

By default, token references like `{color.white}` are resolved to their actual values. However, you can use the `keepReferences` option to preserve references as variable references in the output formats that support them.

When `keepReferences: true` is set in your config:

```json
{
  "keepReferences": true,
  "globalPrefix": "token",
  "transforms": [
    {
      "from": "tokens",
      "to": [
        {"as": "css", "to": "output/css"},
        {"as": "scss", "to": "output/scss"}
      ]
    }
  ]
}
```

**Input tokens:**
```json
{
  "color": {
    "white": {"$value": "#ffffff"},
    "blanche": {"$value": "{color.white}"},
    "weiss": {"$value": "{color.blanche}"}
  }
}
```

**CSS Output:**
```css
:root {
  --token-color-white: #ffffff;
  --token-color-blanche: var(--token-color-white);
  --token-color-weiss: var(--token-color-blanche);
}
```

**SCSS Output:**
```scss
$token-color-white: #ffffff;
$token-color-blanche: $token-color-white;
$token-color-weiss: $token-color-blanche;
```

This ensures proper dependency ordering and allows for more maintainable stylesheets where changing a base token automatically updates all dependent tokens.

## `outputColorFormat`

Control the output format for color tokens across all transformers. By default, colors are output in their original format, but you can standardize all colors to use hex, RGB, or HSL notation.

```json
{
  "outputColorFormat": "hex",
  "transforms": [...]
}
```

**Supported formats:**
- `"hex"` - Convert all colors to hexadecimal format (#rrggbb or #rrggbbaa for transparency)
- `"rgb"` - Convert all colors to RGB/RGBA format (rgb(r, g, b) or rgba(r, g, b, a))
- `"hsl"` - Convert all colors to HSL/HSLA format (hsl(h, s%, l%) or hsla(h, s%, l%, a))
- `"auto"` - Preserve original color formats (default behavior)

**Example:**

**Input tokens:**
```json
{
  "colors": {
    "primary": { "$value": "#ff6b35" },
    "secondary": { "$value": "rgb(0, 255, 0)" },
    "accent": { "$value": "hsl(240, 100%, 50%)" },
    "transparent": { "$value": "#ff000080" }
  }
}
```

**CSS Output with `"outputColorFormat": "rgb"`:**
```css
:root {
  --colors-primary: rgb(255, 107, 53);
  --colors-secondary: rgb(0, 255, 0);
  --colors-accent: rgb(0, 0, 255);
  --colors-transparent: rgba(255, 0, 0, 0.502);
}
```

**Note:** Color conversion only applies to resolved color values. When `keepReferences: true`, color tokens that are references (like `{color.primary}`) will not be converted until they are resolved by the consuming application.

**Try it out:** See the `example/color-demo.html` and `example/color-demo.config.json` for a complete working example of color format conversion.

## Tailwind CSS Support

The CLI supports generating configuration files for both Tailwind CSS v3 and v4. Design tokens are automatically mapped to appropriate Tailwind theme sections based on naming conventions.

### Tailwind CSS v3 Configuration

Use `tailwind-config` as the output format to generate a JavaScript configuration file compatible with Tailwind CSS v3.

```json
{
  "transforms": [
    {
      "name": "tailwind-config",
      "from": "tokens",
      "to": [
        {
          "as": "tailwind-config",
          "to": "config"
        }
      ]
    }
  ]
}
```

**Output:** `config/tailwind-config.tailwind-config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        "primary": "#ff6b35",
        "secondary": "#007bff"
      },
      spacing: {
        "sm": "8px",
        "md": "16px"
      },
      fontSize: {
        "sm": "14px",
        "base": "16px"
      }
    }
  }
}
```

### Tailwind CSS v4 @theme Directive

Use `tailwind-theme` as the output format to generate CSS with the `@theme` directive for Tailwind CSS v4.

```json
{
  "transforms": [
    {
      "name": "tailwind-theme",
      "from": "tokens",
      "to": [
        {
          "as": "tailwind-theme",
          "to": "css"
        }
      ]
    }
  ]
}
```

**Output:** `css/tailwind-theme.tailwind-theme.css`

```css
@theme {
  --color-primary: #ff6b35;
  --color-secondary: #007bff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
}
```

### Token Mapping

Design tokens are automatically categorized and mapped to Tailwind theme sections:

| Token Pattern | Tailwind v3 Section | Tailwind v4 CSS Variable |
|---------------|-------------------|-------------------------|
| `color-*`, `bg-*`, `text-*` | `theme.colors` | `--color-*` |
| `spacing-*`, `space-*`, `margin-*`, `padding-*` | `theme.spacing` | `--spacing-*` |
| `font-size-*` | `theme.fontSize` | `--font-size-*` |
| `font-family-*` | `theme.fontFamily` | `--font-family-*` |
| `font-weight-*` | `theme.fontWeight` | `--font-weight-*` |
| `border-radius-*` | `theme.borderRadius` | `--border-radius-*` |
| `border-width-*` | `theme.borderWidth` | `--border-width-*` |
| `shadow-*`, `box-shadow-*` | `theme.boxShadow` | `--box-shadow-*` |
| `z-index-*` | `theme.zIndex` | `--z-index-*` |
| `line-height-*` | `theme.lineHeight` | `--line-height-*` |
| `letter-spacing-*` | `theme.letterSpacing` | `--letter-spacing-*` |

### Nested Color Tokens

Tokens with nested structures like `color.primary.500` are properly handled:

**Input:**
```json
{
  "color": {
    "primary": {
      "50": { "$value": "#fef2f2" },
      "500": { "$value": "#ef4444" },
      "900": { "$value": "#7f1d1d" }
    }
  }
}
```

**Tailwind v3 Output:**
```js
colors: {
  primary: {
    "50": "#fef2f2",
    "500": "#ef4444",
    "900": "#7f1d1d"
  }
}
```

**Tailwind v4 Output:**
```css
@theme {
  --color-primary-50: #fef2f2;
  --color-primary-500: #ef4444;
  --color-primary-900: #7f1d1d;
}
```

### Integration with Color Format Conversion

Tailwind outputs respect the `outputColorFormat` configuration, allowing you to standardize colors across your Tailwind theme:

```json
{
  "outputColorFormat": "hex",
  "transforms": [
    {
      "as": "tailwind-config",
      "to": "config"
    }
  ]
}
```

### Try It Out

See the `example/tailwind-demo.html` and `example/tailwind-demo.config.json` for complete working examples of both Tailwind v3 and v4 output formats.

## Cross-Transform References

The CLI supports reference resolution across different transforms in your configuration. This means tokens in one transform can reference tokens from any other transform.

**Example:**
```json
{
  "transforms": [
    {
      "from": "tokens/colors",
      "to": [...]
    },
    {
      "from": "tokens/components",
      "to": [...]
    }
  ]
}
```

If your `tokens/components/button.tokens.json` contains:
```json
{
  "buttons": {
    "primary": {
      "background": { "$value": "{primary}" }
    }
  }
}
```

And your `tokens/colors/color.tokens.json` contains:
```json
{
  "colors": {
    "primary": { "$value": "#007bff" }
  }
}
```

The reference `{primary}` in the components transform will correctly resolve to `#007bff` from the colors transform.

## Concatenation 

If the transform has a `name` property, multiple files found in the `from` origin will be concatenated into a single output file of that name. Take the following example:

```json
{
  "transforms": [
    {
      "name": "layout",
      "from": "origin/tokens",
      "to": [
        {
          "as": "css",
          "to": "destination/css"
        }   
      ]
    }
  ]
}
```

Where there are **breakpoints.tokens.json** and **sizes.tokens.json** files in **/origin/tokens**, their tokens will be placed in the same **/destination/css/layout.tokens.css** file. Without the `name`, separate  **breakpoints.tokens.css** and **sizes.tokens.css** files would be made.

## 2025.10 Specification Features

This CLI implements the latest [Design Tokens Format 2025.10](https://www.designtokens.org/TR/2025.10/format/) specification, providing advanced features for organizing and referencing design tokens.

### Group Extensions (`$extends`)

Groups can inherit tokens and properties from other groups using the `$extends` property:

```json
{
  "button": {
    "$type": "color",
    "background": { "$value": "#0066cc" },
    "text": { "$value": "#ffffff" }
  },
  "button-primary": {
    "$extends": "{button}",
    "background": { "$value": "#cc0066" }
  }
}
```

The `button-primary` group inherits `text` from `button` but overrides `background`.

### Root Tokens (`$root`)

Groups can define a root token that serves as a base value:

```json
{
  "spacing": {
    "$type": "dimension",
    "$root": { "$value": { "value": 16, "unit": "px" } },
    "small": { "$value": { "value": 8, "unit": "px" } },
    "large": { "$value": { "value": 32, "unit": "px" } }
  }
}
```

Root tokens are accessible via `{spacing.$root}` references.

### JSON Pointer References (`$ref`)

For advanced property access, use JSON Pointer syntax:

```json
{
  "base": {
    "color": {
      "$value": {
        "colorSpace": "srgb",
        "components": [0, 0.4, 0.8],
        "hex": "#0066cc"
      }
    }
  },
  "theme": {
    "primary": {
      "$value": { "$ref": "#/base/color/$value" }
    },
    "primaryHue": {
      "$value": { "$ref": "#/base/color/$value/components/0" }
    }
  }
}
```

### Type Inheritance

Groups can define types that are inherited by child tokens:

```json
{
  "color": {
    "$type": "color",
    "primary": { "$value": "#0066cc" },  // Inherits color type
    "secondary": {
      "$type": "dimension",             // Overrides with dimension type
      "$value": { "value": 2, "unit": "px" }
    }
  }
}
```

### Group Properties

Groups support additional metadata:

```json
{
  "deprecated": {
    "$deprecated": true,
    "$description": "Legacy color palette",
    "$extensions": {
      "org.example.migration": {
        "newPalette": "color-v2"
      }
    }
  }
}
```
