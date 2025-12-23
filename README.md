# Design Tokens CLI

A design-tokens-format-adhering token transformation CLI (Command Line Interface).

## Supports

- [x] Converting from design tokens in the [standard JSON format](https://design-tokens.github.io/community-group/format/)...
- [x] ...to CSS (custom properties)
- [x] ...to Sass (scss) variables
- [x] ...to ES modules
- [x] ...to JSON (flattened to name/value pairs)
- [x] (Chained) token reference resolution
- [x] **Keeping references as variable references** (optional)
- [x] Reference resolution _between_ separate tokens files in one transform
- [x] Reference resolution _between_ separate tokens _between_ separate transforms
- [x] Composite tokens (`$value`s as objects)
- [x] `*.tokens.json` and `*.tokens` file types
- [x] Concatenation of separate token files under a single name

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

The `to` array for each transformation lists the formats you want and their respective output folders. The `as` property must be the file extension for the output format. Both `mjs` and `js` output ES modules.

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
