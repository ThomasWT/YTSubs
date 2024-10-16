<template>
  <div class="min-h-screen flex items-center justify-center p-4 font-[Inter]">
    <div v-motion="{ initial: { opacity: 0, y: 30, }, enter: { opacity: 1, y: 0, transition: { duration: 1000 } } }"
      class="cardcontainer backdrop-blur-md bg-purple-300/50 rounded-lg shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-400/30">
      <div class="flex flex-col justify-center  items-center  mb-8">
        <h1
          v-motion="{ initial: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }, enter: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1000 } } }"
          class="text-4xl font-bold text-center py-2 px-4 bg-gradient-to-br from-slate-800 to-purple-500 text-transparent bg-clip-text stroke-effect tracking-tighter">
          YTSubs <span
            v-motion="{ initial: { opacity: 0, y: 60 }, enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 500 } } }"
            class="border border-purple-500 text-purple-500 shadow-sm text-xs font-medium me-2 px-2.5 py-0.5 rounded  tracking-normal">Free</span>
        </h1>

        <p v-motion="{ initial: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }, enter: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1000, delay: 100 } } }"
          class="text-purple-800 tracking-wider font-bold">Transcribe a video with your browser</p>
      </div>
      <div
        v-motion="{ initial: { opacity: 0, y: 30 }, enter: { opacity: 1, y: 0, transition: { duration: 1000, delay: 0 } } }"
        class="mb-6 flex gap-2">
        <input v-model="transcription" type="text" placeholder="Enter YouTube URL"
          class="w-full px-4 py-1 rounded-md border border-gray-300 focus:outline-none bg-white placeholder-purple-400" />
        <select
          class="max-w-24 py-2 rounded-md border border-gray-300 focus:outline-none bg-white placeholder-purple-400"
          v-model="selectedLanguage">
          <option v-for="lang in languages">{{ lang }}</option>
        </select>
      </div>
      <div
        v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0, transition: { duration: 1200, delay: 100 } } }"
        class="mb-6">
        <button @click="handleFileUpload"
          class="w-full bg-purple-900/50 backdrop-blur-md text-white py-2 px-4 rounded-md hover:bg-purple-900/40 transition duration-300 border border-white/30 shadow-lg"
          :disabled="loading">
          <div class="w-full flex justify-center items-center h-6 overflow-hidden">
            <Transition name="slide-up">
              <span class="absolute" v-if="loading">
                <div class="flex" role="status">
                  <svg aria-hidden="true" class="w-6 h-6 text-purple-200 animate-spin fill-purple-400"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
                  </svg>
                  <p v-show="!estimatedProcessingTime" class="ml-3 text-white">Downloading..</p>
                  <Transition name="slide-up">
                    <p v-show="estimatedProcessingTime" class="ml-3 text-white">{{ estimatedProcessingTime }}</p>
                  </Transition>
                </div>
              </span>
              <span v-else>Transcribe</span>
            </Transition>
          </div>
        </button>
      </div>


      <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {{ error }}
      </div>
      <div>
        <div class="flex justify-center">
          <a target="_blank" href="https://github.com/ThomasWT/YTSubs">
            <svg class="fill-purple-800 opacity-40 w-8 h-8 hover:scale-105 transition-all"
              xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
              <path
                d="M 12 2 C 6.476563 2 2 6.476563 2 12 C 2 17.523438 6.476563 22 12 22 C 17.523438 22 22 17.523438 22 12 C 22 6.476563 17.523438 2 12 2 Z M 12 4 C 16.410156 4 20 7.589844 20 12 C 20 12.46875 19.953125 12.929688 19.875 13.375 C 19.628906 13.320313 19.265625 13.253906 18.84375 13.25 C 18.53125 13.246094 18.140625 13.296875 17.8125 13.34375 C 17.925781 12.996094 18 12.613281 18 12.21875 C 18 11.257813 17.53125 10.363281 16.78125 9.625 C 16.988281 8.855469 17.191406 7.535156 16.65625 7 C 15.074219 7 14.199219 8.128906 14.15625 8.1875 C 13.667969 8.070313 13.164063 8 12.625 8 C 11.933594 8 11.273438 8.125 10.65625 8.3125 L 10.84375 8.15625 C 10.84375 8.15625 9.964844 6.9375 8.34375 6.9375 C 7.777344 7.507813 8.035156 8.953125 8.25 9.6875 C 7.484375 10.417969 7 11.28125 7 12.21875 C 7 12.546875 7.078125 12.859375 7.15625 13.15625 C 6.878906 13.125 5.878906 13.03125 5.46875 13.03125 C 5.105469 13.03125 4.542969 13.117188 4.09375 13.21875 C 4.03125 12.820313 4 12.414063 4 12 C 4 7.589844 7.589844 4 12 4 Z M 5.46875 13.28125 C 5.863281 13.28125 7.0625 13.421875 7.21875 13.4375 C 7.238281 13.492188 7.257813 13.542969 7.28125 13.59375 C 6.851563 13.554688 6.019531 13.496094 5.46875 13.5625 C 5.101563 13.605469 4.632813 13.738281 4.21875 13.84375 C 4.1875 13.71875 4.148438 13.597656 4.125 13.46875 C 4.5625 13.375 5.136719 13.28125 5.46875 13.28125 Z M 18.84375 13.5 C 19.242188 13.503906 19.605469 13.570313 19.84375 13.625 C 19.832031 13.691406 19.796875 13.746094 19.78125 13.8125 C 19.527344 13.753906 19.109375 13.667969 18.625 13.65625 C 18.390625 13.652344 18.015625 13.664063 17.6875 13.6875 C 17.703125 13.65625 17.707031 13.625 17.71875 13.59375 C 18.058594 13.546875 18.492188 13.496094 18.84375 13.5 Z M 6.09375 13.78125 C 6.65625 13.785156 7.183594 13.824219 7.40625 13.84375 C 7.929688 14.820313 8.988281 15.542969 10.625 15.84375 C 10.222656 16.066406 9.863281 16.378906 9.59375 16.75 C 9.359375 16.769531 9.113281 16.78125 8.875 16.78125 C 8.179688 16.78125 7.746094 16.160156 7.375 15.625 C 7 15.089844 6.539063 15.03125 6.28125 15 C 6.019531 14.96875 5.929688 15.117188 6.0625 15.21875 C 6.824219 15.804688 7.097656 16.5 7.40625 17.125 C 7.683594 17.6875 8.265625 18 8.90625 18 L 9.03125 18 C 9.011719 18.109375 9 18.210938 9 18.3125 L 9 19.40625 C 6.691406 18.472656 4.933594 16.5 4.28125 14.0625 C 4.691406 13.960938 5.152344 13.855469 5.5 13.8125 C 5.660156 13.792969 5.863281 13.777344 6.09375 13.78125 Z M 18.625 13.90625 C 19.074219 13.917969 19.472656 14.003906 19.71875 14.0625 C 19.167969 16.132813 17.808594 17.855469 16 18.90625 L 16 18.3125 C 16 17.460938 15.328125 16.367188 14.375 15.84375 C 15.957031 15.554688 16.988281 14.863281 17.53125 13.9375 C 17.910156 13.910156 18.355469 13.898438 18.625 13.90625 Z M 12.5 18 C 12.773438 18 13 18.226563 13 18.5 L 13 19.9375 C 12.671875 19.980469 12.339844 20 12 20 L 12 18.5 C 12 18.226563 12.226563 18 12.5 18 Z M 10.5 19 C 10.773438 19 11 19.226563 11 19.5 L 11 19.9375 C 10.664063 19.894531 10.324219 19.832031 10 19.75 L 10 19.5 C 10 19.226563 10.226563 19 10.5 19 Z M 14.5 19 C 14.742188 19 14.953125 19.175781 15 19.40625 C 14.675781 19.539063 14.34375 19.660156 14 19.75 L 14 19.5 C 14 19.226563 14.226563 19 14.5 19 Z">
              </path>
            </svg>
          </a>
          <a target="_blank" href="https://x.com/eoThica">
            <svg  class="fill-purple-800 opacity-40 w-8 h-8 hover:scale-105 transition-all" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
<path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,6v12	c0,1.657-1.343,3-3,3H6c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h12C19.657,3,21,4.343,21,6z M17.538,17l-4.186-5.99L16.774,7	h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
</svg>
          </a>
        </div>
      </div>
      <div v-if="srtContent" class="mb-6 gap-2 flex flex-col">
        <div class="flex justify-end">
          <button :disabled="loading" class="text-white rounded-md flex items-center" @click="downloadSRT">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>

        <pre class="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto shadow-md">{{ srtContent }}</pre>

        <div v-if="srtContent" class="mb-6 gap-2 flex flex-col">
          <div class="flex justify-end">
            <button :disabled="loading" class="text-white rounded-md flex items-center" @click="downloadSRT">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import transcriberWorker from '../assets/workers/exampleWorker?worker'
import { WaveFile } from 'wavefile';
// State
const transcription = ref('')
const resultTranscript = ref('')
const srtContent = ref('')
const loading = ref(false)
const error = ref('')
const filename = ref('')
const duration = ref(0)
const elapsedTime = ref(0)
const processingStartTime = ref(0)
// Composables
const { $posthog } = useNuxtApp()
const posthog = $posthog()
const route = useRoute()
const config = useRuntimeConfig()
const selectedLanguage = ref('english')
const languages = [
  "afrikaans",
  "albanian",
  "amharic",
  "arabic",
  "armenian",
  "assamese",
  "azerbaijani",
  "bashkir",
  "basque",
  "belarusian",
  "bengali",
  "bosnian",
  "breton",
  "bulgarian",
  "catalan/valencian",
  "chinese",
  "croatian",
  "czech",
  "danish",
  "dutch/flemish",
  "english",
  "estonian",
  "faroese",
  "finnish",
  "french",
  "galician",
  "georgian",
  "german",
  "greek",
  "gujarati",
  "haitian creole/haitian",
  "hausa",
  "hawaiian",
  "hebrew",
  "hindi",
  "hungarian",
  "icelandic",
  "indonesian",
  "italian",
  "japanese",
  "javanese",
  "kannada",
  "kazakh",
  "khmer",
  "korean",
  "lao",
  "latin",
  "latvian",
  "lingala",
  "lithuanian",
  "luxembourgish/letzeburgesch",
  "macedonian",
  "malagasy",
  "malay",
  "malayalam",
  "maltese",
  "maori",
  "marathi",
  "mongolian",
  "myanmar/burmese",
  "nepali",
  "norwegian",
  "nynorsk",
  "occitan",
  "pashto/pushto",
  "persian",
  "polish",
  "portuguese",
  "punjabi/panjabi",
  "romanian/moldavian/moldovan",
  "russian",
  "sanskrit",
  "serbian",
  "shona",
  "sindhi",
  "sinhala/sinhalese",
  "slovak",
  "slovenian",
  "somali",
  "spanish/castilian",
  "sundanese",
  "swahili",
  "swedish",
  "tagalog",
  "tajik",
  "tamil",
  "tatar",
  "telugu",
  "thai",
  "tibetan",
  "turkish",
  "turkmen",
  "ukrainian",
  "urdu",
  "uzbek",
  "vietnamese",
  "welsh",
  "yiddish",
  "yoruba"
]

const pathToDownloadFiles = config.public.path_to_download_files
// Capture pageview
posthog?.capture('$pageview', {
  current_url: route.fullPath
})

// Estimate time to process from a baseline
const estimatedProcessingTime = computed(() => {
  if (duration.value > 0) {
    // Data points
    const durations = [136, 20, 76]; // in seconds
    const processingTimes = [50, 30, 42]; // in seconds

    // Calculate slope and intercept for linear regression
    const n = durations.length;
    const sumX = durations.reduce((a, b) => a + b, 0);
    const sumY = processingTimes.reduce((a, b) => a + b, 0);
    const sumXY = durations.reduce((sum, x, i) => sum + x * processingTimes[i], 0);
    const sumXX = durations.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Estimate processing time
    const estimatedSeconds = Math.round(slope * duration.value + intercept);
    const minutes = Math.floor(estimatedSeconds / 60);
    const seconds = estimatedSeconds % 60;

    return minutes > 0
      ? `ETA: ${minutes} min${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`
      : `ETA: ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  return '';
});

const formatArrayBuffer = async (url) => {
  // Fetch the audio data as an ArrayBuffer
  const response = await fetch(process.env.NODE_ENV == 'development' ? url : config.public.path_to_download_files + url);
  const arrayBuffer = await response.arrayBuffer();

  // Create a Uint8Array from the ArrayBuffer
  let audioData = new Uint8Array(arrayBuffer);

  // Read .wav file and convert it to required format
  let wav = new WaveFile(audioData);
  wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
  audioData = wav.getSamples();

  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);

      // Merge channels (into first channel to save memory)
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
      }
    }

    // Select first channel
    return audioData = audioData[0];
  }
}

const testWorkerProcessing = async (filepath) => {
  try {
    return new Promise(async (resolve, reject) => {
      const worker = new transcriberWorker()

      const audioData = await formatArrayBuffer(filepath)

      worker.postMessage({ audio: audioData, language: selectedLanguage.value })



      worker.addEventListener('message', (e) => {
        if (e) {
          if (e.data.status == 'update') {
            srtContent.value = generateSRT(e.data.data.chunks)
          } else {
            if (e.data.status == 'complete') {
              resolve(e.data)
              worker.terminate()
            }
          }
        }
      }, false)

      worker.addEventListener('error', (error) => {
        reject(error)
        worker.terminate()
      })
    })
  } catch (error) {
    console.error('Error in testWorkerProcessing:', error)
    throw error
  }
}

const getAudioData = async (url) => {

}



const transcribeAudio = async (filepath: string): Promise<any> => {
  try {
    return await testWorkerProcessing(filepath)
  } catch (err) {
    console.error('Transcription error:', err)
    return null
  }
}

const downloadSRT = () => {
  if (srtContent.value) {
    posthog?.capture('Download SRT')
    const blob = new Blob([srtContent.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename.value.replace('.mp3', '')}.srt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

const handleFileUpload = async () => {
  // Set loading state and reset error
  loading.value = true
  error.value = ''
  duration.value = 0
  // Initialize processing time tracking
  processingStartTime.value = Date.now()
  elapsedTime.value = 0

  // Delete any existing file before processing
  await deleteExistingFile()

  // Validate input: check if URL is provided
  if (!transcription.value) {
    error.value = 'Please enter a YouTube URL'
    loading.value = false
    return
  }

  // Validate input: check if URL is a valid YouTube URL
  if (!isValidYouTubeUrl(transcription.value)) {
    error.value = 'Please enter a valid YouTube URL containing a video ID (v= parameter)'
    loading.value = false
    return
  }

  try {
    // Track transcription event in PostHog
    posthog?.capture('Transcribing', { property: transcription.value })

    // Download audio from the provided URL
    const filestuff = JSON.parse(await downloadAudio(transcription.value))
    filename.value = filestuff.name
    if (!filename.value) {
      error.value = 'Failed to download audio. Please check the URL and try again.'
      loading.value = false
      return
    }

    // Process the downloaded audio file
    await processAudioFile(filestuff)
  } catch (err: any) {
    // Handle any errors that occur during the process
    error.value = `${err.statusMessage || 'Unknown error'}`
    loading.value = false
  }
}

const deleteExistingFile = async () => {
  await $fetch('/api/mp3downloader', {
    query: { delfile: filename.value }
  })
}

const isValidYouTubeUrl = (url: string): boolean => {
  return url.includes('v=')
}

const downloadAudio = async (url: string): Promise<string> => {
  return await $fetch('/api/mp3downloader', {
    query: { url: encodeURIComponent(url) }
  })
}

// Function to process the downloaded audio file
const processAudioFile = async (filepath: string) => {
  // Create a new Audio object with the given file path
  const audio = new Audio(process.env.NODE_ENV == 'development' ? filepath.url : config.public.path_to_download_files + filepath.url)

  // Add an event listener for when the audio metadata is loaded
  audio.addEventListener('loadedmetadata', async () => {
    // Set the duration of the audio
    duration.value = audio.duration
    console.log(`MP3 file length: ${duration.value} seconds`)

    // Check if the audio duration exceeds the maximum allowed length (20 minutes)
    if (duration.value > 1200) {
      error.value = 'Video too long. Max 20 minutes'
      loading.value = false
      return
    }

    // Attempt to transcribe the audio file
    const result = await transcribeAudio(filepath.url)

    if (result) {
      loading.value = false
      // Delete the temporary audio file after processing
      await deleteExistingFile()
    } else {
      // If transcription fails, set an error message
      error.value = 'Error. Try again.'
      loading.value = false
    }
  })
}

const generateSRT = (chunks: any[]): string => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });

  // Call scrollToBottom after generating SRT content
  return chunks.map((chunk, index) => {
    const startTime = formatSRTTime(chunk.timestamp[0])
    const endTime = formatSRTTime(chunk.timestamp[1])
    return `${index + 1}\n${startTime} --> ${endTime}\n${chunk.text.trim()}\n\n`
  }).join('\n')
}

const formatSRTTime = (seconds: number): string => {
  const date = new Date(seconds * 1000)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const secs = date.getUTCSeconds().toString().padStart(2, '0')
  const ms = date.getUTCMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${secs},${ms}`
}

onMounted(() => {
  const updateCursor = ({ x, y }: { x: number, y: number }) => {
    const cardContainer = document.querySelector('.cardcontainer')
    if (cardContainer) {
      const rect = cardContainer.getBoundingClientRect()
      const distanceFromTop = rect.top
      const distanceFromLeft = rect.left
      document.documentElement.style.setProperty('--x', (x - distanceFromLeft).toString())
      document.documentElement.style.setProperty('--y', (y - distanceFromTop).toString())
    }
  }

  document.body.addEventListener('pointermove', updateCursor)
})
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(0.7rem);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-0.7rem);
}

.cardcontainer:hover {
  --active: 1;
}

.cardcontainer:after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), hsla(293, 84%, 55%, 0.142), transparent 15vmin);
  background-attachment: fixed;
  opacity: var(--active, 0);
  transition: opacity 0.2s;
  pointer-events: none;
}

.cardcontainer:before {
  border-radius: 6px;
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at calc(var(--x) * 1px) calc(var(--y) * 1px), hsl(0 0% 100% / 0.5), transparent 15vmin),
    transparent;
  background-attachment: fixed;
  pointer-events: none;
  mask:
    linear-gradient(rgb(192 132 252 / 0.3), rgb(192 132 252 / 0.3)) 50% 0 / 100% 4px no-repeat,
    linear-gradient(rgb(192 132 252 / 0.3), rgb(192 132 252 / 0.3)) 50% 100% / 100% 4px no-repeat,
    linear-gradient(rgb(192 132 252 / 0.3), rgb(192 132 252 / 0.3)) 0 50% / 4px 100% no-repeat,
    linear-gradient(rgb(192 132 252 / 0.3), rgb(192 132 252 / 0.3)) 100% 50% / 4px 100% no-repeat;
}
</style>