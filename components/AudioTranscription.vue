<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="backdrop-blur-md bg-purple-300/30 rounded-lg shadow-2xl p-8 max-w-2xl w-full border-2 border-purple-400/30">
      <h1 class="text-4xl font-bold text-center mb-8 py-2 px-4 bg-gradient-to-br from-slate-800 to-purple-500 text-transparent bg-clip-text stroke-effect">YTSubs <span class="border border-purple-500 text-purple-500 shadow-sm text-xs font-medium me-2 px-2.5 py-0.5 rounded">Free</span>
      </h1>
      
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
          class="w-full bg-purple-900/50 backdrop-blur-md text-white py-2 px-4 rounded-md hover:bg-purple-900/40 transition duration-300 border border-white/30 shadow-lg"
          :disabled="loading"
        >
          {{ loading ? 'Transcribing...' : 'Transcribe Audio' }}
        </button>
      </div>
      
     <!--  <div v-if="estimatedProcessingTime" class="mb-4 text-sm text-gray-600">
        <div class="mt-2 w-full  backdrop-blur-md bg-purple-300/10 rounded-full h-2.5">
          <div class="bg-purple-600/70 h-2.5 rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <div class="mt-1 text-xs text-white">
          Time elapsed: {{ formatTime(elapsedTime) }}
        </div>
      </div> -->
      

      <div v-if="loading" class="mb-4 flex justify-center items-center flex-col">
        
        <p class="text-white mb-4">{{ estimatedProcessingTime }}</p>
        <div class="flex" role="status">
            <svg aria-hidden="true" class="w-6 h-6 text-purple-400 animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <p class="ml-3 text-purple-600">Transcribing...</p>
        </div>

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
const duration = ref(0)
// Remove the progress ref as it's no longer needed
// const progress = ref(0)

const estimatedProcessingTime = computed(() => {
  if (duration.value > 0) {
    // Calculate estimated processing time
    const estimatedSeconds = Math.round(duration.value * (84 / 76))
    const minutes = Math.floor(estimatedSeconds / 60)
    const seconds = estimatedSeconds % 60
    return `Estimated time: ${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  return ''
})

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
    });
    return output;
  } catch (err) {
    console.error('Transcription error:', err);
    return null;
  }
};

const fileExists = async (file) => {
  // If file is a Blob, get its name
  const fileName = typeof file === 'string' ? file : (file instanceof File ? file.name : (file instanceof Blob ? 'unnamed-blob' : 'unknown'));
  return await new Promise((resolve) => {
            const dbName = 'AudioTranscriptionDB';
            const storeName = 'files';
            const version = 1;

            const request = indexedDB.open(dbName, version);

            request.onsuccess = (event) => {
              const db = event.target.result;
              const transaction = db.transaction([storeName], 'readonly');
              const store = transaction.objectStore(storeName);

              const getRequest = store.get(fileName);

              getRequest.onsuccess = () => {
                resolve(!!getRequest.result);
              };

              getRequest.onerror = () => {
                console.error('Error checking file existence:', getRequest.error);
                resolve(false);
              };
            };

            request.onerror = (event) => {
              console.error('IndexedDB error:', event.target.error);
              resolve(false);
            };
  });
}



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
  await $fetch('/api/mp3downloader', {
            query: {
              delfile: true
            }
        })
  filename.value = ''
  if (transcription.value) {
    // Add YouTube URL validation
    if (!transcription.value.includes('v=')) {
      error.value = 'Please enter a valid YouTube URL containing a video ID (v= parameter)'
      return
    }

    try {
      loading.value = true
      error.value = '' // Clear any previous errors
      processingStartTime.value = Date.now()
      elapsedTime.value = 0
      updateElapsedTime()
      const file = await $fetch('/api/mp3downloader', {
        query: {
          url: encodeURIComponent(transcription.value)
        },
      });

      if (file) {
        try {
          // Get the file from IndexedDB
          const audio = new Audio('/' + file);
          
          audio.addEventListener('loadedmetadata', async () => {
            duration.value = audio.duration;
            console.log(`MP3 file length: ${duration.value} seconds`);
            if(duration.value > 1200) {
              error.value = 'Video too long. Max 20 minutes'
              loading.value = false
              return;
            } else {
              // Use the file URL instead of the blob for transcription
              const result = await transcribeAudio('/' + file);
              filename.value = file;

              if (result) {
                resultTranscript.value = result.text;
                srtContent.value = generateSRT(result.chunks);
                loading.value = false
              } else {
                error.value = 'Error. Try again. no seriously.'
                loading.value = false
              }
            }
          });
          

        } catch (err) {
          error.value = 'Error during transcription: ' + (err.message || 'Unknown error')
          loading.value = false
        }
      } else {
        error.value = 'Failed to download audio. Please check the URL and try again.'
        loading.value = false
      }
    } catch (err) {
      error.value = 'File upload error: ' + (err.message || 'Unknown error')
      loading.value = false
    }
  } else {
    error.value = 'Please enter a YouTube URL'
    loading.value = false
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

const progressPercentage = computed(() => {
  if (duration.value > 0) {
    const estimatedSeconds = Math.round(duration.value * (84 / 76))
    return Math.min((elapsedTime.value / estimatedSeconds) * 100, 100)
  }
  return 0
})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const updateElapsedTime = () => {
  if (loading.value) {
    elapsedTime.value = (Date.now() - processingStartTime.value) / 1000
    requestAnimationFrame(updateElapsedTime)
  }
}

const elapsedTime = ref(0)
const processingStartTime = ref(0)

</script>