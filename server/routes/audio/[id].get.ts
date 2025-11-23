export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id || !id.endsWith('.wav')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid audio file ID'
    });
  }

  const storage = useStorage('cache:audio');
  
  try {
    // Debug: check if file exists
    const hasFile = await storage.hasItem(id);
    console.log(`Checking for file: ${id}, exists: ${hasFile}`);
    
    // Get the file from storage
    const audioBuffer = await storage.getItemRaw(id);
    console.log(`File buffer size: ${audioBuffer ? audioBuffer.length : 'null'}`);
    
    if (!audioBuffer) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Audio file not found or expired'
      });
    }

    // Set appropriate headers for audio streaming
    setHeader(event, 'Content-Type', 'audio/wav');
    setHeader(event, 'Content-Disposition', `inline; filename="${id}"`);
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate'); // Don't cache since file will be deleted
    setHeader(event, 'Content-Length', audioBuffer.length.toString());
    
    // Delete the file immediately after sending (fire and forget)
    // This happens asynchronously so it doesn't block the response
    setImmediate(async () => {
      try {
        await storage.removeItem(id);
        console.log(`Auto-deleted file after delivery: ${id}`);
      } catch (err) {
        console.error(`Failed to auto-delete file ${id}:`, err);
        // File will be cleaned up by TTL if this fails
      }
    });
    
    return audioBuffer;
  } catch (err: any) {
    console.error('Error serving audio file:', err);
    
    if (err.statusCode) {
      throw err;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to serve audio file'
    });
  }
});

