<template>
  <div>
    <input v-model="text" @input="analyzeSentiment" />
    <p>Sentiment: {{ sentiment }}</p>
  </div>
</template>

<script setup lang="ts">
const { $transformers } = useNuxtApp();
const text = ref('');
const sentiment = ref('');

async function analyzeSentiment() {
  if (text.value) {
    const result = await $transformers.sentimentPipeline(text.value);
    sentiment.value = result[0].label;
  } else {
    sentiment.value = '';
  }
}
</script>