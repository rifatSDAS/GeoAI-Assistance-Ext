// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {Ollama} from 'ollama';
import * as vscode from 'vscode';


// Initialize Ollama client
const ollama = new Ollama({
    host: 'http://localhost:11434' // Default Ollama server address
});

const SYSTEM_PROMPT = `You are an expert Full Stack Geospatial Software Engineer with expertise in:
- Geospatial data processing and analysis
- GDAL, OGR, and other geospatial libraries
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

Provide detailed, technical responses with code examples when appropriate. Focus on best practices, performance optimization, and scalable solutions for geospatial applications.`;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension is now active!');

	// Display a message box to the user
	const disposable = vscode.commands.registerCommand('ai-ass-ext.hiDad', () => {
		// // The code you place here will be executed every time your command is executed
		// // Display a message box to the user
		// vscode.window.showInformationMessage('Hi Dad!');

		// Create a web view panel
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'Deep Seek Chat',
			vscode.ViewColumn.One,
			{ enableScripts: true}
		);

		panel.webview.html = getWebviewContent();

		panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';

                try {
                    const response = await ollama.chat({
                        model: 'deepseek-r1:1.5b',
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: userPrompt }
                        ],
                        stream: true
                    });

                    for await (const chunk of response) {
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
                }
            }
        });
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background-color: rgb(38, 38, 38);
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                #chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    gap: 20px;
                }
                #messages {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 20px;
                    border: 1px solid #666;
                    border-radius: 8px;
                    padding: 20px;
                    background-color: rgb(38, 38, 38);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    color: #ffffff;
                    display: flex;
                    flex-direction: column-reverse;
                }
                .message {
                    margin: 8px 0;
                    padding: 10px;
                    border-radius: 6px;
                    max-width: 85%;
                }
                .user-message {
                    background-color: #007acc;
                    align-self: flex-end;
                    margin-left: 15%;
                }
                .assistant-message {
                    background-color: #4a4a4a;
                    align-self: flex-start;
                    margin-right: 15%;
                }
                #input-container {
                    position: sticky;
                    bottom: 0;
                    display: flex;
                    gap: 12px;
                    min-height: 50px;
                    padding: 10px;
                    background-color: rgb(38, 38, 38);
                }
                #message-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #666;
                    border-radius: 6px;
                    outline: none;
                    background-color: #4a4a4a;
                    color: #ffffff;
                    font-size: 14px;
                    min-height: 24px;
                    resize: none;
                }
                #message-input:focus {
                    border-color: #007acc;
                    box-shadow: 0 0 0 2px rgba(0,122,204,0.2);
                }
                button {
                    padding: 0 24px;
                    height: 50px;
                    background-color: #007acc;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                button:hover {
                    background-color: #106ebe;
                }
                button:active {
                    background-color: #005a9e;
                    transform: translateY(1px);
                }
            </style>
        </head>
        <body>
            <div id="chat-container">
                <div id="messages"></div>
                <div id="input-container">
                    <textarea
                        id="message-input"
                        placeholder="Ask me anything about geospatial development, AI, or satellite technology!"
                        rows="2"
                    ></textarea>
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                const messageInput = document.getElementById('message-input');
                const messagesDiv = document.getElementById('messages');

                // Store chat history
                let chatHistory = [];

                function createMessageElement(text, isUser) {
                    const messageElement = document.createElement('div');
                    messageElement.className = 'message ' + (isUser ? 'user-message' : 'assistant-message');
                    messageElement.textContent = text;
                    return messageElement;
                }

                function appendMessage(text, isUser) {
                    const messageElement = createMessageElement(text, isUser);
                    messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);
                    chatHistory.push({ text, isUser });
                }

                function sendMessage() {
                    const text = messageInput.value.trim();
                    if (text) {
                        vscode.postMessage({
                            command: 'chat',
                            text: text
                        });
                        appendMessage(text, true);
                        messageInput.value = '';
                        appendMessage('...', false); // Placeholder for assistant response
                    }
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'chatResponse':
                            // Update the last message (placeholder) with the actual response
                            const lastMessage = messagesDiv.firstChild;
                            if (lastMessage) {
                                lastMessage.textContent = message.text;
                            }
                            break;
                        case 'error':
                            appendMessage('Error: ' + message.text, false);
                            break;
                    }
                });

                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });

                // Auto-resize textarea
                messageInput.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            </script>
        </body>
        </html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
