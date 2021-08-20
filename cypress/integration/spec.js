/// <reference types="cypress" />
// @ts-check

import { recurse } from 'cypress-recurse'
import { scrapeToAlgoliaRecord } from '../../utils'
import { scrapeOneSlide } from './utils'

it('scrapes', () => {
  const outputFolder = 'scraped'
  // the presentation safe slug like "bahmutov-book-quotes"
  let slug
  const records = []

  cy.visit('/')

  // derive the presentation slug from the pathname
  cy.location('pathname').then((pathname) => {
    slug = Cypress._.kebabCase(pathname)
    console.log({ pathname, slug })
  })

  const goVertical = () => {
    return recurse(
      () =>
        scrapeOneSlide()
          .then((r) => records.push(...r))
          .then(() => cy.get('.navigate-down')),
      ($button) => !$button.hasClass('enabled'),
      {
        log: false,
        delay: 1000,
        timeout: 200000,
        limit: 200,
        post() {
          cy.get('.navigate-down').click()
          cy.wait(500)
        },
      },
    )
  }

  recurse(
    () => goVertical().then(() => cy.get('.navigate-right')),
    ($button) => !$button.hasClass('enabled'),
    {
      log: false,
      delay: 1000,
      timeout: 200000,
      limit: 200,
      post() {
        cy.get('.navigate-right').click()
      },
    },
  ).then(() => {
    expect(records, 'number of records').to.have.length(12)

    cy.writeFile(`${outputFolder}/${slug}-records.json`, records)

    const algoliaObjects = records.map(scrapeToAlgoliaRecord).map((r) => {
      // add the same presentation slug to each record
      // this attribute will be very useful for deleting
      // all old records before scraping the presentation again
      r._tags = [slug]
      return r
    })
    cy.writeFile(`${outputFolder}/${slug}-algolia-objects.json`, algoliaObjects)
  })
})
