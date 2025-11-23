export default defineEventHandler(async (event) => {
  const storage = useStorage('cache:audio');

  try {
    const keys = await storage.getKeys();
    
    if (keys.length === 0) {
      return { success: true, message: 'No files to clean up', deleted: 0 };
    }

    let deleted = 0;
    for (const key of keys) {
      try {
        await storage.removeItem(key);
        deleted++;
        console.log(`Cleaned up: ${key}`);
      } catch (err) {
        console.error(`Failed to delete ${key}:`, err);
      }
    }

    return { 
      success: true, 
      message: `Cleaned up ${deleted} file(s)`, 
      deleted 
    };
  } catch (err: any) {
    console.error('Error cleaning up all files:', err);
    return { success: false, message: 'Cleanup failed' };
  }
});

