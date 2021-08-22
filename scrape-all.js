// https://slides.com/bahmutov/decks/cypress-introduction
const cypressIntroductionPresentations = [
  // 'https://slides.com/bahmutov/cypress-intro', // oldest
  // 'https://slides.com/bahmutov/automated-testing',
  // 'https://slides.com/bahmutov/fast-and-effective-end-to-end-tests',
  // 'https://slides.com/bahmutov/cypress-testing',
  // 'https://slides.com/bahmutov/commited-intro-to-cypress', // newest
]
// https://slides.com/bahmutov/decks/cypress-io
const cypressIoPresentations = [
  // newest
  // 'https://slides.com/bahmutov/e2e-for-chat',
  // 'https://slides.com/bahmutov/cypress-declassified',
  // 'https://slides.com/bahmutov/cypress-ng',
  // 'https://slides.com/bahmutov/visual-testing-using-cypress',
  // 'https://slides.com/bahmutov/no-excuses',
  // 'https://slides.com/bahmutov/tests-are-docs',
  // 'https://slides.com/bahmutov/how-cy-intercept-works',
  // 'https://slides.com/bahmutov/testing-mistakes',
  // 'https://slides.com/bahmutov/cypress-beyond-the-hello-world',
  // 'https://slides.com/bahmutov/testing-docs',
  // 'https://slides.com/bahmutov/find-me-if-you-can',
  // 'https://slides.com/bahmutov/visual-testing',
  // 'https://slides.com/bahmutov/write-a-cypress-test',
  // 'https://slides.com/bahmutov/state-of-the-art',
  // 'https://slides.com/bahmutov/visual-testing-and-code-coverage',
  // 'https://slides.com/bahmutov/testing-tools-and-their-friends', // failed
  // 'https://slides.com/bahmutov/good-news-about-end-to-end-testing',
  // 'https://slides.com/bahmutov/flawless-tests',
  // 'https://slides.com/bahmutov/visual-testing-with-percy',
  // 'https://slides.com/bahmutov/selenium-camp-part-2',
  // 'https://slides.com/bahmutov/selenium-camp-part-1',
  // 'https://slides.com/bahmutov/app-actions',
  'https://slides.com/bahmutov/ts-without-ts',
  'https://slides.com/bahmutov/test-coverage-update',
  'https://slides.com/bahmutov/cypress-sf-js',
  'https://slides.com/bahmutov/circleci-cypress-orb',
  'https://slides.com/bahmutov/well-tested-software',
  'https://slides.com/bahmutov/cypress-reactive-roadshow',
  'https://slides.com/bahmutov/cy-parallelization',
  'https://slides.com/bahmutov/reactive-conf',
  'https://slides.com/bahmutov/end-vue-end-testing',
  'https://slides.com/bahmutov/painless', // failed
  'https://slides.com/bahmutov/cypress-at-ng-boston',
  'https://slides.com/bahmutov/quality-software',
  'https://slides.com/bahmutov/cypress-at-angularnyc',
  'https://slides.com/bahmutov/cypress-at-reactnyc',
  'https://slides.com/bahmutov/e2e-in-the-future',
  'https://slides.com/bahmutov/painless-react-testing',
  'https://slides.com/bahmutov/testing-vue',
  'https://slides.com/bahmutov/assertjs',
  'https://slides.com/bahmutov/boston-js-testing',
  'https://slides.com/bahmutov/effective-e2e-testing-with-cypress',
]

const continuousIntegrationPresentations = [
  'https://slides.com/bahmutov/ci-triple',
  'https://slides.com/bahmutov/gh-actions',
  'https://slides.com/bahmutov/github-actions-in-action',
  'https://slides.com/bahmutov/circleci-cypress-orb',
  'https://slides.com/bahmutov/well-tested-software',
  'https://slides.com/bahmutov/cy-parallelization',
  'https://slides.com/bahmutov/semantic-release',
  'https://slides.com/bahmutov/think-inside-the-box',
]

// the full list of presentations to scrape
// TODO check the urls for duplicates
const presentations = [
  ...cypressIntroductionPresentations,
  ...cypressIoPresentations,
  ...continuousIntegrationPresentations,
]

const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
  throw new Error('Algolia app/key/index not set')
}

const cypress = require('cypress')

// TODO: print the scraping progress
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
