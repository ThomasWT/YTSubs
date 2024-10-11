import decodeAudio from 'audio-decode'

function resampleLinear(audioBuffer: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
  const ratio = fromSampleRate / toSampleRate;
  const newLength = Math.round(audioBuffer.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);
      const fraction = position - index;

      if (index + 1 < audioBuffer.length) {
          result[i] = audioBuffer[index] * (1 - fraction) + audioBuffer[index + 1] * fraction;
      } else {
          result[i] = audioBuffer[index];
      }
  }

  return result;
}
const audioToRawWave = (audioChannels: Float32Array[], bytesPerSample: 1 | 2): Uint8Array => {
    const bufferLength = audioChannels[0].length;
    const numberOfChannels = audioChannels.length;
    const reducedData = new Uint8Array(bufferLength * numberOfChannels * bytesPerSample);

    for (let i = 0; i < bufferLength; ++i) {
        for (let channel = 0; channel < numberOfChannels; ++channel) {
            const outputIndex = (i * numberOfChannels + channel) * bytesPerSample;
            let sample = audioChannels[channel][i];
            sample = sample > 1 ? 1 : sample < -1 ? -1 : sample; // check for clipping

            if (bytesPerSample === 2) {
                sample = sample * 32767;
                reducedData[outputIndex] = sample;
                reducedData[outputIndex + 1] = sample >> 8;
            } else {
                reducedData[outputIndex] = (sample + 1) * 127;
            }
        }
    }

    return reducedData;
};

const makeWav = (data: Uint8Array, channels: number, sampleRate: number, bytesPerSample: 1 | 2): Blob => {
    const headerLength = 44;
    const wav = new Uint8Array(headerLength + data.length);
    const view = new DataView(wav.buffer);

    // Write WAV header
    view.setUint32(0, 1380533830, false); // RIFF identifier 'RIFF'
    view.setUint32(4, 36 + data.length, true); // file length minus RIFF identifier length and file description length
    view.setUint32(8, 1463899717, false); // RIFF type 'WAVE'
    view.setUint32(12, 1718449184, false); // format chunk identifier 'fmt '
    view.setUint32(16, 16, true); // format chunk length
    view.setUint16(20, 1, true); // sample format (raw)
    view.setUint16(22, channels, true); // channel count
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * bytesPerSample * channels, true); // byte rate (sample rate * block align)
    view.setUint16(32, bytesPerSample * channels, true); // block align (channel count * bytes per sample)
    view.setUint16(34, bytesPerSample * 8, true); // bits per sample
    view.setUint32(36, 1684108385, false); // data chunk identifier 'data'
    view.setUint32(40, data.length, true); // data chunk length

    wav.set(data, headerLength);

    return new Blob([wav.buffer], { type: "audio/wav" });
};

export default defineEventHandler(async (event) => {
    try {
        // Load audio data
        const query = getQuery(event)
        const config = useRuntimeConfig();
        const url = `${config.domain}${decodeURIComponent(query.url)}`
        let buffer = await fetch(url).then(x => x.arrayBuffer())

        console.log('Fetched buffer size:', buffer.byteLength)

        // Decode the audio data
        let audioBuffer = await decodeAudio(buffer)

        console.log('Decoded audio buffer:', {
            sampleRate: audioBuffer.sampleRate,
            length: audioBuffer.length,
            duration: audioBuffer.duration,
            numberOfChannels: audioBuffer.numberOfChannels
        })

        // Convert to mono if stereo
        let audioData = audioBuffer.getChannelData(0)
        if (audioBuffer.numberOfChannels > 1) {
            const secondChannel = audioBuffer.getChannelData(1)
            for (let i = 0; i < audioData.length; ++i) {
                audioData[i] = (audioData[i] + secondChannel[i]) / 2;
            }
        }

        console.log('Audio data length:', audioData.length)

        // Resample to 16000 Hz
        const targetSampleRate = 16000
        const resampledAudio = resampleLinear(audioData, audioBuffer.sampleRate, targetSampleRate)

        console.log('Resampled audio data length:', resampledAudio.length)

        // Convert to WAV
        const rawData = audioToRawWave([resampledAudio], 2); // 16-bit audio
        const wavBlob = makeWav(rawData, 1, targetSampleRate, 2);

        console.log('WAV blob size:', wavBlob.size)

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await wavBlob.arrayBuffer();

        console.log('Final ArrayBuffer size:', arrayBuffer.byteLength)

        // Return WAV data as base64 string
        return { 
            wavData: Buffer.from(arrayBuffer).toString('base64'),
            sampleRate: targetSampleRate
        }
        
    } catch (error) {
        console.error('Server-side error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error processing audio file'
        })
    }
})
