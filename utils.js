/**
 * Converts a scrape record to an Algolia record
 * ready to be send.
 */
const scrapeToAlgoliaRecord = (record) => {
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
    if (record.lvl4) {
      record.type = 'lvl4'
    } else if (record.lvl3) {
      record.type = 'lvl3'
    } else if (record.lvl2) {
      record.type = 'lvl2'
    } else if (record.lvl1) {
      record.type = 'lvl1'
    } else if (record.lvl0) {
      record.type = 'lvl0'
    }
  }

  // we moved the levels into hierarchy
  delete record.lvl0
  delete record.lvl1
  delete record.lvl2
  delete record.lvl3
  delete record.lvl4

  return record
}

module.exports = { scrapeToAlgoliaRecord }
