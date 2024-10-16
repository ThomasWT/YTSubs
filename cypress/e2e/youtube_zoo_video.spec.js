describe('YouTube "Me at the zoo" Video Test', () => {
  beforeEach(() => {
    cy.visit('https://www.youtube.com/watch?v=jNQXAC9IVRw')
  })

  it('loads the correct video', () => {
    // Check the video title
    cy.get('#title h1').should('contain', 'Me at the zoo')

    // Check the channel name
    cy.get('#text-container.ytd-channel-name').should('contain', 'jawed')

    // Check video description
    cy.get('#description-inline-expander').should('contain', 'The first video on YouTube')
  })

  it('plays the video', () => {
    // Click the play button
    cy.get('.ytp-play-button').click()

    // Wait for a short duration to ensure video starts playing
    cy.wait(3000)

    // Check if video is playing (current time should be greater than 0)
    cy.get('.ytp-time-current').invoke('text').should('not.equal', '0:00')
  })

  it('has the correct video duration', () => {
    cy.get('.ytp-time-duration').should('contain', '0:19')
  })
})
