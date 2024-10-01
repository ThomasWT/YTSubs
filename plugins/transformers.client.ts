import { pipeline } from '@xenova/transformers';

export default defineNuxtPlugin(async () => {
  // Initialize the Whisper pipeline
  const whisperPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');

  // Function to transcribe MP3 blob
  const transcribeMP3 = async (audioBlob: Blob) => {
    try {
      // Create AudioContext
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Decode the audio data
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert AudioBuffer to Float32Array
      const audioData = audioBuffer.getChannelData(0);

      // Transcribe the audio
      const result = await whisperPipeline(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: 'english',
        task: 'transcribe',
      });
      return result.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Error during transcription');
    }
  };

  return {
    provide: {
      transformers: {
        transcribeMP3,
      }
    }
  };
});