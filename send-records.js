const algoliaObjects = require('./algolia-objects.json')

// https://www.algolia.com/doc/api-client/getting-started
const algoliasearch = require('algoliasearch')

// tip: use https://github.com/bahmutov/as-a
// to inject the environment variables when running
const client = algoliasearch(
  process.env.APPLICATION_ID,
  process.env.ADMIN_API_KEY,
)
const index = client.initIndex('quotes')
// for now replace all records in the index
index
  // each record should have a unique id set
  .replaceAllObjects(algoliaObjects, { autoGenerateObjectIDIfNotExist: false })
  .then(() => {
    console.log('uploaded %d records', records.length)
  })
  .catch((err) => console.error(err))
