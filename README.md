# YTSubs: AI-Powered YouTube Subtitle generator

### Disclaimer
This is just a small sideproject. It does not include any best practice and is more a proof of concept than something really useful. If you can make it or fork it into something useful, feel free to do so

YTSubs is a web application that allows users to extract subtitles from YouTube videos using Client side loaded models from [transformers.js](https://github.com/xenova/transformers.js/tree/v3)

## Features
- Experimental running on WebGPU from [transformers v3](https://github.com/xenova/transformers.js/tree/v3)
- generate subtitles from YouTube videos using client side ai
- Process videos up to 20 minutes long
- Transcribes multiple languages
- Streaming transcription progress updates
- Download subtitles in SRT format
- Fully client-side processing

## Tech Stack

- [Nuxt.js 3](https://nuxt.com/) - Vue.js framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Hugging Face Transformers](https://huggingface.co/transformers/) - State-of-the-art Natural Language Processing
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) - For background processing
- [PostHog](https://posthog.com/) - Open-source product analytics

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ytsubs.git
   cd ytsubs
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```
   # Hosted domain
   DOMAIN=your_domain

   # Path to store mp3 files that needs to be converted to .wav
   PATH_TO_STORE_TEMP_FILES=path_to_temp_files

   # Public download path
   PATH_TO_DOWNLOAD_FILES=path_to_download_files
   ```

4. Run the development server:
   ```
   pnpm run dev
   ```

5. Open `http://localhost:3000` in your browser to see the application.

## Usage

1. Enter a YouTube URL in the input field.
2. Select the language of the video.
3. Click "Transcribe" to start the process.
4. Wait for the transcription to complete.
5. Download the SRT file with the extracted subtitles.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [Whisper](https://github.com/openai/whisper) - The AI model powering our transcription
- [Transformers.js](https://github.com/xenova/transformers.js) - For running Whisper models in the browser
- [ytdl-mp3](https://github.com/joshunrau/ytdl-mp3). - For YouTube audio extraction

## Contact

Twitter - [@eothica](https://twitter.com/eothica)

Project Link: [https://github.com/ThomasWT/caption-youtube](https://github.com/ThomasWT/caption-youtube)

