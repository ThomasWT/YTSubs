// test/mp3downloader.test.ts

import { describe, it, expect, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('MP3 Downloader API', async () => {
  await setup({
    // test context options
    server: true,
    browser: false,
  })

  it('should return an error for invalid request', async () => {
    const response = await $fetch('/api/mp3downloader')
    expect(response).toEqual({ error: 'Invalid request. Specify either delfile or url parameter.' })
  })

  it('should handle errors during MP3 download', async () => {
    vi.mock('ytdl-core', () => ({
      getVideoID: vi.fn().mockImplementation(() => {
        throw new Error('Invalid YouTube URL')
      })
    }))

    await expect($fetch('/api/mp3downloader?url=invalid-url')).rejects.toThrow('500 Video unavailable')
  })
})
