import { describe, it, expect } from 'vitest'
import { setup, createPage } from '@nuxt/test-utils/e2e'

describe('AudioTranscription component e2e test', async () => {
  await setup({
    browser: true,
    // Add this line to load environment variables
    env: process.env,
    port: 3000,
  })

  it('transcribes the "Me at the zoo" video correctly', async () => {
    const page = await createPage('/')

    // Use environment variable for YouTube URL
    const youtubeUrl = process.env.TEST_YOUTUBE_URL || 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    await page.fill('input[placeholder="Enter YouTube URL"]', youtubeUrl)

    // Click the Transcribe button
    await page.click('button:has-text("Transcribe")')

    // Wait for the transcription to complete (adjust timeout as needed)
    await page.waitForSelector('pre', { timeout: 120000 })

    // Check if the transcription contains expected phrases
    const transcriptionContent = await page.textContent('pre')
    expect(transcriptionContent).toContain('All right, so here we are in front of the elephants')
    expect(transcriptionContent).toContain('That\'s pretty much all there is to say')

    // Check if the Download button is available
    const downloadButton = await page.isVisible('button:has-text("Download")')
    expect(downloadButton).toBe(true)
  }, {
    timeout: 120000
  })
})
