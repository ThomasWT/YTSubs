<template>
  <div>
    <AudioTranscription></AudioTranscription>
  </div>
</template>

<script lang="ts" setup>
// Import the useSeoMeta composable

// Define SEO metadata
useSeoMeta({
  title: 'YTSubs',
  description: 'Extract subtitles from YouTube videos using AI technology. Fast, accurate, and easy to use.',
  ogTitle: 'AI-Powered YouTube Subtitle Extractor | Get Video Captions Instantly',
  ogDescription: 'Transform YouTube video content into readable, searchable text. Perfect for content creators, researchers, and more.',
  twitterCard: 'summary_large_image',
  twitterSite: '@eothica',
  robots: 'index, follow',
  keywords: 'YouTube subtitles, video captions, AI subtitle extraction, YouTube transcription'
})

// You can also use useHead for additional customization if needed
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' }
  ],
  script: [
    { innerHTML: '{ "@context": "https://schema.org", "@type": "WebPage", "name": "Audio Transcription Service", "description": "Extrract Subtitles from a youtube video" }', type: 'application/ld+json' }
  ]
})

</script>

<style lang="scss">

</style>