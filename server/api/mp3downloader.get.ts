import { Downloader } from 'ytdl-mp3';
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
  const fileToDelete = publicDir+'/'+filename;

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
  const pathToStoreFiles = config.path_to_store_temp_files

  // Initialize the downloader with options
  const downloader = new Downloader({
    getTags: false,
    outputDir: outputDir
  });

  try {
    // Attempt to download the song
    const downloadResult = await downloader.downloadSong(decodeURIComponent(url));

    // Return the path to the downloaded file, combining pathToDownloadFiles with the filename
    let filename = downloadResult.toString().split('/').pop();

    await new Promise(async (resolve, reject) => {
      ffmpeg(outputDir+'/'+filename)
        .toFormat("wav")
        .audioFrequency(16000)  // Set sample rate to 16000 Hz
        .outputOptions('-acodec pcm_f32le')  // Set bit depth to 32-bit floating point
        .on("error", (err) => {
          reject(err);
        })
        .on("end", () => {
          resolve();
        })
        .save(outputDir+'/'+filename.replace('mp3', 'wav'));
    });

    await handleFileDeletion(filename.split('/').pop(), pathToStoreFiles)
    filename = filename.replace('mp3', 'wav')
    let buffer = Buffer.from(await fetch(config.domain+'/'+filename).then(x => x.arrayBuffer()))

   

    return JSON.stringify({name: filename, buffer: buffer, url: '/'+filename});
  } catch (err: any) {
    console.error('Error downloading MP3:', err);

    //If the file already exist, delete it and try once more.
    if(err.message.includes("Output file already exists")) {
      await handleFileDeletion(err.message.split('/').pop(), pathToStoreFiles);
      return handleMp3Download(url, outputDir, config)
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: err.message
      })
    }

  }
}
