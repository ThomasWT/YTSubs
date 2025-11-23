# Storage Migration - Using Nitro Server Storage

## Overview

This project has been migrated from using public file storage to Nitro's built-in server storage layer. This eliminates the need for manual file deletion requests from the frontend.

## Key Benefits

1. **Automatic Server-Side Cleanup**: Files deleted immediately after delivery (no frontend dependency)
2. **Zero Frontend Cleanup Logic**: No deletion requests needed from client
3. **Fallback TTL**: 1-hour auto-expiration as safety net for any edge cases
4. **Better Security**: Files aren't publicly accessible in the filesystem
5. **Caching**: Same video downloads are cached and reused (until delivered once)
6. **Resource Efficient**: Minimal disk usage - files exist only while needed
7. **Single-Use Files**: Each file is delivered once then immediately deleted

## Changes Made

### Backend Changes

#### 1. `server/api/mp3downloader.get.ts`
- Removed `delfile` query parameter handling
- Removed `handleFileDeletion` function
- Removed dependency on `path_to_store_temp_files` config
- Added Nitro storage integration using `useStorage('cache:audio')`
- Files now stored with 1-hour TTL (auto-deletion)
- Added caching: if same video is requested, returns cached version
- Uses OS temp directory for ffmpeg conversion, then stores result in Nitro storage

#### 2. `server/api/audio/[id].get.ts` (NEW)
- New endpoint to serve audio files from storage
- Handles file retrieval from `cache:audio` storage
- Returns proper headers for audio streaming
- **Automatically deletes file after delivery** (fire-and-forget)
- Returns 404 if file not found or expired
- Single-use: file is deleted immediately after being sent

#### 3. `nuxt.config.ts`
- Added Nitro storage configuration:
```typescript
nitro: {
  storage: {
    'cache:audio': {
      driver: 'fs',
      base: './.data/audio-cache'
    }
  }
}
```

### Frontend Changes

#### `components/AudioTranscription.vue`
- Removed all file deletion logic (handled server-side)
- Updated `formatAudioData()` to use new `/api/audio/[id]` endpoint
- Updated `processAudioFile()` to use new storage-based URLs
- Simplified error handling (no cleanup needed)
- Zero dependency on frontend for file cleanup

## How It Works

### File Upload Flow
1. User provides YouTube URL
2. Backend downloads and converts audio to WAV
3. WAV file stored in Nitro storage with 1-hour TTL (fallback)
4. Backend returns filename to frontend
5. Frontend requests file via `/api/audio/{filename}`
6. **Backend delivers file AND immediately deletes it** (single operation)
7. Frontend transcribes audio in browser (using already-loaded data)

```
┌─────────────┐
│   User      │
│  Submits    │──────┐
│  YT URL     │      │
└─────────────┘      │
                     ▼
              ┌──────────────┐
              │   Backend    │
              │  Downloads   │
              │  & Converts  │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │    Nitro     │
              │   Storage    │◄─── TTL: 1 hour (fallback only)
              │ (.data/cache)│
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Frontend   │
              │   Requests   │
              │     File     │
              └──────┬───────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  /api/audio/[id].get   │
        │  1. Read file          │
        │  2. Send to client     │
        │  3. Delete immediately │◄─── Auto-cleanup!
        └────────┬───────────────┘
                 │
                 ▼
          ┌──────────────┐
          │   Frontend   │
          │ Transcribes  │
          │  (Browser)   │
          └──────────────┘
          
No frontend cleanup needed!
```

### File Lifecycle
- **Creation**: Files stored in `.data/audio-cache/` (gitignored)
- **Access**: Files served via `/api/audio/[id]` endpoint
- **Immediate Deletion**: Files auto-deleted by server immediately after delivery
- **Single-Use**: Each file can only be accessed once (deleted after first request)
- **Fallback Expiration**: 1-hour TTL as safety net for edge cases
- **Caching**: Same video ID returns cached file if available (until first access)

### Storage Location
- **Development**: `.data/audio-cache/`
- **Production**: `.output/server/.data/audio-cache/` (or configured location)

## Configuration

### TTL (Time To Live)
Files expire after 1 hour by default. To change this, modify the `ttl` value in `server/api/mp3downloader.get.ts`:

```typescript
await storage.setItemRaw(storageKey, wavBuffer, {
  ttl: 3600 // seconds (1 hour)
});
```

### Storage Driver
Currently using filesystem (`fs`) driver. Other options:
- `memory`: In-memory storage (fast but not persistent)
- `redis`: Redis storage (for distributed systems)
- `cloudflare-kv`: Cloudflare KV storage
- See [Nitro Storage Docs](https://nitro.build/guide/storage) for more options

## Migration Notes

### Removed Environment Variables
- `PATH_TO_STORE_TEMP_FILES`: No longer needed (uses Nitro storage)
- `PATH_TO_DOWNLOAD_FILES`: No longer needed (uses `/api/audio/` endpoint)

### Removed API Endpoints
- `GET /api/mp3downloader?delfile={filename}`: No longer needed

### New API Endpoints
- `GET /api/audio/{filename}`: Serves audio files from storage and auto-deletes after delivery

## Testing

To test the new storage system:

1. Start the dev server
2. Enter a YouTube URL
3. Check that `.data/audio-cache/` directory is created
4. Verify audio file is stored
5. Access the file via `/api/audio/{filename}`
6. Check server logs - should see "Auto-deleted file after delivery"
7. Verify file is immediately removed from `.data/audio-cache/`
8. Try accessing the same file again - should get 404

### What Happens in Different Scenarios

| Scenario | File Deletion |
|----------|--------------|
| ✅ File delivered to frontend | Deleted immediately after delivery (server-side) |
| ❌ File delivery fails | Remains in storage, TTL deletes after 1 hour |
| 🚪 User closes browser before requesting file | TTL deletes after 1 hour |
| 🔄 Same video requested twice | First request deletes it, second request gets 404 |
| 💥 Auto-delete fails | TTL deletes after 1 hour (fallback)

## Important Notes

### Single-Use Files
Files are **deleted immediately after the first access**. This means:
- ✅ Each file can only be downloaded once
- ✅ Refreshing the page after download will result in 404
- ✅ Multiple tabs/windows accessing the same file will fail (first wins)
- ✅ This is intentional for security and resource efficiency

### Caching Behavior
- Same video requested multiple times will use cached version
- BUT: Cache is cleared after first delivery
- If you need the file again, request a new download from YouTube

## Troubleshooting

### Files not being created
- Check Nitro storage configuration in `nuxt.config.ts`
- Verify `.data/` directory permissions
- Check server logs for storage errors

### Files disappearing immediately
- **This is expected behavior!** Files are deleted after delivery
- Check server logs for "Auto-deleted file after delivery" message
- Files are single-use by design

### 404 errors when accessing audio
- File may have already been accessed (single-use)
- File may have expired (1 hour TTL)
- Check server logs for deletion messages
- Request a new download if needed

## Future Improvements

- [ ] Add Redis storage driver for production
- [ ] Implement background cleanup job for expired files
- [ ] Add storage metrics/monitoring
- [ ] Consider longer TTL for frequently accessed files
- [ ] Add compression for stored files

