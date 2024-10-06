import { Downloader } from 'ytdl-mp3';
import { createReadStream } from 'fs';
import { join } from 'path';
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (query?.url) {
    const downloader = new Downloader({
      getTags: false,
      outputDir: './public'
    });

    try {
      const downloadResult = await downloader.downloadSong(decodeURIComponent(query.url));
      console.log(downloadResult);

      // Get the file path
      const filePath = join(process.cwd(), downloadResult);

      // Set appropriate headers
      event.node.res.setHeader('Content-Type', 'audio/mpeg');
      event.node.res.setHeader('Content-Disposition', `attachment; filename="${downloadResult}.mp3"`);

      // Create a read stream and pipe it to the response
      const fileStream = createReadStream(filePath);
      // Delete the file from ./public after streaming
      fileStream.on('close', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
      });
      return downloadResult;
    } catch (err) {

      const fileStream = createReadStream('./public/'+err.message.replace('Output file already exists: public/', ''));
      // Delete the file from ./public after streaming
      fileStream.on('close', () => {
        fs.unlink('./public/'+err.message.replace('Output file already exists: public/', ''), (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
      });
      return err.message.replace('Output file already exists: public/', '');
    }
  }
});
