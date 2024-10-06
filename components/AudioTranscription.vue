<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="backdrop-blur-md bg-purple-300/30 rounded-lg shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-400/30">
      <h1 class="text-4xl font-bold text-center mb-8 py-2 px-4 bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text stroke-effect">YTSubs</h1>
      
      <div class="mb-6">
        <input 
          v-model="transcription" 
          type="text" 
          placeholder="Enter YouTube URL"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-white placeholder-purple-400"
        />
      </div>

      <div class="mb-6">
        <button 
          @click="handleFileUpload" 
          class="w-full bg-purple-900/50 backdrop-blur-md text-white py-2 px-4 rounded-md hover:bg-purple-900/30 transition duration-300 border border-white/30 shadow-lg"
          :disabled="loading"
        >
          {{ loading ? 'Transcribing...' : 'Transcribe Audio' }}
        </button>
      </div>

      <div v-if="loading" class="mb-4 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="ml-3 text-gray-600">Transcribing...</p>
      </div>

      <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {{ error }}
      </div>

      <div v-if="srtContent" class="mb-6 gap-2 flex flex-col">
        <div class="flex justify-end">
          <button class="text-white rounded-md flex items-center" @click="downloadSRT">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
env.allowLocalModels = false
env.cacheDir = './.cache';
env.backends.onnx.logSeverityLevel = 4; // this line here

const transcription = ref('');
const resultTranscript = ref('')
const srtContent = ref('')
const loading = ref(false)
const error = ref('') // Add this line
const filename = ref('')
// Remove the progress ref as it's no longer needed
// const progress = ref(0)


const transcribeAudio = async (file: Blob) => {
  try {
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
    const output = await transcriber(file, {
      chunk_length_s: 60,
      stride_length_s: 10,
      return_timestamps: true,
      max_new_tokens: 256,
      task: 'transcribe',
      num_workers: 50,
      batch_size: 8,
      callback_function: function (beams) { 
            //something here
         } 
    });
    return output;
  } catch (err) {
    console.error('Transcription error:', err);
    return null;
  }
};



const downloadSRT = () => {
  if (srtContent.value) {
    const blob = new Blob([srtContent.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.value.replace('.mp3', '')+'.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};


const handleFileUpload = async () => {
   filename.value = ''
  if(transcription.value) {
    try {
      loading.value = true
      error.value = '' // Clear any previous errors
      const file = await $fetch('/api/mp3downloader', {
        query: {
          url: encodeURIComponent(transcription.value)
        },
      });
      if (file) {
        try {
          const result = await transcribeAudio('/' + file);
          filename.value = file
          if (result) {
            resultTranscript.value = result.text;
            srtContent.value = generateSRT(result.chunks);
          } else {
            error.value = 'Transcription failed. Please try again.'
          }
        } catch (err) {
          error.value = 'Error during transcription: ' + (err.message || 'Unknown error')
        }
      } else {
        error.value = 'Failed to download audio. Please check the URL and try again.'
      }
    } catch (error) {
      error.value = 'File upload error: ' + (error.message || 'Unknown error')
    } finally {
      loading.value = false
    }
  } else {
    error.value = 'Please enter a YouTube URL'
  }
};

// New function to generate SRT content
const generateSRT = (chunks) => {
  return chunks.map((chunk, index) => {
    const startTime = formatSRTTime(chunk.timestamp[0]);
    const endTime = formatSRTTime(chunk.timestamp[1]);
    return `${index + 1}\n${startTime} --> ${endTime}\n${chunk.text.trim()}\n\n`;
  }).join('\n');
};

// Helper function to format time for SRT
const formatSRTTime = (seconds) => {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const secs = date.getUTCSeconds().toString().padStart(2, '0');
  const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${secs},${ms}`;
};

</script>