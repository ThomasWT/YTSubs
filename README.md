
# YTSubs: AI-Powered YouTube Subtitle generator

### Disclaimer
This is just a small sideproject. It does not include any best practice and is more a proof of concept than something really useful. If you can make it or fork it into something useful, feel free to do so

YTSubs is a web application that allows users to generate subtitles from YouTube videos using Client side loaded models from [transformers.js](https://github.com/xenova/transformers.js/tree/v3)

> [!WARNING]  
> As of October 2024, global WebGPU support is around 70% (according to [caniuse.com](https://caniuse.com/webgpu)), meaning some users may not be able to use the API.
>
> If the following demos do not work in your browser, you may need to enable it using a feature flag: 
>
> - Firefox: with the `dom.webgpu.enabled` flag (see [here](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features#:~:text=tested%20by%20Firefox.-,WebGPU%20API,-The%20WebGPU%20API)).
> - Safari: with the `WebGPU` feature flag (see [here](https://webkit.org/blog/14879/webgpu-now-available-for-testing-in-safari-technology-preview/)).
> - Older Chromium browsers (on Windows, macOS, Linux): with the `enable-unsafe-webgpu` flag (see [here](https://developer.chrome.com/docs/web-platform/webgpu/troubleshooting-tips)).

## Features
- Experimental running on WebGPU from [transformers v3](https://github.com/xenova/transformers.js/tree/v3)
- Generate subtitles from YouTube videos using client side ai
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

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ThomasWT/YTSubs.git
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

