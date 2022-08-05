# jotdown

JotDown is a light (< 20 kb bundled and minified), minimal Markdown editor for the web. It maintains a small size by modifying existing features such as textareas instead of completely reinventing the wheel. This also makes it simpler to customize, since the majority of the editor can be styled with CSS and customized with JavaScript.

See the [hosted demo](https://gh.kyleplo.com/jotdown).

## Installation
Get the library from NPM
```
npm install --save @kyleplo/jotdown
```

## Importing
This library supports usage as both an ES6 module and a CommonJS module, as directly as in the browser.

## ES6
```js
import { JotDown, bold, italic } from "@kyleplo/jotdown"
```

## CommonJS
```js
const { JotDown, bold, italic } = require("@kyleplo/jotdown");
```

## CSS
Whether you use ES modules or CommonJS, make sure you also include the CSS bundle.
```html
<link rel="stylesheet" href="./node_modules/@kyleplo/jotdown/build/bundle.min.css">
```

## Browser
```html
<script src="https://gh.kyleplo.com/jotdown/bundle.min.js" defer></script>
<link rel="stylesheet" href="https://gh.kyleplo.com/jotdown/bundle.min.css">
```
Or host bundle.min.js and bundle.min.css yourself.

## Usage
Initialize the editor
```js
const editor = new JotDown(document.querySelector("#editor"), {
  // formats and other configuration
  inlineFormats: [bold, italic]
});
```

Get the Markdown value from the editor
```js
const value = editor.value;
```

## Configuration
- `readonly` - `Boolean` - Prevents the user from editing the text in the editor - essentially converts into a Markdown viewer - does not prevent the editor from being modified programmatically
- `mayBecomeWritable` - `Boolean` - Whether a readonly editor should be prepared to become writable - defaults to `true` but can save memory if disabled 
- `inlineFormats`, `blockFormats` - `Array` - Array of format objects - See Formats section - defaults to empty
- `seekMemory` - `Number` - Maximum distance in characters between the beginning and end of a format - defaults to 1000 characters
- `highlight` - `Function` - Function for syntax highlighting - called with two parameters, the code and the language - defaults to `undefined` -  see [Elucidate](https://github.com/kyleplo/elucidate) for a simple syntax highlighter
- `linkTarget` - `String` - Value of the `target` attribute to be put on generated links - defaults to `"\_blank"`

## Formats
All of these formats are included in the package, but can be enabled/disabled individually. Custom formats can also be created.
```js
const { JotDown, bold, italic } = require("@kyleplo/jotdown");
```

### Block Formats
- `blockquote` - Begin a line with `> ` to format the line as a blockquote - currently cannot be nested
- `codeFenced` - Surround text with three \`s on each side to format as code - optional syntax highlighting by putting the programming language name after the first three \`s
- `codeIndent` - Begin a line with four spaces or a tab to format as code
- `heading.h1` - Begin a line with `# ` to format as a level 1 heading
- `heading.h2` - Begin a line with `## ` to format as a level 2 heading
- `heading.h3` - Begin a line with `### ` to format as a level 3 heading
- `heading.h4` - Begin a line with `#### ` to format as a level 4 heading
- `heading.h5` - Begin a line with `##### ` to format as a level 5 heading
- `heading.h6` - Begin a line with `###### ` to format as a level 6 heading
- `orderedList` - Begin a line with `1.`, `1. `, `1)`, or `1) ` (with any number) to format as an ordered list
- `rule` - Set a line to `***`, `---`, or `+++` to format as a horizontal rule
- `unorderedList` - Begin a line with `* `, `- `, or `+ ` to format as an unordered list

### Inline Formats
- `autoLink` - Automatically detect links
- `bold` - Surround text with `**` or `__` to format as bold
- `code` - Surround text with \` to format as code
- `highlight` - Surround text with `==` to format highlighted
- `image` - Formatted like this: `![alt text](link)`
- `italic` - Surround text with `*` or `_` to format as italic
- `link` - Formatted like this: `[label](link)`
- `spoiler` - Surround text with `||` to hide except when hovered
- `strike` - Surround text with `~~` to format crossed out
- `sub` - Surround text with `~` to format as subscript - only shows in readonly mode
- `sup` - Surround text with `^` to format as superscript - only shows in readonly mode

## Properties
### `value`
The Markdown-formatted value of the editor

```js
const value = editor.value;
```

## Methods
### `applyInlineFormat(format)`
Applies an inline format at the current caret position/selection

```js
editor.applyInlineFormat(bold);
```

### `removeInlineFormat(format)`
Removes an inline format from the current caret position/selection, and returns whether the operation was successful or not.

```js
editor.removeInlineFormat(bold);
```

### `applyBlockFormat(format)`
Applies a block format at the current caret position/selection

```js
editor.applyBlockFormat(heading.h1);
```

### `removeBlockFormat(format)`
Removes an block format from the current caret position/selection, and returns whether the operation was successful or not.

```js
editor.removeInlineFormat(heading.h1);
```

### `detectFormat(format)`
Detects if a format exists at the current caret position/selection.

```js
const isBold = editor.detectFormat(bold);
```

## Events
### `change`
Fires whenever the text in the editor is modified.

```js
editor.addEventListener("change", e => {
  const value = e.target.value;
});
```
### `selectionchange`
Fires whenever the caret position/selection within the editor changes.

```js
editor.addEventListener("selectionchage", e => {
  const value = e.target.value;
});
```