export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  
  if (!id || !id.endsWith('.wav')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid audio file ID'
    });
  }

  const storage = useStorage('cache:audio');
  
  try {
    const audioBuffer = await storage.getItemRaw(id);
    
    if (!audioBuffer) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Audio file not found or expired'
      });
    }

    setHeader(event, 'Content-Type', 'audio/wav');
    setHeader(event, 'Content-Disposition', `inline; filename="${id}"`);
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');
    setHeader(event, 'Content-Length', audioBuffer.length.toString());
    
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

