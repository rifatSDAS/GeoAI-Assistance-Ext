// The module 'vscode' contains the VS Code extensibility API
// Import the modules
import {Ollama} from 'ollama';
import * as vscode from 'vscode';


// Initialize Ollama client
const ollama = new Ollama({
    host: 'http://localhost:11434' // Default Ollama server address
});

// Flag to track if response generation is in progress
let isGenerating = false;

// System prompt to provide context to the model
const SYSTEM_PROMPT = `You are an expert Geospatial Professional with expertise in:
- Geospatial data processing and analysis
- GDAL, OGR, rasterio, geopandas, imageIO, and other geospatial libraries
- Machine Learning and Deep Learning for geospatial applications
- Cloud-native geospatial architectures
- Web mapping libraries (Leaflet, OpenLayers, Mapbox GL)
- Full stack development (Python, JavaScript, Java, C++)
- Satellite science, technology, and engineering
- Computer vision and image processing
- Remote sensing and photogrammetry
- Geographic Information Systems (GIS)
- Earth Observation satellite data and sensors
- Spatial databases and data structures
- When you need to think through a problem, wrap your thinking in <think>...</think> tags
- When providing code examples, use proper markdown code blocks with language specification, e.g. \`\`\`python, \`\`\`java, \`\`\`cpp, \`\`\`typescript, and \`\`\`javascript
- When explaining concepts, use clear headings like ### Explanation:
- For examples, use ### Example Usage:

Provide detailed, technical responses with code examples when appropriate.
Focus on best practices, performance optimization, and scalable solutions for geospatial applications.
Always provide well-structured, organized responses with clear separation between thinking, code, and explanations.`;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension is now active!');

    // Register the 'hiDad' command
    const disposable = vscode.commands.registerCommand('geoai-assistance-ext.hiGeoAI', () => {
        const panel = vscode.window.createWebviewPanel(
            'geospatialChat',
            'Open Geospatial AI Assistance',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            switch (message.command) {
                case 'chat':
                    if (!isGenerating) {
                        isGenerating = true;
                        await handleChat(panel, message.text);
                    }
                    break;
                case 'stop':
                    isGenerating = false;
                    panel.webview.postMessage({
                        command: 'stopped',
                        text: 'Response generation stopped.'
                    });
                    break;
                case 'retry':
                    if (!isGenerating) {
                        isGenerating = true;
                        await handleChat(panel, message.text);
                    }
                    break;
            }
        });
    });

    context.subscriptions.push(disposable);
}

// Handle the chat conversation with the Ollama model
async function handleChat(panel: vscode.WebviewPanel, userPrompt: string) {
    let responseText = '';

    try {
        const response = await ollama.chat({
            model: 'deepseek-r1:1.5b',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            stream: true,
            options: {
                num_gpu: 1,
                num_thread: 4,
            }
        });

        let responseText = '';
        for await (const chunk of response) {
            if (!isGenerating) {
                break;
            }
            responseText += chunk.message?.content || '';
            panel.webview.postMessage({
                command: 'chatResponse',
                text: responseText
            });
        }
    } catch (err) {
        panel.webview.postMessage({
            command: 'error',
            text: `Error: ${err instanceof Error ? err.message : String(err)}`
        });
    } finally {
        isGenerating = false;
        panel.webview.postMessage({
            command: 'generationComplete'
        });
    }
}

// Get the HTML content for the webview
function getWebviewContent(): string {
    const htmlContent = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '    <meta charset="UTF-8" />',
        '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dark.min.css">',
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>',
        '    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>',
        '    <style>',
        '        body {',
        '            margin: 0;',
        '            padding: 20px;',
        '            background-color: rgb(38, 38, 38);',
        '            height: 100vh;',
        '            display: flex;',
        '            flex-direction: column;',
        '        }',
        '        #chat-container {',
        '            display: flex;',
        '            flex-direction: column;',
        '            height: 100%;',
        '            gap: 20px;',
        '        }',
        '        #messages {',
        '            flex: 1;',
        '            overflow-y: auto;',
        '            margin-bottom: 20px;',
        '            border: 1px solid #666;',
        '            border-radius: 8px;',
        '            padding: 20px;',
        '            background-color: rgb(38, 38, 38);',
        '            box-shadow: 0 2px 4px rgba(0,0,0,0.2);',
        '            color: #ffffff;',
        '            display: flex;',
        '            flex-direction: column-reverse;',
        '        }',
        '        .message {',
        '            margin: 8px 0;',
        '            padding: 10px;',
        '            border-radius: 6px;',
        '            max-width: 85%;',
        '            white-space: pre-wrap;',
        '        }',
        '        .user-message {',
        '            background-color:rgb(110, 0, 220);',
        '            align-self: flex-end;',
        '            margin-left: 15%;',
        '        }',
        '        .assistant-message {',
        '            background-color: #4a4a4a;',
        '            align-self: flex-start;',
        '            margin-right: 15%;',
        '        }',
        '        .thinking-section {',
        '            background-color: #2d2d2d;',
        '            border-left: 3px solid #7c7c7c;',
        '            padding: 10px;',
        '            margin: 10px 0;',
        '            font-style: italic;',
        '        }',
        '        .code-block {',
        '            background-color: #1e1e1e;',
        '            border-radius: 4px;',
        '            padding: 10px;',
        '            margin: 10px 0;',
        '            font-family: "Consolas", "Courier New", monospace;',
        '            overflow-x: auto;',
        '        }',
        '        .explanation-section {',
        '            margin: 10px 0;',
        '            padding: 10px;',
        '            border-left: 3px solid rgb(0, 204, 204);',
        '        }',
        '        #input-container {',
        '            position: sticky;',
        '            bottom: 0;',
        '            display: flex;',
        '            gap: 12px;',
        '            min-height: 50px;',
        '            padding: 10px;',
        '            background-color: rgb(38, 38, 38);',
        '        }',
        '        #message-input {',
        '            flex: 1;',
        '            padding: 12px 16px;',
        '            border: 1px solid #666;',
        '            border-radius: 6px;',
        '            outline: none;',
        '            background-color: #4a4a4a;',
        '            color: #ffffff;',
        '            font-size: 14px;',
        '            min-height: 24px;',
        '            resize: none;',
        '        }',
        '        #message-input:focus {',
        '            border-color:rgb(59, 0, 118);',
        '            box-shadow: 0 0 0 2px rgba(73, 0, 132, 0.2);',
        '        }',
        '        .button {',
        '            padding: 0 24px;',
        '            height: 50px;',
        '            background-color:rgb(80, 0, 160);',
        '            color: white;',
        '            border: none;',
        '            border-radius: 6px;',
        '            font-size: 14px;',
        '            cursor: pointer;',
        '            transition: background-color 0.2s ease;',
        '        }',
        '        .button:hover {',
        '            background-color:rgb(100, 0, 200);',
        '        }',
        '        .button:active {',
        '            background-color:rgb(80, 0, 160);',
        '            transform: translateY(1px);',
        '        }',
        '        .button.stop {',
        '            background-color: #cc3300;',
        '        }',
        '        .button.stop:hover {',
        '            background-color: #ff4000;',
        '        }',
        '        .button.edit {',
        '            background-color: #666666;',
        '        }',
        '        .button.edit:hover {',
        '            background-color: #808080;',
        '        }',
        '        .button-container {',
        '            display: flex;',
        '            gap: 8px;',
        '        }',
        '        .hidden {',
        '            display: none;',
        '        }',
        '        h3 {',
        '            color:rgb(0, 204, 144);',
        '            margin: 15px 0 10px 0;',
        '        }',
        '        pre {',
        '            margin: 0;',
        '        }',
        '        code {',
        '            font-family: "Consolas", "Courier New", monospace;',
        '        }',
        '    </style>',
        '</head>',
        '<body>',
        '    <div id="chat-container">',
        '        <div id="messages"></div>',
        '        <div id="input-container">',
        '            <textarea',
        '                id="message-input"',
        '                placeholder="Ask me anything about geospatial development, AI, or satellite technology!"',
        '                rows="2"',
        '            ></textarea>',
        '            <div class="button-container">',
        '                <button id="sendButton" class="button" onclick="sendMessage()">Send</button>',
        '                <button id="stopButton" class="button stop hidden" onclick="stopGeneration()">Stop</button>',
        '                <button id="editButton" class="button edit hidden" onclick="editMessage()">Edit</button>',
        '                <button id="retryButton" class="button hidden" onclick="retryMessage()">Retry</button>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <script>',
        '        const vscode = acquireVsCodeApi();',
        '        const messageInput = document.getElementById("message-input");',
        '        const messagesDiv = document.getElementById("messages");',
        '        const sendButton = document.getElementById("sendButton");',
        '        const stopButton = document.getElementById("stopButton");',
        '        const editButton = document.getElementById("editButton");',
        '        const retryButton = document.getElementById("retryButton");',
        '',
        '        let lastMessage = "";',
        '        let isGenerating = false;',
        '        let chatHistory = [];',
        '',
        '        const thinkingPattern = new RegExp("<think>(.*?)</think>", "gs");',
        '        const codePattern = new RegExp("```(\\\\w+)?\\\\n([\\\\s\\\\S]*?)```", "g");',
        '        const headerPattern = new RegExp("### (.*)", "g");',
        '',
        '        function formatResponse(text) {',
        '            text = text.replace(thinkingPattern, function(match, content) {',
        '                return \'<div class="thinking-section">\' + content.trim() + "</div>";',
        '            });',
        '',
        '            text = text.replace(codePattern, function(match, lang, code) {',
        '                const highlighted = hljs.highlight(code.trim(), { language: lang || "plaintext" }).value;',
        '                return \'<div class="code-block"><pre><code class="language-\' + ',
        '                       (lang || "plaintext") + \'">\' + highlighted + "</code></pre></div>";',
        '            });',
        '',
        '            text = text.replace(headerPattern, "<h3>$1</h3>");',
        '            return text;',
        '        }',
        '',
        '        function createMessageElement(text, isUser) {',
        '            const messageElement = document.createElement("div");',
        '            messageElement.className = "message " + (isUser ? "user-message" : "assistant-message");',
        '            if (isUser) {',
        '                messageElement.textContent = text;',
        '            } else {',
        '                messageElement.innerHTML = formatResponse(text);',
        '            }',
        '            return messageElement;',
        '        }',
        '',
        '        function appendMessage(text, isUser) {',
        '            const messageElement = createMessageElement(text, isUser);',
        '            messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);',
        '            chatHistory.push({ text: text, isUser: isUser });',
        '        }',
        '',
        '        function sendMessage() {',
        '            const text = messageInput.value.trim();',
        '            if (text && !isGenerating) {',
        '                lastMessage = text;',
        '                vscode.postMessage({',
        '                    command: "chat",',
        '                    text: text',
        '                });',
        '                messageInput.value = "";',
        '                appendMessage(text, true);',
        '                appendMessage("...", false);',
        '                ',
        '                isGenerating = true;',
        '                updateButtonStates();',
        '                ',
        '                messageInput.style.height = "auto";',
        '            }',
        '        }',
        '',
        '        function stopGeneration() {',
        '            vscode.postMessage({ command: "stop" });',
        '        }',
        '',
        '        function editMessage() {',
        '            messageInput.value = lastMessage;',
        '            messageInput.focus();',
        '            editButton.classList.add("hidden");',
        '            retryButton.classList.add("hidden");',
        '            sendButton.classList.remove("hidden");',
        '            ',
        '            messageInput.style.height = "auto";',
        '            messageInput.style.height = messageInput.scrollHeight + "px";',
        '        }',
        '',
        '        function retryMessage() {',
        '            if (lastMessage && !isGenerating) {',
        '                vscode.postMessage({',
        '                    command: "retry",',
        '                    text: lastMessage',
        '                });',
        '                appendMessage(lastMessage + " (Retry)", true);',
        '                appendMessage("...", false);',
        '                isGenerating = true;',
        '                updateButtonStates();',
        '            }',
        '        }',
        '',
        '        function updateButtonStates() {',
        '            sendButton.classList.toggle("hidden", isGenerating);',
        '            stopButton.classList.toggle("hidden", !isGenerating);',
        '            editButton.classList.toggle("hidden", isGenerating);',
        '            retryButton.classList.toggle("hidden", isGenerating);',
        '        }',
        '',
        '        window.addEventListener("message", function(event) {',
        '            const message = event.data;',
        '            switch (message.command) {',
        '                case "chatResponse":',
        '                    const lastMessage = messagesDiv.firstChild;',
        '                    if (lastMessage) {',
        '                        lastMessage.innerHTML = formatResponse(message.text);',
        '                        hljs.highlightAll();',
        '                    }',
        '                    break;',
        '                case "stopped":',
        '                    appendMessage("System: " + message.text, false);',
        '                    isGenerating = false;',
        '                    updateButtonStates();',
        '                    break;',
        '                case "error":',
        '                    appendMessage("Error: " + message.text, false);',
        '                    isGenerating = false;',
        '                    updateButtonStates();',
        '                    break;',
        '                case "generationComplete":',
        '                    isGenerating = false;',
        '                    updateButtonStates();',
        '                    break;',
        '            }',
        '        });',
        '',
        '        messageInput.addEventListener("keypress", function(e) {',
        '            if (e.key === "Enter" && !e.shiftKey) {',
        '                e.preventDefault();',
        '                sendMessage();',
        '            }',
        '        });',
        '',
        '        messageInput.addEventListener("input", function() {',
        '            this.style.height = "auto";',
        '            this.style.height = this.scrollHeight + "px";',
        '        });',
        '',
        '        hljs.highlightAll();',
        '    </script>',
        '</body>',
        '</html>'
    ].join('\n');

    return htmlContent;
}

// This method is called when the extension is deactivated
export function deactivate() {
    isGenerating = false;
}
