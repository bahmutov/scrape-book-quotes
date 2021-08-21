/// <reference types="cypress" />
// @ts-check

import { scrapeToAlgoliaRecord } from '../../utils'
import { scrapeOneSlide, filterRecords } from './utils'
import cypressIntroRecords from '../../scraped/bahmutov-cypress-intro-records.json'

it('filters records', () => {
  const filtered = filterRecords(cypressIntroRecords.slice(0, 10))
  console.log(filtered)
  expect(filtered.length).to.equal(3)
  // many records were skipped
  expect(filtered[0], 'first').deep.equal(cypressIntroRecords[0])
  expect(filtered[1], 'second').deep.equal(cypressIntroRecords[5])
  expect(filtered[2], 'third').deep.equal(cypressIntroRecords[9])
})

it('scrapes the first slide', () => {
  cy.visit('/')
  scrapeOneSlide().should('have.length', 1).its(0).should('deep.include', {
    lvl2: 'Anna Karenina',
    lvl3: 'Leo Tolstoy',
    lvl4: null,
    content:
      'Happy families are all alike; every unhappy family is unhappy in its own way.',
    url: 'https://slides.com/bahmutov/book-quotes/',
    objectID: 'https-slides-com-bahmutov-book-quotes-0',
  })
})

it('scrapes the top of the stack', () => {
  cy.visit('/#/2')
  scrapeOneSlide().should('have.length', 1).its(0).should('deep.include', {
    content: 'It was the best of times, it was the worst of times, ...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2',
  })
})

it('scrapes the middle of the stack', () => {
  cy.visit('/#/2/1')
  scrapeOneSlide().should('have.length', 1).its(0).should('deep.include', {
    content:
      '... it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair,...',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/1',
  })
})

it('scrapes the bottom of the stack', () => {
  cy.visit('/#/2/2')
  scrapeOneSlide().should('have.length', 1).its(0).should('deep.include', {
    content:
      'Marley was dead, to begin with. There is no doubt whatever about that.',
    url: 'https://slides.com/bahmutov/book-quotes/#/2/2',
  })
})

it('scrapes slide with just heading 1', () => {
  cy.visit('/#/5/1')
  scrapeOneSlide()
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
      objectID: 'https-slides-com-bahmutov-book-quotes-5-1',
    })
    .then(scrapeToAlgoliaRecord)
    .should('deep.equal', {
      objectID: 'https-slides-com-bahmutov-book-quotes-5-1',
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
  scrapeOneSlide().should('deep.equal', [
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet One',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
      objectID: 'https-slides-com-bahmutov-book-quotes-5-0',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet Two',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
      objectID: 'https-slides-com-bahmutov-book-quotes-5-1',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'Bullet Three',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
      objectID: 'https-slides-com-bahmutov-book-quotes-5-2',
    },
    {
      lvl0: 'Book Quotes',
      lvl1: 'A test deck for practicing scraping slides.',
      lvl2: null,
      lvl3: 'A Bullet List',
      lvl4: null,
      content: 'This slide has multiple list items, all should be scraped',
      url: 'https://slides.com/bahmutov/book-quotes/#/5',
      objectID: 'https-slides-com-bahmutov-book-quotes-5-3',
    },
  ])
})
