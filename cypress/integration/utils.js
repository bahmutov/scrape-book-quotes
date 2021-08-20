export const scrapeOneSlide = () => {
  return cy.document().then((doc) => {
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
