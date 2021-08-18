const records = require('./records.json').map((record) => {
  record.hierarchy = {
    lvl0: record.lvl0,
    lvl1: record.lvl1,
    lvl2: record.lvl2,
    lvl3: record.lvl3,
    lvl4: record.lvl4,
  }

  if (record.content) {
    record.type = 'content'
  } else {
    console.error('TODO: need to set the type for a record')
    console.error(record)
  }

  // we moved the levels into hierarchy
  delete record.lvl0
  delete record.lvl1
  delete record.lvl2
  delete record.lvl3
  delete record.lvl4

  return record
})

console.log(JSON.stringify(records, null, 2))

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
  .replaceAllObjects(records, { autoGenerateObjectIDIfNotExist: true })
  .then(() => {
    console.log('uploaded %d records', records.length)
  })
  .catch((err) => console.error(err))
