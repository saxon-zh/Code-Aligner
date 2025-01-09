# Code Aligner

This extension is used to align code with a specific character, making your code more readable and organized.

## Features

- **Align Selected Text**: Aligns the selected text based on the alignment rules defined for the language.
- **Auto Format on Save**: Automatically formats the document based on the alignment rules when the document is saved.

## Extension Settings

This extension contributes the following settings:

* `codeAligner.autoFormatOnSave`: Enable/disable auto formatting on save.
* `codeAligner.rules.<languageId>`: Define alignment rules for specific languages.

## Usage

Here is some example of how to use the Code Aligner extension:

### 1) Align Selection Text

1. Select the text you want to align.
2. Press `Ctrl + Alt + A`
3. Or open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS). Type `Align Selected Text` and press Enter.

Before alignment:
```
const a = 1;
const abc = 2;
const ab = 3;
```

After alignment:
```
const a   = 1;
const abc = 2;
const ab  = 3;
```

### 2) Auto Align On Save

1. Enable the `Auto Format on Save` setting by going to `Settings` > `Extensions` > `Code Aligner`.
2. Make sure `codeAligner.autoFormatOnSave` is checked.
3. Save your document (`Ctrl+S` or `Cmd+S` on macOS).

### Tips

- **Use Consistent Alignment Characters**: Ensure that the alignment characters you define are consistent across your project to maintain readability.
- **Check Language Support**: Verify that the alignment rules are correctly defined for the languages you are working with.
- **Leverage Auto Format**: Enable auto format on save to keep your code consistently aligned without manual intervention.
- **Customize Per Project**: Customize alignment rules per project by setting them in the workspace settings rather than global settings.
- **Use Command Palette**: Utilize the command palette for quick access to alignment commands.


### 3) Define Custom Alignment Characters

You can define custom alignment characters for different languages by modifying the `codeAligner.rules` setting in your `settings.json` file.

Example:
```json
{
    "codeAligner.rules": {
        "javascript": [":", "="],
        "typescript": [":", "="],
        "golang": [":=", "="]
    }
}
```

In this example, for JavaScript, the extension will align code based on `:` and `=` characters. For TypeScript, it will align based on `:` and `=` characters, and for Golang, it will align based on `:=` and `=` characters.

Before:
```javascript
let x = 10;
let xyz = 20;
let z = 30;
```

After:
```javascript
let x   = 10;
let xyz = 20;
let z   = 30;
```

**Enjoy!**
