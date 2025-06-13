/**
 * CodeHint - Standalone Code Editor with Hints
 * No dependencies required - just include this file and keywords.js
 * 
 * Usage:
 * const editor = new CodeHint('#container', options);
 * const modal = CodeHint.openModal(options);
 */

class CodeHint {
    constructor(container, options = {}) {
        this.options = {
            theme: 'light',
            keywords: window.defaultKeywords || [],
            placeholder: 'Start typing code...',
            showLineNumbers: true,
            autoFocus: true,
            initialValue: '',
            ...options
        };

        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.editor = null;
        this.hintPanel = null;
        this.resizer = null;
        this.textarea = null;
        this.lineNumbers = null;
        this.currentKeyword = null;
        this.currentParameterIndex = 0;
        this.isResizing = false;
        
        this.init();
    }

    init() {
        this.addStyles();
        this.createEditor();
        this.bindEvents();
        
        if (this.options.initialValue) {
            this.setValue(this.options.initialValue);
        }
        
        if (this.options.autoFocus) {
            setTimeout(() => this.focus(), 100);
        }
    }

    createEditor() {
        this.container.innerHTML = `
            <div class="codehint-container ${this.options.theme}">
                <div class="codehint-editor-section">
                    <div class="codehint-editor-wrapper">
                        ${this.options.showLineNumbers ? '<div class="codehint-line-numbers"></div>' : ''}
                        <textarea class="codehint-textarea" placeholder="${this.options.placeholder}" spellcheck="false"></textarea>
                        <div class="codehint-highlight-layer"></div>
                    </div>
                </div>
                <div class="codehint-resizer"></div>
                <div class="codehint-hint-panel">
                    <div class="codehint-hint-content">
                        <div class="codehint-hint-signature"></div>
                        <div class="codehint-hint-description"></div>
                        <div class="codehint-hint-parameters"></div>
                    </div>
                </div>
            </div>
        `;

        this.textarea = this.container.querySelector('.codehint-textarea');
        this.hintPanel = this.container.querySelector('.codehint-hint-panel');
        this.resizer = this.container.querySelector('.codehint-resizer');
        this.lineNumbers = this.container.querySelector('.codehint-line-numbers');
        this.highlightLayer = this.container.querySelector('.codehint-highlight-layer');
        
        this.initializeResizer();
        this.updateLineNumbers();
    }

    bindEvents() {
        // Text input events
        this.textarea.addEventListener('input', (e) => {
            this.updateLineNumbers();
            this.updateHighlighting();
            this.updateHints();
        });

        this.textarea.addEventListener('keyup', (e) => {
            this.updateHints();
        });

        this.textarea.addEventListener('click', (e) => {
            this.updateHints();
        });

        this.textarea.addEventListener('scroll', (e) => {
            this.syncScroll();
        });

        // Prevent tab from leaving textarea
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });
    }

    insertTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        
        this.textarea.value = value.substring(0, start) + '    ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
        
        this.updateLineNumbers();
        this.updateHighlighting();
        this.updateHints();
    }

    initializeResizer() {
        let startY = 0;
        let startHeight = 0;
        let containerHeight = 0;

        const onMouseDown = (e) => {
            this.isResizing = true;
            startY = e.clientY;
            startHeight = this.hintPanel.offsetHeight;
            containerHeight = this.container.offsetHeight;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = 'none';
            this.container.classList.add('resizing');
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!this.isResizing) return;
            
            const deltaY = startY - e.clientY;
            const newHeight = Math.max(100, Math.min(containerHeight - 100, startHeight + deltaY));
            
            this.hintPanel.style.height = `${newHeight}px`;
        };

        const onMouseUp = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = '';
            this.container.classList.remove('resizing');
        };

        this.resizer.addEventListener('mousedown', onMouseDown);
    }

    updateLineNumbers() {
        if (!this.lineNumbers) return;
        
        const lines = this.textarea.value.split('\n');
        const lineCount = lines.length;
        
        let lineNumberHtml = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumberHtml += `<div class="line-number">${i}</div>`;
        }
        
        this.lineNumbers.innerHTML = lineNumberHtml;
        this.syncScroll();
    }

    syncScroll() {
        if (this.lineNumbers) {
            this.lineNumbers.scrollTop = this.textarea.scrollTop;
        }
        if (this.highlightLayer) {
            this.highlightLayer.scrollTop = this.textarea.scrollTop;
            this.highlightLayer.scrollLeft = this.textarea.scrollLeft;
        }
    }    updateHighlighting() {
        if (!this.highlightLayer) return;
        
        const code = this.textarea.value;
        const highlighted = this.syntaxHighlight(code);
        this.highlightLayer.innerHTML = highlighted + '<br>';
        
        // Ensure proper layering for light theme
        if (this.options.theme === 'light') {
            this.textarea.style.background = 'rgba(255, 255, 255, 0.9)';
            this.textarea.style.color = '#333';
        }
    }

    syntaxHighlight(code) {
        // Basic syntax highlighting
        return code
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Keywords
            .replace(/\b(function|var|let|const|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|class|extends|import|export|default|async|await|new|this|super|static|public|private|protected|abstract|interface|type|enum|namespace|module|declare|readonly|override)\b/g, '<span class="keyword">$1</span>')
            // Strings
            .replace(/(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="string">$1$2$3</span>')
            // Numbers
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
            // Comments
            .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
            // Functions
            .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="function">$1</span>');
    }

    updateHints() {
        const cursor = this.textarea.selectionStart;
        const text = this.textarea.value;
        
        // Get current line and position
        const beforeCursor = text.substring(0, cursor);
        const lines = beforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];
        const cursorInLine = currentLine.length;
        
        // Find context
        const context = this.getContext(currentLine, cursorInLine);
        
        if (context.keyword) {
            this.showHint(context);
        } else {
            this.hideHint();
        }
    }

    getContext(lineText, cursorPos) {
        // Check if we're inside parentheses
        const beforeCursor = lineText.substring(0, cursorPos);
        const afterCursor = lineText.substring(cursorPos);
        
        // Find the last opening parenthesis before cursor
        let parenDepth = 0;
        let funcStart = -1;
        let paramStart = -1;
        
        for (let i = beforeCursor.length - 1; i >= 0; i--) {
            const char = beforeCursor[i];
            if (char === ')') {
                parenDepth++;
            } else if (char === '(') {
                if (parenDepth === 0) {
                    paramStart = i + 1;
                    // Find the function name before this parenthesis
                    let j = i - 1;
                    while (j >= 0 && /[\s]/.test(beforeCursor[j])) j--;
                    let funcEnd = j + 1;
                    while (j >= 0 && /[a-zA-Z0-9_.$]/.test(beforeCursor[j])) j--;
                    funcStart = j + 1;
                    break;
                } else {
                    parenDepth--;
                }
            }
        }
        
        if (funcStart >= 0 && paramStart >= 0) {
            // We're inside function parentheses
            const funcName = beforeCursor.substring(funcStart, paramStart - 1).trim();
            const paramText = beforeCursor.substring(paramStart);
            const paramIndex = this.getParameterIndex(paramText);
            
            return {
                keyword: funcName,
                parameterIndex: paramIndex,
                inParentheses: true
            };
        }
        
        // Check for keyword at cursor position
        const wordMatch = this.getWordAtPosition(lineText, cursorPos);
        if (wordMatch) {
            return {
                keyword: wordMatch,
                parameterIndex: 0,
                inParentheses: false
            };
        }
        
        return { keyword: null };
    }

    getWordAtPosition(text, pos) {
        // Find word boundaries
        let start = pos;
        let end = pos;
        
        // Move start backward
        while (start > 0 && /[a-zA-Z0-9_.$]/.test(text[start - 1])) {
            start--;
        }
        
        // Move end forward
        while (end < text.length && /[a-zA-Z0-9_.$]/.test(text[end])) {
            end++;
        }
        
        if (start === end) return null;
        
        return text.substring(start, end);
    }

    getParameterIndex(paramText) {
        let depth = 0;
        let paramIndex = 0;
        
        for (let i = 0; i < paramText.length; i++) {
            const char = paramText[i];
            if (char === '(' || char === '[' || char === '{') {
                depth++;
            } else if (char === ')' || char === ']' || char === '}') {
                depth--;
            } else if (char === ',' && depth === 0) {
                paramIndex++;
            }
        }
        
        return paramIndex;
    }

    showHint(context) {
        const keyword = this.findKeyword(context.keyword);
        
        if (!keyword) {
            this.hideHint();
            return;
        }
        
        this.currentKeyword = keyword;
        this.currentParameterIndex = context.parameterIndex;
        
        const signatureEl = this.container.querySelector('.codehint-hint-signature');
        const descriptionEl = this.container.querySelector('.codehint-hint-description');
        const parametersEl = this.container.querySelector('.codehint-hint-parameters');
        
        // Show signature
        signatureEl.innerHTML = this.formatSignature(keyword, context);
        
        // Show description
        descriptionEl.textContent = keyword[3] || 'No description available';
        
        // Show parameters
        if (keyword[2] && keyword[2].length > 0) {
            const paramHtml = keyword[2].map((param, index) => {
                const isActive = context.inParentheses && index === context.parameterIndex;
                return `<div class="codehint-param ${isActive ? 'active' : ''}">${param}</div>`;
            }).join('');
            parametersEl.innerHTML = paramHtml;
        } else {
            parametersEl.innerHTML = '<div class="codehint-param">No parameters</div>';
        }
        
        this.hintPanel.classList.add('active');
    }

    formatSignature(keyword, context) {
        if (!context.inParentheses || !keyword[1].includes('(')) {
            return `<code>${keyword[1]}</code>`;
        }
        
        // Parse the signature to highlight current parameter
        const signature = keyword[1];
        const parenIndex = signature.indexOf('(');
        if (parenIndex === -1) {
            return `<code>${signature}</code>`;
        }
        
        const funcName = signature.substring(0, parenIndex + 1);
        const params = signature.substring(parenIndex + 1, signature.lastIndexOf(')'));
        const ending = signature.substring(signature.lastIndexOf(')'));
        
        if (!params.trim()) {
            return `<code>${signature}</code>`;
        }
        
        const paramList = params.split(',').map(p => p.trim());
        const formattedParams = paramList.map((param, index) => {
            const isActive = index === context.parameterIndex;
            return isActive ? `<strong>${param}</strong>` : param;
        }).join(', ');
        
        return `<code>${funcName}${formattedParams}${ending}</code>`;
    }

    findKeyword(name) {
        return this.options.keywords.find(keyword => 
            keyword[0].toLowerCase() === name.toLowerCase() ||
            keyword[0].toLowerCase().startsWith(name.toLowerCase())
        );
    }

    hideHint() {
        this.hintPanel.classList.remove('active');
        this.currentKeyword = null;
    }

    getValue() {
        return this.textarea.value;
    }

    setValue(value) {
        this.textarea.value = value;
        this.updateLineNumbers();
        this.updateHighlighting();
        this.updateHints();
    }

    focus() {
        this.textarea.focus();
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.innerHTML = '';
        }
    }

    // Static method to create modal
    static openModal(options = {}) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'codehint-modal-overlay';
            modal.innerHTML = `
                <div class="codehint-modal">
                    <div class="codehint-modal-header">
                        <h3>Code Editor</h3>
                        <div class="codehint-modal-controls">
                            <button class="codehint-btn codehint-btn-secondary" data-action="cancel">Cancel</button>
                            <button class="codehint-btn codehint-btn-primary" data-action="save">Save</button>
                        </div>
                    </div>
                    <div class="codehint-modal-body"></div>
                </div>
            `;

            const modalBody = modal.querySelector('.codehint-modal-body');
            const editor = new CodeHint(modalBody, options);

            // Handle modal actions
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('codehint-modal-overlay')) {
                    closeModal(null);
                } else if (e.target.dataset.action === 'cancel') {
                    closeModal(null);
                } else if (e.target.dataset.action === 'save') {
                    closeModal(editor.getValue());
                }
            });

            // Handle escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal(null);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);

            const closeModal = (result) => {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
                resolve(result);
            };

            document.body.appendChild(modal);
            editor.focus();
        });
    }

    addStyles() {
        // Only add styles once
        if (document.getElementById('codehint-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'codehint-styles';
        style.textContent = `
            .codehint-container {
                width: 100%;
                height: 100%;
                min-height: 400px;
                display: flex;
                flex-direction: column;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
                position: relative;
            }

            .codehint-editor-section {
                flex: 1;
                min-height: 200px;
                position: relative;
                overflow: hidden;
            }

            .codehint-editor-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                overflow: hidden;
            }

            .codehint-line-numbers {
                background: #f8f9fa;
                border-right: 1px solid #e0e0e0;
                padding: 8px 4px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
                color: #666;
                user-select: none;
                min-width: 40px;
                text-align: right;
                overflow: hidden;
                white-space: nowrap;
            }

            .line-number {
                height: 19.6px;
                padding-right: 8px;
            }            .codehint-textarea {
                flex: 1;
                border: none;
                outline: none;
                resize: none;
                padding: 8px 12px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
                background: white;
                color: #333;
                position: relative;
                z-index: 2;
                overflow: auto;
                white-space: nowrap;
                word-wrap: normal;
            }            .codehint-highlight-layer {
                position: absolute;
                top: 0;
                left: 40px;
                right: 0;
                bottom: 0;
                padding: 8px 12px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.4;
                pointer-events: none;
                z-index: 1;
                overflow: auto;
                white-space: nowrap;
                word-wrap: normal;
                color: transparent;
                background: transparent;
            }

            .codehint-container:not(.codehint-container:has(.codehint-line-numbers)) .codehint-highlight-layer {
                left: 0;
            }

            .codehint-resizer {
                height: 4px;
                background: #e0e0e0;
                cursor: row-resize;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                transition: background-color 0.2s;
                flex-shrink: 0;
            }

            .codehint-resizer:hover {
                background: #d0d0d0;
            }

            .codehint-container.resizing .codehint-resizer {
                background: #007bff;
            }

            .codehint-hint-panel {
                height: 180px;
                background: #f8f9fa;
                border-top: 1px solid #e0e0e0;
                overflow-y: auto;
                opacity: 0.5;
                transition: opacity 0.2s;
                flex-shrink: 0;
            }

            .codehint-hint-panel.active {
                opacity: 1;
            }

            .codehint-hint-content {
                padding: 16px;
            }

            .codehint-hint-signature {
                margin-bottom: 12px;
                font-size: 14px;
            }

            .codehint-hint-signature code {
                background: #e9ecef;
                padding: 6px 10px;
                border-radius: 4px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
            }

            .codehint-hint-description {
                margin-bottom: 12px;
                color: #495057;
                font-size: 13px;
                line-height: 1.4;
            }

            .codehint-hint-parameters {
                font-size: 12px;
            }

            .codehint-param {
                margin-bottom: 6px;
                padding: 6px 8px;
                background: #fff;
                border: 1px solid #e9ecef;
                border-radius: 3px;
                color: #6c757d;
                transition: all 0.2s;
            }

            .codehint-param.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
                font-weight: 500;
            }            /* Syntax highlighting */
            .keyword { color: #0000ff; font-weight: bold; }
            .string { color: #008000; }
            .number { color: #800080; }
            .comment { color: #808080; font-style: italic; }
            .function { color: #795548; font-weight: bold; }

            /* Light theme explicit styling */
            .codehint-container:not(.dark) .codehint-textarea {
                background: white !important;
                color: #333 !important;
            }

            .codehint-container:not(.dark) .keyword { color: #0066cc; font-weight: bold; }
            .codehint-container:not(.dark) .string { color: #22863a; }
            .codehint-container:not(.dark) .number { color: #6f42c1; }
            .codehint-container:not(.dark) .comment { color: #6a737d; font-style: italic; }
            .codehint-container:not(.dark) .function { color: #6f42c1; font-weight: bold; }/* Dark theme */
            .codehint-container.dark {
                background: #1e1e1e;
                border-color: #333;
                color: #d4d4d4;
            }

            .codehint-container.dark .codehint-textarea {
                background: #1e1e1e !important;
                color: #d4d4d4 !important;
            }

            .codehint-container.dark .codehint-line-numbers {
                background: #252526;
                border-color: #333;
                color: #858585;
            }

            .codehint-container.dark .codehint-hint-panel {
                background: #252526;
                border-color: #333;
            }

            .codehint-container.dark .codehint-hint-signature code {
                background: #333;
                color: #d4d4d4;
            }

            .codehint-container.dark .codehint-hint-description {
                color: #cccccc;
            }

            .codehint-container.dark .codehint-param {
                background: #2d2d30;
                border-color: #333;
                color: #cccccc;
            }

            .codehint-container.dark .codehint-resizer {
                background: #333;
                border-color: #404040;
            }

            .codehint-container.dark .keyword { color: #569cd6; }
            .codehint-container.dark .string { color: #ce9178; }
            .codehint-container.dark .number { color: #b5cea8; }
            .codehint-container.dark .comment { color: #6a9955; }
            .codehint-container.dark .function { color: #dcdcaa; }

            /* Modal Styles */
            .codehint-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            }

            .codehint-modal {
                background: white;
                border-radius: 8px;
                width: 90%;
                max-width: 1000px;
                height: 80%;
                max-height: 700px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .codehint-modal-header {
                padding: 16px 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #f8f9fa;
                border-radius: 8px 8px 0 0;
                flex-shrink: 0;
            }

            .codehint-modal-header h3 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }

            .codehint-modal-controls {
                display: flex;
                gap: 10px;
            }

            .codehint-btn {
                padding: 8px 16px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            .codehint-btn:hover {
                background: #f0f0f0;
            }

            .codehint-btn-primary {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }

            .codehint-btn-primary:hover {
                background: #0056b3;
                border-color: #0056b3;
            }

            .codehint-btn-secondary {
                background: #6c757d;
                color: white;
                border-color: #6c757d;
            }

            .codehint-btn-secondary:hover {
                background: #545b62;
                border-color: #545b62;
            }

            .codehint-modal-body {
                flex: 1;
                overflow: hidden;
                min-height: 0;
            }

            .codehint-modal-body .codehint-container {
                border: none;
                border-radius: 0;
                height: 100%;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .codehint-modal {
                    width: 95%;
                    height: 90%;
                }
                
                .codehint-modal-header {
                    padding: 12px 16px;
                }
                
                .codehint-hint-content {
                    padding: 12px;
                }
                
                .codehint-btn {
                    padding: 6px 12px;
                    font-size: 13px;
                }

                .codehint-line-numbers {
                    min-width: 30px;
                    font-size: 12px;
                }

                .codehint-textarea, .codehint-highlight-layer {
                    font-size: 12px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.CodeHint = CodeHint;
}
