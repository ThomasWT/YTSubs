<template>
  <div class="min-h-screen flex items-center justify-center p-4 font-[Inter]">
    <div v-motion="{ initial: { opacity: 0, y: 30, }, enter: { opacity: 1, y: 0, transition: { duration: 1000 } } }"
      class="cardcontainer backdrop-blur-md bg-purple-300/30 rounded-lg shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-400/30">
      <div class="flex flex-col justify-center  items-center  mb-8">
        <h1
          v-motion="{ initial: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }, enter: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1000 } } }"
          class="text-4xl font-bold text-center py-2 px-4 bg-gradient-to-br from-slate-800 to-purple-500 text-transparent bg-clip-text stroke-effect tracking-tighter">
          YTSubs <span
            v-motion="{ initial: { opacity: 0, y: 60 }, enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 500 } } }"
            class="border border-purple-500 text-purple-500 shadow-sm text-xs font-medium me-2 px-2.5 py-0.5 rounded  tracking-normal">Free</span>
        </h1>

        <p v-motion="{ initial: { opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }, enter: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1000, delay: 100 } } }"
          class="text-purple-600 tracking-wider font-bold">Transcribe a video with your browser</p>
      </div>
      <div
        v-motion="{ initial: { opacity: 0, y: 30 }, enter: { opacity: 1, y: 0, transition: { duration: 1000, delay: 0 } } }"
        class="mb-6">
        <input v-model="transcription" type="text" placeholder="Enter YouTube URL"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white placeholder-purple-400" />
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pipeline, env } from '@xenova/transformers'
import transcriberWorker from '../assets/workers/transcriber?worker'
import {WaveFile} from 'wavefile';
// Configure transformers environment
env.allowLocalModels = false
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

const pathToDownloadFiles = config.public.path_to_download_files
// Capture pageview
posthog?.capture('$pageview', {
  current_url: route.fullPath
})

// Estimate time to process from a baseline
const estimatedProcessingTime = computed(() => {
  if (duration.value > 0) {
    const baselineDuration = 76 // 1 minute and 16 seconds in seconds
    const baselineProcessingTime = 48 // 52 seconds to process
    const estimatedSeconds = Math.round(duration.value * (baselineProcessingTime / baselineDuration))
    const minutes = Math.floor(estimatedSeconds / 60)
    const seconds = estimatedSeconds % 60
    return `ETA: ${minutes} min${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  return ''
})


const convertSampels = (waveFile) => {
  

  if (!waveFile || !waveFile.wavData || !waveFile.sampleRate) {
      throw new Error('Invalid response from server')
    }

    // Decode the base64 string to an ArrayBuffer
    const binaryString = atob(waveFile.wavData)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    console.log('Uint8Array length:', bytes.length)

    // Parse WAV header and extract audio data
    const dataView = new DataView(bytes.buffer)
    const format = String.fromCharCode(...bytes.slice(0, 4))
    if (format !== 'RIFF') {
      throw new Error('Invalid WAV format')
    }

    let offset = 12 // Skip RIFF header
    while (true) {
      const chunkType = String.fromCharCode(...bytes.slice(offset, offset + 4))
      const chunkSize = dataView.getUint32(offset + 4, true)
      if (chunkType === 'data') {
        offset += 8 // Skip chunk header
        break
      }
      offset += 8 + chunkSize
    }

    // Extract audio samples
    const samples = new Float32Array((bytes.length - offset) / 4)
    for (let i = 0; i < samples.length; i++) {
      samples[i] = dataView.getFloat32(offset + i * 4, true)
    }
    return samples
}

const testWorkerProcessing = async (filepath) => {
  try {
    console.log('Requesting audio data for:', filepath)
    const response = await $fetch('/api/getprocessedaudio', {
      headers: useRequestHeaders(),
      query: {
        url: encodeURIComponent(filepath)
      }
    })



    return new Promise((resolve, reject) => {
      const worker = new transcriberWorker()

      worker.postMessage(convertSampels(response))
      worker.addEventListener('message', (e) => {
        if (e) {
          resolve(e.data)
          worker.terminate()
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
/*     const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small')
    return await transcriber(filepath, {
      // The length of audio chunks to process at a time (in seconds)
      // Shorter chunks use less memory but may reduce accuracy
      chunk_length_s: 120,

      // The stride between chunks (in seconds)
      // Smaller stride increases overlap, potentially improving accuracy at the cost of processing time
      stride_length_s: 20,

      // Whether to return timestamps for each transcribed segment
      // Useful for generating subtitles or aligning text with audio
      return_timestamps: true,
    }) */
  } catch (err) {
    console.error('Transcription error:', err)
    return null
  }
}

const downloadSRT = () => {
  if (srtContent.value) {
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
    filename.value = await downloadAudio(transcription.value)
    if (!filename.value) {
      error.value = 'Failed to download audio. Please check the URL and try again.'
      loading.value = false
      return
    }

    // Process the downloaded audio file
    await processAudioFile(pathToDownloadFiles+filename.value)
  } catch (err: any) {
    // Handle any errors that occur during the process
    error.value = `File upload error: ${err.statusMessage || 'Unknown error'}`
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
  const audio = new Audio(filepath)

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
    const result = await transcribeAudio(filepath)

    if (result) {
      // If transcription is successful, update the result and SRT content
      resultTranscript.value = result.text
      srtContent.value = generateSRT(result.chunks)
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