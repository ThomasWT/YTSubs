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

export async function transcribe(file: Blob, options: any) {
  await initializeTranscriber();
  const output = await transcriber(file, options);
  return output;
}