<template>
  <div>
    <input type="file" accept="audio/mp3" @change="handleFileUpload" />
    <button @click="transcribeAudio" :disabled="!audioBlob">Transcribe</button>
    <p>Transcription: {{ transcription }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { $transformers } = useNuxtApp();
const audioBlob = ref<Blob | null>(null);
const transcription = ref('');

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.type === 'audio/mp3') {
      audioBlob.value = file;
    } else {
      alert('Please upload an MP3 file.');
      audioBlob.value = null;
    }
  }
}

async function transcribeAudio() {
  if (!audioBlob.value) return;

  try {
    transcription.value = 'Transcribing...';
    const result = await $transformers.transcribeMP3(audioBlob.value);
    transcription.value = result;
  } catch (error) {
    console.error('Transcription error:', error);
    transcription.value = 'Error during transcription';
  }
}
</script>