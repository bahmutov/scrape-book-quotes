/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

const doNotLog = { log: false }

export const scrapeOneSlide = () => {
  return cy.document(doNotLog).then((doc) => {
    const url = doc.location.href

    const lvl0El = doc.querySelector('.deck-info h1')
    const lvl0 = lvl0El ? lvl0El.innerText.trim() : null

    const lvl1El = doc.querySelector('.deck-info .description')
    const lvl1 = lvl1El ? lvl1El.innerText.trim() : null

    const lvl2El = doc.querySelector('.slides .present:not(.stack) h1')
    const lvl2 = lvl2El ? lvl2El.innerText.trim() : null

    const lvl3El = doc.querySelector('.slides .present:not(.stack) h2')
    const lvl3 = lvl3El ? lvl3El.innerText : null

    const lvl4El = doc.querySelector('.slides .present:not(.stack) h3')
    const lvl4 = lvl4El ? lvl4El.innerText.trim() : null

    const contentSelectors = [
      '.slides .present:not(.stack) p',
      '.slides .present:not(.stack) blockquote',
      '.slides .present:not(.stack) li',
    ]
    const contentSelector = contentSelectors.join(', ')
    const textEls = Array.from(doc.querySelectorAll(contentSelector))

    const slideId = Cypress._.kebabCase(doc.location.href)
    const record = {
      url,
      lvl0,
      lvl1,
      lvl2,
      lvl3,
      lvl4,
      content: null,
      objectID: slideId,
    }
    console.log(record)

    if (!textEls.length) {
      return [record]
    }

    const records = textEls.map((el, k) => {
      const r = {
        ...record,
        content: el.innerText.trim(),
        // give each record extracted from the slide
        // its own id
        objectID: `${record.objectID}-${k}`,
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

export const scrapeDeck = (url = '/') => {
  // the presentation safe slug like "bahmutov-book-quotes"
  let slug
  const records = []

  cy.visit(url)

  // derive the presentation slug from the pathname
  cy.location('pathname').then((pathname) => {
    slug = Cypress._.kebabCase(pathname)
    console.log({ pathname, slug })
  })

  const maxSlides = 300
  const slideDelay = 500

  const goVertical = () => {
    return recurse(
      () =>
        scrapeOneSlide()
          .then((r) => {
            const url = r[0].url
            cy.log(url)
            cy.log(`**${r.length}** record(s)`)
            cy.task('print', `${url}: ${r.length} record(s)`)
            records.push(...r)
          })
          .then(() => cy.get('.navigate-down', doNotLog)),
      ($button) => !$button.hasClass('enabled'),
      {
        log: false,
        delay: slideDelay,
        timeout: maxSlides * 1000,
        limit: maxSlides,
        post() {
          cy.get('.navigate-down', doNotLog).click(doNotLog)
          cy.wait(slideDelay, doNotLog)
        },
      },
    )
  }

  return recurse(
    () => goVertical().then(() => cy.get('.navigate-right', doNotLog)),
    ($button) => !$button.hasClass('enabled'),
    {
      log: false,
      delay: slideDelay,
      timeout: maxSlides * 1000,
      limit: maxSlides,
      post() {
        cy.get('.navigate-right', doNotLog).click(doNotLog)
      },
    },
  ).then(() => {
    return { records, slug }
  })
}
