# GeoAI Assistance Extension

**GeoAI Assistance Extension** is a Visual Studio Code extension that delivers an integrated AI chat interface specifically designed for **Geospatial** tasks, operating entirely on your *local machine*. Leveraging the **Ollama API** and a custom system prompt, this extension offers expert guidance on geospatial data analysis and processing — including vector and raster data, web GIS, and more, while allowing you to fully control and customize your experience within the VS Code environment.

## Features

- **Geospatial Chat:** Ask questions related to geospatial data analysis, satellite technology, machine learning, deep learning and more.
- **AI Model:** The *Geospatial Chat* leverages a custom AI system prompt to provide detailed and technical responses. **DeepSeek-R1-Distill-Qwen-1.5B** model is used for this project through **Ollama API**. **DeepSeek-R1-Distill-Qwen-1.5B** is the DeepSeek's first-generation of reasoning models with *Distillation* method, which is comparable to **OpenAI-o1** models.
- **Interactive Webview UI:** A modern chat interface with a messages area, an input box, a *Send* button for quick interactions, an *Edit* button for editing the recent prompt, and a *Retry* button to resend the prompt again.
- **Real-Time Streaming:** Uses streaming responses from the Ollama chat API to display assistant output as it’s generated.
- **Development Focused:** The AI responses with code examples, explanation, best practices, and notes tailored for specific **Geospatial** tasks the user is looking for.

## Requirements

Before using **GeoAI Assistance Extension**, ensure you have the following installed:
- [Ollama](https://ollama.com). After installing check the **Ollama server** at `http://localhost:11434`.
- After installing **Ollama** pull **DeepSeek-R1-Distill-Qwen-1.5B** model by this command from your terminal `ollama run deepseek-r1:1.5b`.
  NOTE: You are free to choose any LLM reasoning models based on your machine setups and your custom requirements. In this case, make sure you pulled that model with **Ollama API**.
- **Node.js** and **npm** to install dependencies for the extension.
- **Visual Studio Code** with **Extension Development Host** support.
- **Git** for version management.

## Tech Stacks

- **TypeScript:** *TypeScript* is used for extension code, ensuring type safety and modern JavaScript features.
- **NodeJS:** *NodeJS* is used for building and running the backend logic of the extension.
- **Webpack:** *Webpack* is used as the module bundler to compile and bundle the extension's code.
- **ESLint:** *ESLint* is used for maintaining code quality and enforcing consistent coding standards.
- **Mocha:** *Mocha* is used as the testing framework for writing and running unit tests.
- **VS Code API:** The extension leverages the *VS Code API* to integrate seamlessly with the Visual Studio Code environment.
- **Ollama API:** The extension integrates with the **Ollama API** to provide AI-powered geospatial assistance using the **DeepSeek-R1-Distill-Qwen-1.5B** model.
- **HTML/CSS/JavaScript:** Used to create the interactive webview UI for the chat interface.

## Installation

1. Clone the repository.
2. Run `npm install` in the project folder.
3. Build the extension on your local machine (if necessary, verify and modify your webpack or compile configuration).

## Running the Extension

1. Open the project in Visual Studio Code.
2. From VS Code **Run and Debug** tab Press ***Run Extension*** (A green Run button) OR Press **F5** to launch the extension in a new Extension Development Host window.
3. Open the Command Palette by pressing `Ctrl+Shift+P` and execute the command `geoai-assistance-ext.hiGeoAI` to open the chat webview.
4. Interact with the chat panel by typing your questions and reading the assistant’s response.

## Extension Settings

Currently, **GeoAI Assistance Extension** does not expose additional configuration options through VS Code settings. Future updates may include customizable settings. As the main goal of this project is to have an **GeoAI Assistance Extension** entirely on user local machine, so in future update, it will try to include customizable settings for different development environment, e.g., Unix, Windows, macOS.

## Known Issues

- **Ollama server:** Ensure that the **Ollama server** is running when using the extension. If the connection fails, the extension will prompt an error. You can check your **Ollama server** at `http://localhost:11434`.
- **Responsive UI:** The extension's chat interface appearance may vary on different screen sizes. Contributions to improve UI responsiveness are welcome. Although it has been tested with mobile size screen :-).
- **The Memory Issue:** The memory issue is common on machine with minimum GPU while many tasks sharing memory. As an example `Error: Error: llama runner process has terminated: cudaMalloc failed: out of memory` is a common error when limited memory occur due to multiple tasks running on a machine with NVIDIA Geoforce GTX 2GB memory.

## Release Notes

### 0.0.1
- Initial release of **GeoAI Assistance Extension**.
- Basic functionality to ask geospatial related questions via a chat interface.
- Integrated **Ollama chat API** for real-time streaming responses.
- Using **DeepSeek-R1-Distill-Qwen-1.5B**, a light weight reasoning model with **Distillation** method. This light weight model make sure that the **GeoAI Assistance Extension** can be build and run any machine with minimum *GPU* and *CUDA*.
- UI improvements in the chat panel, including modernized button design and responsive messaging area.
- Minor bug fixes and enhancements based on initial feedback.
- The model must need more training, however, it is just the first steps of millions in the future :-).
- The extension need obvious improvement and continuous development, so contribution is highly appreciated!

---

## Extension Guidelines

Make sure to review the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) for best practices and to keep your extension up-to-date with community standards.

## Working with Markdown in VS Code

- **Split the editor:** Use `Ctrl+\` (Windows/Linux) or `Cmd+\` (macOS).
- **Toggle Preview:** Use `Shift+Ctrl+V` (Windows/Linux) or `Shift+Cmd+V` (macOS).
- **IntelliSense for Markdown:** Use `Ctrl+Space` to see Markdown snippets.

## For More Information

- [Visual Studio Code Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy using GeoAI Assistance Extension on your local machine!**
***Your active contribution will keep alive this Opensource project*** :)
