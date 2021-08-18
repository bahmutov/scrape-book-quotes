/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

it('scrapes', () => {
  const records = []

  const scrape = () => {
    return cy.document().then((doc) => {
      const url = doc.location.href

      const lvl0El = doc.querySelector('.deck-info h1')
      const lvl0 = lvl0El ? lvl0El.innerText.trim() : null

      const lvl1El = doc.querySelector('.deck-info .description')
      const lvl1 = lvl1El ? lvl1El.innerText.trim() : null

      const lvl2El = doc.querySelector('.slides .present h1')
      const lvl2 = lvl2El ? lvl2El.innerText.trim() : null

      const lvl3El = doc.querySelector('.slides .present h2')
      const lvl3 = lvl3El ? lvl3El.innerText : null

      const lvl4El = doc.querySelector('.slides .present h3')
      const lvl4 = lvl4El ? lvl4El.innerText.trim() : null

      // TODO: consider ALL elements, not just the first one
      const textEl = doc.querySelector(
        '.slides .present p, .slides .present blockquote',
      )
      const content = textEl ? textEl.innerText.trim() : null

      const record = { url, lvl0, lvl1, lvl2, lvl3, lvl4, content }
      console.log(record)
      records.push(record)
    })
  }
  cy.visit('/')

  const goVertical = () => {
    return recurse(
      () => scrape().then(() => cy.get('.navigate-down')),
      ($button) => !$button.hasClass('enabled'),
      {
        log: false,
        delay: 1000,
        timeout: 200000,
        limit: 200,
        post() {
          cy.get('.navigate-down').click()
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
    cy.writeFile('records.json', records)
  })
})
