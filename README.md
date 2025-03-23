# Shout.ai

Shout.ai is a lightweight, AI-powered tool for summarizing meetings and speaker discussions in real time. It quickly processes spoken content and generates concise, accurate summaries, saving you time and effort.

## Features
- 🔊 **Real-time Transcription**: Converts speech to text instantly.
- 📝 **Smart Summarization**: Extracts key points from conversations.
- 📂 **Easy Integration**: Works with various audio sources.
- 🔐 **Secure Processing**: Keeps data private with local processing options.

## Installation

### Prerequisites
- **Node.js** (Ensure you have Node.js installed on your system)
- **npm** (Node Package Manager)

### Steps
1. Clone this repository:
   ```sh
   git clone https://github.com/theYoey/shout.git
   ```
2. Navigate to the project directory:
   ```sh
   cd shout
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and configure your API keys:
   ```sh
   touch .env
   ```
   Add the following:
   ```sh
   API_KEY=your_api_key_here
   ```
5. Run the application:
   ```sh
   npm start
   ```

## Usage
1. Upload or stream an audio file.
2. Let the AI process the speech.
3. Receive a summarized version of the content.

## Tech Stack
- **Frontend**: HTML, JavaScript
- **Backend**: Node.js
- **APIs Used**: AssemblyAI (for speech-to-text processing)

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, reach out to [theYoey](https://github.com/theYoey).

