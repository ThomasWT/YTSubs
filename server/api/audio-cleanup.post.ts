export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const filename = body?.filename;

  if (!filename || !filename.endsWith('.wav')) {
    return { success: false, message: 'Invalid filename' };
  }

  const storage = useStorage('cache:audio');

  try {
    const exists = await storage.hasItem(filename);
    
    if (exists) {
      await storage.removeItem(filename);
      console.log(`Cleaned up file: ${filename}`);
      return { success: true, message: 'File deleted' };
    }
    
    return { success: true, message: 'File already deleted' };
  } catch (err: any) {
    console.error('Error cleaning up file:', err);
    return { success: false, message: 'Cleanup failed' };
  }
});

