import { pipeline, env } from '@xenova/transformers'
// Configure transformers environment
env.allowLocalModels = false


self.addEventListener('message', async (e) => {
    console.log("In worker (public): received data: "+ e)

    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small')
    const plep = await transcriber(e.data, {
      // The length of audio chunks to process at a time (in seconds)
      // Shorter chunks use less memory but may reduce accuracy
      chunk_length_s: 120,

      // The stride between chunks (in seconds)
      // Smaller stride increases overlap, potentially improving accuracy at the cost of processing time
      stride_length_s: 20,

      // Whether to return timestamps for each transcribed segment
      // Useful for generating subtitles or aligning text with audio
      return_timestamps: true,
    })

    self.postMessage(plep)
  }, false);

