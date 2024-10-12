import { pipeline, WhisperTextStreamer, env } from "@huggingface/transformers";
import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/esm/ort.webgpu.min.js";
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";


// Configure transformers environment
env.allowLocalModels = false

self.addEventListener('message', async (e) => {

  const transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-large-v3-turbo', {
    cacheDir: './',
    device: 'webgpu',
    dtype: {
      encoder_model: "fp16",
      decoder_model_merged: "q4", // or 'fp32' ('fp16' is broken)
    },
  })

  //streamer

  const time_precision =
    transcriber.processor.feature_extractor.config.chunk_length /
    transcriber.model.config.max_source_positions;

  // Storage for chunks to be processed. Initialise with an empty chunk.
  /** @type {{ text: string; offset: number, timestamp: [number, number | null] }[]} */
  const chunks = [];

  // TODO: Storage for fully-processed and merged chunks
  // let decoded_chunks = [];

  const chunk_length_s = 30;
  const stride_length_s = 5;

  let chunk_count = 0;
  let start_time;
  let num_tokens = 0;
  let tps;
  const streamer = new WhisperTextStreamer(transcriber.tokenizer, {
    time_precision,
    on_chunk_start: (x) => {
      const offset = (chunk_length_s - stride_length_s) * chunk_count;
      chunks.push({
        text: "",
        timestamp: [offset + x, null],
        finalised: false,
        offset,
      });
    },
    token_callback_function: (x) => {
      start_time ??= performance.now();
      if (num_tokens++ > 0) {
        tps = (num_tokens / (performance.now() - start_time)) * 1000;
      }
    },
    callback_function: (x) => {
      if (chunks.length === 0) return;
      // Append text to the last chunk
      chunks.at(-1).text += x;

      self.postMessage({
        status: "update",
        data: {
          text: "", // No need to send full text yet
          chunks,
          tps,
        },
      });
    },
    on_chunk_end: (x) => {
      const current = chunks.at(-1);
      current.timestamp[1] = x + current.offset;
      current.finalised = true;
    },
    on_finalize: () => {
      start_time = null;
      num_tokens = 0;
      ++chunk_count;
    },
  });

  //end

  const plep = await transcriber(e.data.audio, {
    // The length of audio chunks to process at a time (in seconds)
    // Shorter chunks use less memory but may reduce accuracy
    chunk_length_s,
    top_k: 50,
    do_sample: false,
    // The stride between chunks (in seconds)
    // Smaller stride increases overlap, potentially improving accuracy at the cost of processing time
    stride_length_s,
    language: e.data.language,
    force_full_sequences: false,
    task: 'automatic-speech-recognition',
    // Whether to return timestamps for each transcribed segment
    // Useful for generating subtitles or aligning text with audio
    return_timestamps: true,
    streamer
  })

  self.postMessage(plep)
}, false);




