import { ytmp3 } from '@vreden/youtube_scraper';
import fs from 'fs/promises';
import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from 'os';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Handle MP3 download request
  if (query.url) {
    return handleMp3Download(query.url as string);
  }

  // Return an error if url parameter is not provided
  return { error: 'Invalid request. Specify url parameter.' };
});

// Function to handle MP3 download
async function handleMp3Download(url: string): Promise<string> {
  const storage = useStorage('cache:audio'); // Using cache storage with automatic TTL
  const tempDir = tmpdir();
  
  try {
    // Use nothing-yt to get the audio
    const result = await ytmp3(decodeURIComponent(url), "320"); // Using highest quality

    if (!result.status) {
      throw createError({
        statusCode: 400,
        statusMessage: result.result
      });
    }

    // Get the video metadata
    const videoInfo = result.metadata;
    const videoDuration = parseInt(videoInfo.duration.seconds);

    // Check duration limit
    if (videoDuration > 1200) { // 20 minutes
      throw createError({
        statusCode: 422,
        statusMessage: 'Video duration exceeds 20 minutes limit'
      });
    }

    console.log(`Video Title: ${videoInfo.title}`);
    console.log(`Video Duration: ${videoDuration} seconds`);

    // Check if file already exists in storage
    const storageKey = `${videoInfo.videoId}.wav`;
    const existingFile = await storage.getItemRaw(storageKey);
    
    if (existingFile) {
      console.log(`File ${storageKey} found in cache, returning existing file`);
      return JSON.stringify({ 
        name: storageKey,
        videoId: videoInfo.videoId,
        title: videoInfo.title,
        cached: true
      });
    }

    // Download the file from the provided URL
    const response = await fetch(result.download.url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Generate temporary file paths for conversion
    const mp3Filename = `${videoInfo.videoId}-${Date.now()}.mp3`;
    const wavFilename = `${videoInfo.videoId}-${Date.now()}.wav`;
    const mp3FilePath = join(tempDir, mp3Filename);
    const wavFilePath = join(tempDir, wavFilename);

    // Save the MP3 file temporarily
    await fs.writeFile(mp3FilePath, buffer);

    // Convert MP3 to WAV format with required specifications
    await new Promise((resolve, reject) => {
      ffmpeg(mp3FilePath)
        .toFormat("wav")
        .audioFrequency(16000)
        .outputOptions('-acodec pcm_f32le')
        .on("error", reject)
        .on("end", resolve)
        .save(wavFilePath);
    });

    // Read the converted WAV file
    const wavBuffer = await fs.readFile(wavFilePath);

    // Store the WAV file in Nitro storage with TTL (e.g., 1 hour = 3600 seconds)
    await storage.setItemRaw(storageKey, wavBuffer);

    // Clean up temporary files
    try {
      await fs.unlink(mp3FilePath);
      await fs.unlink(wavFilePath);
    } catch (err) {
      console.error('Error deleting temporary files:', err);
    }

    console.log(`File ${storageKey} stored in cache with 1 hour TTL`);

    return JSON.stringify({ 
      name: storageKey,
      videoId: videoInfo.videoId,
      title: videoInfo.title,
      cached: false
    });

  } catch (err: any) {
    console.error('Error downloading MP3:', err);
    throw createError({
      statusCode: 500,
      statusMessage: err.statusMessage || 'Failed to download audio'
    });
  }
}
