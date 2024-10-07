import { Downloader } from 'ytdl-mp3';
import { createReadStream } from 'fs';
import { join } from 'path';
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if(query.delfile) {
    const publicDir = './public';
    fs.readdir(publicDir, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
      
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlink(join(publicDir, file), err => {
            if (err) {
              console.error(`Error deleting file ${file}:`, err);
            } else {
              console.log(`Deleted file: ${file}`);
            }
          });
        }
      });
    });
    
    return { message: 'MP3 files deletion process initiated' };
  }
  if (query?.url) {
    const downloader = new Downloader({
      getTags: false,
      outputDir: './public',
    });

    try {
      const downloadResult = await downloader.downloadSong(decodeURIComponent(query.url));
      return downloadResult.toString().replace('public/', '');
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
