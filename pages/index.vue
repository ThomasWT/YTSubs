<template>
  <div>
    <ClientOnly>
      <AudioTranscription></AudioTranscription>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
// Import the useSeoMeta composable

// Define SEO metadata
useServerSeoMeta({
  title: 'YTSubs',
  description: 'Extract subtitles from YouTube videos using Client-side AI.',
  ogImage: 'https://ytsubs.thomaswt.com/ytogimage.jpg',
  ogTitle: 'AI-Powered YouTube Subtitle generator',
  ogDescription: 'Transform YouTube video content into subtitles',
  twitterCard: 'summary_large_image',
  twitterSite: '@eothica',
  robots: 'index, follow',
  keywords: 'YouTube subtitles, video captions, AI subtitle generator, YouTube transcription'
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
