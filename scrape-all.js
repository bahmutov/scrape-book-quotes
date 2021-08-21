// https://slides.com/bahmutov/decks/cypress-introduction
const cypressIntroductionPresentations = [
  'https://slides.com/bahmutov/cypress-intro', // oldest
  'https://slides.com/bahmutov/automated-testing',
  'https://slides.com/bahmutov/fast-and-effective-end-to-end-tests',
  'https://slides.com/bahmutov/cypress-testing',
  'https://slides.com/bahmutov/commited-intro-to-cypress', // newest
]
// https://slides.com/bahmutov/decks/cypress-io
const cypressIoPresentations = [
  // newest
  'https://slides.com/bahmutov/e2e-for-chat',
  'https://slides.com/bahmutov/cypress-declassified',
  'https://slides.com/bahmutov/cypress-ng',
  'https://slides.com/bahmutov/visual-testing-using-cypress',
]

// the full list of presentations to scrape
const presentations = [
  ...cypressIntroductionPresentations,
  ...cypressIoPresentations,
]

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  throw new Error('Algolia app/key/index not set')
}

const cypress = require('cypress')

async function scrapePresentations(urls) {
  if (!urls.length) {
    return
  }

  const presentation = urls.shift()
  console.log(`Scraping ${presentation}`)
  await cypress.run({
    config: {
      baseUrl: presentation,
    },
    spec: 'cypress/integration/spec.js',
  })

  // scrape the rest of the presentations
  await scrapePresentations(urls)
}
scrapePresentations(presentations).then(() => console.log('all done'))
