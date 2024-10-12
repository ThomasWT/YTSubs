
import { pipeline, WhisperTextStreamer } from "@huggingface/transformers";
import { pipeline as transl } from "@xenova/transformers";
// Define model factories
// Ensures only one model is created of each type
var translator;
class PipelineFactory {
    static task = null;
    static model = null;
    static instance = null;

    constructor(tokenizer, model) {
        this.tokenizer = tokenizer;
        this.model = model;
    }

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {

            // Load transcriber model
            translator = await transl('translation', 'Xenova/mbart-large-50-many-to-many-mmt');
            this.instance = pipeline(this.task, this.model, {
                dtype: {
                    encoder_model:
                        this.model === "onnx-community/whisper-large-v3-turbo"
                            ? "fp16"
                            : "fp32",
                    decoder_model_merged: "q4", // or 'fp32' ('fp16' is broken)
                },
                device: "webgpu",
                progress_callback,
            });
        }

        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const message = event.data;

    // Do some work...
    // TODO use message data
    let transcript = await transcribe(message);
    if (transcript === null) return;
    let weouignowieg = await translator(`goodbye`, {
    src_lang: 'en_XX', // Hindi
    tgt_lang: 'sv_SE', // French
})
console.log(weouignowieg)
    // Send the result back to the main thread
    self.postMessage({
        status: "complete",
        data: transcript,
    });
});

class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
    static task = "automatic-speech-recognition";
    static model = 'onnx-community/whisper-large-v3-turbo';
}

const transcribe = async (audiodata) => {
    const model = 'onnx-community/whisper-large-v3-turbo'
    const isDistilWhisper = model.startsWith("distil-whisper/");
    const p = AutomaticSpeechRecognitionPipelineFactory;
    if (p.model !== model) {
        // Invalidate model if different
        p.model = model;

        if (p.instance !== null) {
            (await p.getInstance()).dispose();
            p.instance = null;
        }
    }

    const transcriber = await p.getInstance((data) => {
        self.postMessage(data);
    });

    const time_precision =
        transcriber.processor.feature_extractor.config.chunk_length /
        transcriber.model.config.max_source_positions;

    // Storage for chunks to be processed. Initialise with an empty chunk.
    /** @type {{ text: string; offset: number, timestamp: [number, number | null] }[]} */
    const chunks = [];

    // TODO: Storage for fully-processed and merged chunks
    // let decoded_chunks = [];

    const chunk_length_s = isDistilWhisper ? 20 : 30;
    const stride_length_s = isDistilWhisper ? 3 : 5;

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
        callback_function: async (x) => {
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
        on_chunk_end: async (x) => {
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

    // Actually run transcription
    const output = await transcriber(audiodata.audio, {
        // Greedy
        top_k: 0,
        do_sample: false,

        // Sliding window
        chunk_length_s,
        stride_length_s,

        // Language and task
        task: 'automatic-speech-recognition',
        language: audiodata.language,
        pooling: 'mean',
        normalize: true,
        // Return timestamps
        return_timestamps: true,
        force_full_sequences: false,

        // Callback functions
        streamer, // after each generation step
    }).catch((error) => {
        console.error(error);
        self.postMessage({
            status: "error",
            data: error,
        });
        return null;
    });

    return {
        tps,
        ...output,
    };
};