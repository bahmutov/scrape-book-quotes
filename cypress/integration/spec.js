/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'
import { scrapeToAlgoliaRecord } from '../../utils'

const scrape = () => {
  return cy.document().then((doc) => {
    const url = doc.location.href

    const lvl0El = doc.querySelector('.deck-info h1')
    const lvl0 = lvl0El ? lvl0El.innerText.trim() : null

    const lvl1El = doc.querySelector('.deck-info .description')
    const lvl1 = lvl1El ? lvl1El.innerText.trim() : null

    const lvl2El = doc.querySelector('.slides .present:not(.stack)  h1')
    const lvl2 = lvl2El ? lvl2El.innerText.trim() : null

    const lvl3El = doc.querySelector('.slides .present:not(.stack)  h2')
    const lvl3 = lvl3El ? lvl3El.innerText : null

    const lvl4El = doc.querySelector('.slides .present:not(.stack)  h3')
    const lvl4 = lvl4El ? lvl4El.innerText.trim() : null

    const contentSelectors = [
      '.slides .present:not(.stack) p',
      '.slides .present:not(.stack) blockquote',
      '.slides .present:not(.stack) li',
    ]
    const contentSelector = contentSelectors.join(', ')
    const textEls = Array.from(doc.querySelectorAll(contentSelector))

    const record = { url, lvl0, lvl1, lvl2, lvl3, lvl4, content: null }
    if (!textEls.length) {
      return [record]
    }

    const records = textEls.map((el) => {
      const r = {
        ...record,
        content: el.innerText.trim(),
      }
      return r
    })

    // use _.uniq method to remove duplicate records
    // using the content field as a unique key
    // that can happen if <p> tags are nested inside <li> tags
    // or <p> is inside <blockquote>
    return Cypress._.uniqBy(records, 'content')
  })
}

it('scrapes the first slide', () => {
  cy.visit('/')
  scrape().should('have.length', 1).its(0).should('deep.include', {
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
  scrape().should('have.length', 1).its(0).should('deep.include', {
    content: 'It was the best of times, it was the worst of times, ...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2',
  })
})

it('scrapes the middle of the stack', () => {
  cy.visit('/#/2/1')
  scrape().should('have.length', 1).its(0).should('deep.include', {
    content:
      '... it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair,...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/1',
  })
})

it('scrapes the bottom of the stack', () => {
  cy.visit('/#/2/2')
  scrape().should('have.length', 1).its(0).should('deep.include', {
    content:
      'Marley was dead, to begin with. There is no doubt whatever about that.',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/2',
  })
})

it('scrapes slide with just heading 1', () => {
  cy.visit('/#/5/1')
  scrape()
    .should('have.length', 1)
    .its(0)
    .should('deep.include', {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: 'The End',
      lvl3: null,
      lvl4: null,
      content: null,
      url: 'https://slides.com/bahmutov/book-quotes/#/5/1',
    })
    .then(scrapeToAlgoliaRecord)
    .should('deep.equal', {
      content: null,
      hierarchy: {
        lvl0: 'Book Quotes',
        lvl1: 'A test deck for practicing scraping slides.',
        lvl2: 'The End',
        lvl3: null,
        lvl4: null,
      },
      type: 'lvl2',
      url: 'https://slides.com/bahmutov/book-quotes/#/5/1',
    })
    .then(JSON.stringify)
    .then(console.log)
})

it('scrapes slide with bullet list', () => {
  cy.visit('/#/5')
  // returns each list item as a separate record
  scrape().should('deep.equal', [
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet One',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet Two',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet Three',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'This slide has multiple list items, all should be scraped',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
    },
  ])
})

it('scrapes', () => {
  const records = []

  cy.visit('/')

  const goVertical = () => {
    return recurse(
      () =>
        scrape()
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
    cy.writeFile('records.json', records)
  })
})
