import { pipeline, env } from '@xenova/transformers'
env.allowLocalModels = false
env.cacheDir = './.cache';
env.backends.onnx.logSeverityLevel = 4;
let transcriber: any = null;
async function initializeTranscriber() {
  if (!transcriber) {
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
  }
}

async function transcribe(file: Blob, options: any) {
  await initializeTranscriber();
  const output = await transcriber(file, options);
  return output;
}

self.onmessage = async (event) => {
  if (event.data.action === 'transcribe') {
    try {
      const result = await transcribe(event.data.file, event.data.options);
      self.postMessage(result);
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  }
};