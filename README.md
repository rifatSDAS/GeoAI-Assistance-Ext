# ai-ass-ext

**ai-ass-ext** is a Visual Studio Code extension that provides an integrated chat interface built for geospatial software engineering. Using the power of the Ollama API and a custom system prompt, the extension helps you get expert advice on geospatial data processing, remote sensing, web mapping, full stack development, and more from within VS Code.

## Features

- **Geospatial Chat:** Ask questions related to geospatial development, satellite technology, machine learning, and more. The chat leverages a custom AI system prompt to provide detailed and technical responses.
- **Interactive Webview UI:** A modern chat interface with a messages area, an input box, and a send button for quick interactions.
- **Real-Time Streaming:** Uses streaming responses from the Ollama chat API to display assistant output as it’s generated.
- **Development Focused:** Provides code examples, tips, and best practices tailored for full stack geospatial software engineering.

## Requirements

Before using **ai-ass-ext**, ensure you have the following installed:
- [Ollama](https://ollama.com) running on your machine (default server hosted at `http://localhost:11434`).
- Node.js and npm to install dependencies for the extension.
- Visual Studio Code with Extension Development Host support.

## Installation

1. Clone the repository.
2. Run `npm install` in the project folder.
3. Build the extension (if necessary, verify your webpack or compile configuration).

## Running the Extension

1. Open the project in Visual Studio Code.
2. Press **F5** to launch the extension in a new Extension Development Host window.
3. Open the Command Palette (Ctrl+Shift+P) and execute the command `ai-ass-ext.hiDad` to open the chat webview.
4. Interact with the chat panel by typing your questions and reading the assistant’s response.

## Extension Settings

Currently, **ai-ass-ext** does not expose additional configuration options through VS Code settings. Future updates may include customizable settings.

## Known Issues

- Ensure that the Ollama server is running when using the extension. If the connection fails, the extension will prompt an error.
- The extension's chat interface appearance may vary on different screen sizes. Contributions to improve UI responsiveness are welcome.

## Release Notes

### 0.0.1
- Initial release of **ai-ass-ext**
- Basic functionality to ask geospatial related questions via a chat interface.
- Integrated Ollama chat API for real-time streaming responses.
- UI improvements in the chat panel, including modernized button design and responsive messaging area.
- Minor bug fixes and enhancements based on initial feedback.

---

## Following Extension Guidelines

Make sure to review the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) for best practices and to keep your extension up-to-date with community standards.

## Working with Markdown in VS Code

- **Split the editor:** Use `Ctrl+\` (Windows/Linux) or `Cmd+\` (macOS).
- **Toggle Preview:** Use `Shift+Ctrl+V` (Windows/Linux) or `Shift+Cmd+V` (macOS).
- **IntelliSense for Markdown:** Use `Ctrl+Space` to see Markdown snippets.

## For More Information

- [Visual Studio Code Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy using ai-ass-ext and happy coding!**
