<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Audio Transcription</h1>
      
      <div class="mb-6">
        <input 
          v-model="transcription" 
          type="text" 
          placeholder="Enter YouTube URL or upload audio file"
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-6">
        <button 
          @click="handleFileUpload" 
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Transcribe Audio
        </button>
      </div>

      <div v-if="loading" class="mb-4 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="ml-3 text-gray-600">Transcribing...</p>
      </div>

      <div v-if="srtContent" class="mb-6">
        <div class="flex justify-between">
          <h2 class="text-xl font-semibold mb-2 text-gray-700">Subtitle file:</h2>
          <button class="text-indigo-600 rounded-md flex items-center hover:text-indigo-400" @click="downloadSRT">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
     
        <pre class="bg-gray-100 p-4 rounded-md text-sm text-gray-800 overflow-x-auto">{{ srtContent }}</pre>
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
    a.download = 'transcription.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};


const handleFileUpload = async () => {
  if(transcription.value) {
    try {
      loading.value = true
      const file = await $fetch('/api/mp3downloader', {
        query: {
          url: encodeURIComponent(transcription.value)
        },
      });
      if (file) {
        try {
          const result = await transcribeAudio('/' + file);
          if (result) {
            resultTranscript.value = result.text;
            // Generate SRT content
            srtContent.value = generateSRT(result.chunks);
            // You can now use srtContent as needed (e.g., display it or save it to a file)
          }
          loading.value = false
        } catch (err) {
          loading.value = false
          return null
        }
      }
    } catch (error) {
      loading.value = false
      console.error('File upload error:', error);
    }

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