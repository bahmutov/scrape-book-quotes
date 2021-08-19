// https://www.algolia.com/doc/api-client/getting-started
const algoliasearch = require('algoliasearch')

// tip: use https://github.com/bahmutov/as-a
// to inject the environment variables when running
const client = algoliasearch(
  process.env.APPLICATION_ID,
  process.env.ADMIN_API_KEY,
)
const index = client.initIndex('quotes')

const presentationSlug = 'bahmutov-book-quotes'

index
  .deleteBy({
    filters: presentationSlug,
  })
  .then((r) => {
    console.log('deleted records with presentation "%s"', presentationSlug)
    console.log(r)
  })
  .catch((err) => console.error(err))
