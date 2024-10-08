import { Downloader } from 'ytdl-mp3';
import { createReadStream } from 'fs';
import { join } from 'path';
import fs from 'fs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const headers = getHeaders(event)
  const config = useRuntimeConfig();
    const pathing = process.env.NODE_ENV == 'development' ? process.cwd()+'/public' : '/home/thomas/caption-youtube/.output/public'
  if(query.delfile) {
    const publicDir = pathing;
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
      outputDir: './public'
    });

    try {
      const downloadResult = await downloader.downloadSong(decodeURIComponent(query.url));
      const schema = headers["x-forwarded-proto"] || 'https';
      return downloadResult.toString().replace('public', config.domain);
    } catch (err) {
/* 
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
      }); */
      console.log(err)
      return err.message.replace('Output file already exists: public/', '');
    }
  }
});
