import { ytmp3 } from '@vreden/youtube_scraper';
import fs from 'fs/promises';
import ffmpeg from "fluent-ffmpeg";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  // Determine the output directory based on the environment
  const pathToStoreFiles = config.path_to_store_temp_files

  // Handle file deletion request
  if (query.delfile) {
    return handleFileDeletion(query.delfile as string, pathToStoreFiles);
  }

  // Handle MP3 download request
  if (query.url) {
    return handleMp3Download(query.url as string, pathToStoreFiles, config);
  }

  // Return an error if neither delfile nor url parameter is provided
  return { error: 'Invalid request. Specify either delfile or url parameter.' };
});

// Function to handle file deletion
async function handleFileDeletion(filename: string, publicDir: string): Promise<object> {
  const fileToDelete = publicDir + '/' + filename;

  // Ensure only MP3 files can be deleted
  if (!fileToDelete.endsWith('.wav') && !fileToDelete.endsWith('.mp3')) {
    return { error: 'Invalid file type. Only wav files can be deleted.' };
  }

  try {
    // Attempt to delete the file
    await fs.unlink(fileToDelete);
    console.log(`Deleted file: ${filename}`);
    return { message: `File ${filename} deleted successfully` };
  } catch (err) {
    // Log and return an error if deletion fails
    console.error(`Error deleting file ${filename}:`, err);
    return { error: `Failed to delete file ${filename}` };
  }
}

// Function to handle MP3 download
async function handleMp3Download(url: string, outputDir: string, config: any): Promise<string> {
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

    // Download the file from the provided URL
    const response = await fetch(result.download.url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Generate filenames for both MP3 and WAV
    const mp3Filename = `${videoInfo.videoId}.mp3`;
    const wavFilename = `${videoInfo.videoId}.wav`;
    const mp3FilePath = `${outputDir}/${mp3Filename}`;
    const wavFilePath = `${outputDir}/${wavFilename}`;

    // Save the MP3 file
    await fs.writeFile(mp3FilePath, buffer);

    // Convert MP3 to WAV format with required specifications
    await new Promise((resolve, reject) => {
      ffmpeg(mp3FilePath)
        .toFormat("wav")
        .audioFrequency(16000)
        .outputOptions('-acodec pcm_f32le')
        .on("error", reject)
        .on("end", async () => {
          // Delete the MP3 file after conversion
          try {
            await fs.unlink(mp3FilePath);
          } catch (err) {
            console.error('Error deleting MP3 file:', err);
          }
          resolve(true);
        })
        .save(wavFilePath);
    });

    return JSON.stringify({ 
      name: wavFilename, 
      buffer: buffer,
      url: '/' + wavFilename 
    });

  } catch (err: any) {
    console.error('Error downloading MP3:', err);
    throw createError({
      statusCode: 500,
      statusMessage: err.statusMessage || 'Failed to download audio'
    });
  }
}
