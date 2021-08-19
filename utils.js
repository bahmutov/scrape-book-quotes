/**
 * Converts a scrape record to an Algolia record
 * ready to be send.
 */
const scrapeToAlgoliaRecord = (record) => {
  const algoliaRecord = Cypress._.cloneDeep(record)
  algoliaRecord.hierarchy = {
    lvl0: algoliaRecord.lvl0,
    lvl1: algoliaRecord.lvl1,
    lvl2: algoliaRecord.lvl2,
    lvl3: algoliaRecord.lvl3,
    lvl4: algoliaRecord.lvl4,
  }

  if (algoliaRecord.content) {
    algoliaRecord.type = 'content'
  } else {
    if (algoliaRecord.lvl4) {
      algoliaRecord.type = 'lvl4'
    } else if (algoliaRecord.lvl3) {
      algoliaRecord.type = 'lvl3'
    } else if (algoliaRecord.lvl2) {
      algoliaRecord.type = 'lvl2'
    } else if (algoliaRecord.lvl1) {
      algoliaRecord.type = 'lvl1'
    } else if (algoliaRecord.lvl0) {
      algoliaRecord.type = 'lvl0'
    }
  }

  // we moved the levels into hierarchy
  delete algoliaRecord.lvl0
  delete algoliaRecord.lvl1
  delete algoliaRecord.lvl2
  delete algoliaRecord.lvl3
  delete algoliaRecord.lvl4

  return algoliaRecord
}

module.exports = { scrapeToAlgoliaRecord }
