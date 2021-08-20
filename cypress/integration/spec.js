/// <reference types="cypress" />
// @ts-check

import { scrapeToAlgoliaRecord } from '../../utils'
import { scrapeDeck } from './utils'

it('scrapes', () => {
  scrapeDeck().then(({ slug, records }) => {
    // at least several records should be found
    expect(records, 'number of records').to.have.length.gt(1)

    const outputFolder = 'scraped'
    cy.writeFile(`${outputFolder}/${slug}-records.json`, records)

    const algoliaObjects = records.map(scrapeToAlgoliaRecord).map((r) => {
      // add the same presentation slug to each record
      // this attribute will be very useful for deleting
      // all old records before scraping the presentation again
      r._tags = [slug]
      return r
    })
    cy.writeFile(`${outputFolder}/${slug}-algolia-objects.json`, algoliaObjects)

    // let's upload the records to Algolia
    // see the task registered in the cypress/plugins/index.js file
    cy.task('uploadRecords', { records, presentation: slug })
  })
})
