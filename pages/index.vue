<template>
  <div>
    <svg v-motion="{ initial: { opacity: 0.2,}, enter: { opacity: 0.3, transition: { duration: 1000 } } }" class="fixed w-full h-full z-0" xmlns='http://www.w3.org/2000/svg' width='100%'><rect fill='#ffffff' width='540' height='450'/><defs><linearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%' gradientTransform='rotate(191,960,455)'><stop offset='0'  stop-color='#ffffff'/><stop offset='1'  stop-color='#3C0852'/></linearGradient><pattern patternUnits='userSpaceOnUse' id='b'  width='300' height='250' x='0' y='0' viewBox='0 0 1080 900'><g fill-opacity='0.06'><polygon fill='#444' points='90 150 0 300 180 300'/><polygon points='90 150 180 0 0 0'/><polygon fill='#AAA' points='270 150 360 0 180 0'/><polygon fill='#DDD' points='450 150 360 300 540 300'/><polygon fill='#999' points='450 150 540 0 360 0'/><polygon points='630 150 540 300 720 300'/><polygon fill='#DDD' points='630 150 720 0 540 0'/><polygon fill='#444' points='810 150 720 300 900 300'/><polygon fill='#FFF' points='810 150 900 0 720 0'/><polygon fill='#DDD' points='990 150 900 300 1080 300'/><polygon fill='#444' points='990 150 1080 0 900 0'/><polygon fill='#DDD' points='90 450 0 600 180 600'/><polygon points='90 450 180 300 0 300'/><polygon fill='#666' points='270 450 180 600 360 600'/><polygon fill='#AAA' points='270 450 360 300 180 300'/><polygon fill='#DDD' points='450 450 360 600 540 600'/><polygon fill='#999' points='450 450 540 300 360 300'/><polygon fill='#999' points='630 450 540 600 720 600'/><polygon fill='#FFF' points='630 450 720 300 540 300'/><polygon points='810 450 720 600 900 600'/><polygon fill='#DDD' points='810 450 900 300 720 300'/><polygon fill='#AAA' points='990 450 900 600 1080 600'/><polygon fill='#444' points='990 450 1080 300 900 300'/><polygon fill='#222' points='90 750 0 900 180 900'/><polygon points='270 750 180 900 360 900'/><polygon fill='#DDD' points='270 750 360 600 180 600'/><polygon points='450 750 540 600 360 600'/><polygon points='630 750 540 900 720 900'/><polygon fill='#444' points='630 750 720 600 540 600'/><polygon fill='#AAA' points='810 750 720 900 900 900'/><polygon fill='#666' points='810 750 900 600 720 600'/><polygon fill='#999' points='990 750 900 900 1080 900'/><polygon fill='#999' points='180 0 90 150 270 150'/><polygon fill='#444' points='360 0 270 150 450 150'/><polygon fill='#FFF' points='540 0 450 150 630 150'/><polygon points='900 0 810 150 990 150'/><polygon fill='#222' points='0 300 -90 450 90 450'/><polygon fill='#FFF' points='0 300 90 150 -90 150'/><polygon fill='#FFF' points='180 300 90 450 270 450'/><polygon fill='#666' points='180 300 270 150 90 150'/><polygon fill='#222' points='360 300 270 450 450 450'/><polygon fill='#FFF' points='360 300 450 150 270 150'/><polygon fill='#444' points='540 300 450 450 630 450'/><polygon fill='#222' points='540 300 630 150 450 150'/><polygon fill='#AAA' points='720 300 630 450 810 450'/><polygon fill='#666' points='720 300 810 150 630 150'/><polygon fill='#FFF' points='900 300 810 450 990 450'/><polygon fill='#999' points='900 300 990 150 810 150'/><polygon points='0 600 -90 750 90 750'/><polygon fill='#666' points='0 600 90 450 -90 450'/><polygon fill='#AAA' points='180 600 90 750 270 750'/><polygon fill='#444' points='180 600 270 450 90 450'/><polygon fill='#444' points='360 600 270 750 450 750'/><polygon fill='#999' points='360 600 450 450 270 450'/><polygon fill='#666' points='540 600 630 450 450 450'/><polygon fill='#222' points='720 600 630 750 810 750'/><polygon fill='#FFF' points='900 600 810 750 990 750'/><polygon fill='#222' points='900 600 990 450 810 450'/><polygon fill='#DDD' points='0 900 90 750 -90 750'/><polygon fill='#444' points='180 900 270 750 90 750'/><polygon fill='#FFF' points='360 900 450 750 270 750'/><polygon fill='#AAA' points='540 900 630 750 450 750'/><polygon fill='#FFF' points='720 900 810 750 630 750'/><polygon fill='#222' points='900 900 990 750 810 750'/><polygon fill='#222' points='1080 300 990 450 1170 450'/><polygon fill='#FFF' points='1080 300 1170 150 990 150'/><polygon points='1080 600 990 750 1170 750'/><polygon fill='#666' points='1080 600 1170 450 990 450'/><polygon fill='#DDD' points='1080 900 1170 750 990 750'/></g></pattern></defs><rect x='0' y='0' fill='url(#a)' width='100%' height='100%'/><rect x='0' y='0' fill='url(#b)' width='100%' height='100%'/></svg>
    <div class="relative">
      <div class="min-h-screen flex flex-col items-center justify-center p-4 font-[Inter] gap-24 l z-50  max-sm:gap-12">
        <div class="text-white flex flex-col justify-center items-center max-w-3xl text-center gap-4">
          <h1 v-motion="{ initial: { opacity: 0,}, enter: { opacity: 1, transition: { duration: 600 } } }" class="text-5xl max-md:text-4xl max-sm:text-3xl">Youtube AI Subtitle generator</h1>
          <p v-motion="{ initial: { opacity: 0, }, enter: { opacity: 1,  transition: { duration: 800 } } }" class="text-purple-200 text-2xl max-md:text-xl max-sm:text-sm">Load AI in your browser, paste in a Youtube link and let your browser listen and generate a subtitle file</p>
        </div>
        <div class="min-h-[342px] w-full flex justify-center">
          <ClientOnly>
            <AudioTranscription></AudioTranscription>
          </ClientOnly>
        </div>
      </div>
    </div>
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