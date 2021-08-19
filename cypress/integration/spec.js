/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

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
      '.slides .present:not(.stack) p, .slides .present:not(.stack) blockquote',
    )
    const content = textEl ? textEl.innerText.trim() : null

    const record = { url, lvl0, lvl1, lvl2, lvl3, lvl4, content }
    console.log(record)
    return record
  })
}

it('scrapes the first slide', () => {
  cy.visit('/')
  scrape().should('deep.include', {
    lvl2: 'Anna Karenina',
    lvl3: 'Leo Tolstoy',
    lvl4: null,
    content:
      'Happy families are all alike; every unhappy family is unhappy in its own way.',
    url: 'https://slides.com/bahmutov/book-quotes/',
  })
})

it('scrapes the top of the stack', () => {
  cy.visit('/#/2')
  scrape().should('deep.include', {
    content: 'It was the best of times, it was the worst of times, ...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2',
  })
})

it('scrapes the middle of the stack', () => {
  cy.visit('/#/2/1')
  scrape().should('deep.include', {
    content:
      '... it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair,...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/1',
  })
})

it('scrapes the bottom of the stack', () => {
  cy.visit('/#/2/2')
  scrape().should('deep.include', {
    content:
      'Marley was dead, to begin with. There is no doubt whatever about that.',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/2',
  })
})

it.only('scrapes', () => {
  const records = []

  cy.visit('/')

  const goVertical = () => {
    return recurse(
      () =>
        scrape()
          .then((r) => records.push(r))
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
    cy.writeFile('records.json', records)
  })
})
