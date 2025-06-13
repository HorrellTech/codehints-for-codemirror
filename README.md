# CodeHint - Standalone Code Editor with Hints

A powerful, lightweight code editor with intelligent hints - **Zero Dependencies!** Just include 2 files and you're ready to go.

## ✨ Features

- **🎯 Intelligent Code Hints**: Real-time keyword detection and parameter suggestions
- **📏 Resizable Interface**: Drag to resize editor and hint panels
- **🎨 Dual Mode Support**: Both embedded panel and modal dialog modes
- **🌓 Theme Support**: Light and dark themes built-in
- **⌨️ Smart Parameter Navigation**: Navigate function parameters with comma detection
- **🔧 Customizable Keywords**: Easy to extend with your own keyword definitions
- **📱 Responsive Design**: Works great on desktop and mobile devices
- **🚀 Zero Dependencies**: No npm, webpack, or build process required
- **💾 Tiny Footprint**: Just 2 files - `codehint.js` and `keywords.js`

## 🚀 Quick Start

### Super Simple Setup (2 files only!)

1. Download `codehint.js` and `keywords.js`
2. Include them in your HTML
3. Create an editor - that's it!

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website with Code Editor</title>
</head>
<body>
    <div id="my-editor" style="height: 400px;"></div>

    <!-- Include the files -->
    <script src="keywords.js"></script>
    <script src="codehint.js"></script>
    
    <script>
        // Create editor - that's it!
        const editor = new CodeHint('#my-editor', {
            theme: 'light',
            initialValue: 'console.log("Hello World!");'
        });
    </script>
</body>
</html>
```

### CDN Option (Coming Soon)
```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/codehint/keywords.js"></script>
<script src="https://cdn.jsdelivr.net/gh/yourusername/codehint/codehint.js"></script>
```

## 📖 Usage Examples

### Creating an Editor Panel

```javascript
// Basic panel
const editor = new CodeHint('#container', {
    theme: 'light',
    showLineNumbers: true,
    initialValue: '// Start coding here...'
});

// Get the current code
const code = editor.getValue();

// Set new code
editor.setValue('function test() { return true; }');

// Focus the editor
editor.focus();
```

### Modal Editor

```javascript
// Open modal editor and handle result
CodeHint.openModal({
    theme: 'dark',
    initialValue: 'const x = 5;'
}).then(result => {
    if (result !== null) {
        console.log('User saved:', result);
        // Do something with the code
    } else {
        console.log('User cancelled');
    }
});
```

### Custom Keywords

Easily add your own keywords by modifying `keywords.js` or passing custom keywords:

```javascript
// Define your own keywords
const customKeywords = [
    // Format: [keyword, signature, parameter descriptions, function description]
    [
        'myFunction',
        'myFunction(param1, param2, options)',
        [
            'param1: First parameter description',
            'param2: Second parameter description', 
            'options: Configuration object'
        ],
        'Description of what myFunction does'
    ],
    [
        'apiCall',
        'apiCall(endpoint, method, data)',
        [
            'endpoint: API endpoint URL',
            'method: HTTP method (GET, POST, etc.)',
            'data: Request payload data'
        ],
        'Makes an HTTP API call to the specified endpoint'
    ]
];

const editor = new CodeHint('#container', {
    keywords: customKeywords
});
```

## 🎮 Interactive Features

### Code Hints
- **Keyword Detection**: Start typing any keyword to see matching suggestions
- **Parameter Hints**: Type a function name followed by `(` to see parameter information
- **Real-time Updates**: Hints update as you type and move the cursor

### Parameter Navigation
- **Comma Navigation**: Use commas to move between function parameters
- **Visual Highlighting**: Current parameter is highlighted in both signature and description
- **Nested Functions**: Supports hints within nested function calls

### Resizable Interface
- **Drag to Resize**: Grab the horizontal divider to resize editor and hint panels
- **Minimum Sizes**: Prevents panels from becoming too small
- **Responsive**: Automatically adjusts to container size changes

## 🎨 Theming

### Built-in Themes
```javascript
// Light theme (default)
const editor = new CodeHint('#container', {
    theme: 'light'
});

// Dark theme
const editor = new CodeHint('#container', {
    theme: 'dark'
});
```

### Custom Styling
Add your own CSS to customize the appearance:

```css
/* Customize the editor container */
.codehint-container {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Customize hint panel */
.codehint-hint-panel {
    background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

/* Customize active parameter highlighting */
.codehint-param.active {
    background: #28a745;
    border-color: #28a745;
}
```

## 📱 Responsive Design

The editor automatically adapts to different screen sizes:

- **Desktop**: Full feature set with resizable panels
- **Tablet**: Optimized touch interactions for resizing
- **Mobile**: Compact layout with appropriate sizing

## 🔧 API Reference

### CodeHint Class

#### Constructor
```javascript
new CodeHint(container, options)
```

**Parameters:**
- `container` - CSS selector string or DOM element
- `options` - Configuration object

#### Options
```javascript
{
    theme: 'light' | 'dark',           // Editor theme
    keywords: Array,                   // Custom keywords array
    placeholder: string,               // Placeholder text
    showLineNumbers: boolean,          // Show line numbers
    autoFocus: boolean,                // Auto focus editor
    initialValue: string               // Initial code content
}
```

#### Methods
- `getValue()` - Returns current code content
- `setValue(code)` - Sets the code content
- `focus()` - Focuses the editor
- `destroy()` - Destroys the editor and cleans up

### Static Methods

- `CodeHint.openModal(options)` - Opens modal editor, returns Promise

## 🎯 Real-World Examples

### Blog Code Editor
```html
<div id="post-editor" style="height: 300px;"></div>
<script>
    const editor = new CodeHint('#post-editor', {
        theme: 'light',
        placeholder: 'Write your code snippet...',
        initialValue: localStorage.getItem('draft-code') || ''
    });
    
    // Auto-save draft
    setInterval(() => {
        localStorage.setItem('draft-code', editor.getValue());
    }, 5000);
</script>
```

### Code Review Tool
```javascript
// Modal for code editing in review tool
document.getElementById('edit-code-btn').onclick = async () => {
    const currentCode = getCurrentSnippet();
    
    const result = await CodeHint.openModal({
        theme: 'dark',
        initialValue: currentCode,
        showLineNumbers: true
    });
    
    if (result !== null) {
        updateCodeSnippet(result);
        markAsModified();
    }
};
```

### Educational Platform
```javascript
// Custom keywords for teaching
const lessonKeywords = [
    ['drawCircle', 'drawCircle(x, y, radius, color)', 
     ['x: X coordinate', 'y: Y coordinate', 'radius: Circle radius', 'color: Fill color'], 
     'Draws a circle on the canvas'],
    ['movePlayer', 'movePlayer(direction, speed)', 
     ['direction: Movement direction', 'speed: Movement speed'], 
     'Moves the player character']
];

const codeEditor = new CodeHint('#lesson-editor', {
    keywords: lessonKeywords,
    theme: 'light',
    placeholder: 'Try using drawCircle() or movePlayer()...'
});
```

## 📁 File Structure

All you need:
```
📁 your-website/
├── 📄 codehint.js     ← Main editor (22KB minified)
├── 📄 keywords.js     ← Keywords config (8KB)
└── 📄 index.html      ← Your website
```

## ✅ Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

## 🤝 Contributing

1. Fork the repository
2. Make your changes to `codehint.js` or `keywords.js`
3. Test with `demo.html`
4. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern IDE experiences
- Built with vanilla JavaScript for maximum compatibility
- No external dependencies for ultimate simplicity

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/codehint/issues)
- 💡 [Request Features](https://github.com/yourusername/codehint/issues)
- 📖 [View Demo](demo.html)

---

**Why CodeHint?**
- ❌ No npm install required
- ❌ No build process needed  
- ❌ No webpack/vite/rollup
- ❌ No dependencies to manage
- ✅ Just 2 files and you're done!
- ✅ Works anywhere JavaScript runs
- ✅ Professional code editing experience

Made with ❤️ for developers who value simplicity.

## 📖 Detailed Usage

### Creating an Editor Panel

```javascript
import { CodeHintsEditor } from 'codehints-for-codemirror';

const editor = new CodeHintsEditor({
    theme: 'light',                    // 'light' or 'dark'
    language: 'javascript',            // Language mode
    keywords: customKeywords,          // Custom keyword definitions
    placeholder: 'Start typing...',    // Placeholder text
    showLineNumbers: true,             // Show line numbers
    autoFocus: true,                   // Auto focus on creation
    initialValue: 'console.log();'     // Initial code content
});

// Create the panel and add to DOM
const panel = editor.createPanel();
document.getElementById('container').appendChild(panel);
```

### Modal Editor

```javascript
// Basic modal
const modal = editor.createModal((result) => {
    console.log('Modal closed with:', result);
});

// Promise-based modal (recommended)
const result = await openCodeHintsModal({
    theme: 'dark',
    initialValue: 'function example() {}'
});
```

### Custom Keywords

Define your own keywords and functions for hints:

```javascript
const customKeywords = [
    // Format: [keyword, signature, parameter descriptions, function description]
    [
        'myFunction',
        'myFunction(param1, param2, options)',
        [
            'param1: First parameter description',
            'param2: Second parameter description', 
            'options: Configuration object'
        ],
        'Description of what myFunction does'
    ],
    [
        'apiCall',
        'apiCall(endpoint, method, data)',
        [
            'endpoint: API endpoint URL',
            'method: HTTP method (GET, POST, etc.)',
            'data: Request payload data'
        ],
        'Makes an HTTP API call to the specified endpoint'
    ]
];

const editor = createCodeHintsPanel('#container', {
    keywords: customKeywords
});
```

## 🎮 Interactive Features

### Code Hints
- **Keyword Detection**: Start typing any keyword to see matching suggestions
- **Parameter Hints**: Type a function name followed by `(` to see parameter information
- **Real-time Updates**: Hints update as you type and move the cursor

### Parameter Navigation
- **Comma Navigation**: Use commas to move between function parameters
- **Visual Highlighting**: Current parameter is highlighted in both signature and description
- **Nested Functions**: Supports hints within nested function calls

### Resizable Interface
- **Drag to Resize**: Grab the horizontal divider to resize editor and hint panels
- **Minimum Sizes**: Prevents panels from becoming too small
- **Responsive**: Automatically adjusts to container size changes

## 🎨 Theming

### Built-in Themes
```javascript
// Light theme (default)
const editor = createCodeHintsPanel('#container', {
    theme: 'light'
});

// Dark theme
const editor = createCodeHintsPanel('#container', {
    theme: 'dark'
});
```

### Custom Styling
The component uses CSS classes that can be customized:

```css
/* Customize the editor container */
.codehints-editor-container {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Customize hint panel */
.codehints-hint-panel {
    background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

/* Customize active parameter highlighting */
.codehints-param.active {
    background: #28a745;
    border-color: #28a745;
}
```

## 📱 Responsive Design

The editor automatically adapts to different screen sizes:

- **Desktop**: Full feature set with resizable panels
- **Tablet**: Optimized touch interactions for resizing
- **Mobile**: Stacked layout with appropriate sizing

## 🔧 API Reference

### CodeHintsEditor Class

#### Constructor Options
```javascript
{
    theme: 'light' | 'dark',           // Editor theme
    language: 'javascript',            // Language mode
    keywords: Array,                   // Custom keywords array
    placeholder: string,               // Placeholder text
    showLineNumbers: boolean,          // Show line numbers
    autoFocus: boolean,                // Auto focus editor
    initialValue: string               // Initial code content
}
```

#### Methods
- `createPanel()` - Creates and returns the editor panel element
- `createModal(onClose)` - Creates a modal dialog with the editor
- `getValue()` - Returns current code content
- `setValue(code)` - Sets the code content
- `focus()` - Focuses the editor
- `destroy()` - Destroys the editor and cleans up

### Utility Functions

- `createCodeHintsPanel(container, options)` - Creates editor panel in container
- `openCodeHintsModal(options)` - Opens modal editor, returns Promise

## 🎯 Examples

### Basic Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>My App with Code Editor</title>
</head>
<body>
    <div id="editor-container" style="height: 500px;"></div>
    
    <script type="module">
        import { createCodeHintsPanel } from './codehints-codemirror.es.js';
        
        const editor = createCodeHintsPanel('#editor-container', {
            theme: 'light',
            initialValue: '// Start coding here...\nconsole.log("Hello!");'
        });
    </script>
</body>
</html>
```

### Advanced Usage with Custom Keywords
```javascript
// Define domain-specific keywords
const sqlKeywords = [
    ['SELECT', 'SELECT columns FROM table', ['columns: Column names or *', 'table: Table name'], 'Retrieves data from database'],
    ['INSERT', 'INSERT INTO table (columns) VALUES (values)', ['table: Target table', 'columns: Column names', 'values: Values to insert'], 'Inserts new data'],
    ['UPDATE', 'UPDATE table SET column = value WHERE condition', ['table: Table to update', 'column: Column to modify', 'value: New value', 'condition: WHERE clause'], 'Updates existing data']
];

const editor = createCodeHintsPanel('#sql-editor', {
    keywords: sqlKeywords,
    placeholder: 'Enter SQL query...',
    theme: 'dark'
});
```

### Modal Integration
```javascript
// Add to existing form
document.getElementById('edit-code-btn').onclick = async () => {
    const currentCode = document.getElementById('code-input').value;
    
    const result = await openCodeHintsModal({
        initialValue: currentCode,
        theme: 'light'
    });
    
    if (result !== null) {
        document.getElementById('code-input').value = result;
        console.log('Code updated!');
    }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [CodeMirror 6](https://codemirror.net/)
- Inspired by modern IDE experiences
- Thanks to the CodeMirror community for excellent documentation

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/codehints-for-codemirror/issues)
- 💡 [Request Features](https://github.com/yourusername/codehints-for-codemirror/issues)
- 📧 [Contact](mailto:your.email@example.com)

---

Made with ❤️ for developers who love great code editing experiences.
