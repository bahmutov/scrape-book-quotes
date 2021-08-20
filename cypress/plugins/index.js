/// <reference types="cypress" />

const algoliasearch = require('algoliasearch')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    // little utility task for printing a message to the terminal
    print(x) {
      console.log(x)
      return null
    },

    // upload scraped records to Algolia
    async uploadRecords({ records, presentation }) {
      const { APPLICATION_ID, ADMIN_API_KEY, INDEX_NAME } = process.env
      if (!APPLICATION_ID || !ADMIN_API_KEY || !INDEX_NAME) {
        console.log('Algolia app/key not set')
        console.log(
          'Skipping uploading %d records for presentation %s',
          records.length,
          presentation,
        )
        return null
      }

      if (!presentation) {
        throw new Error('Missing presentation slug')
      }

      const client = algoliasearch(APPLICATION_ID, ADMIN_API_KEY)
      const index = client.initIndex(INDEX_NAME)

      console.log(
        '%s: removing existing records for %s',
        INDEX_NAME,
        presentation,
      )
      await index.deleteBy({
        filters: presentation,
      })

      console.log('%s: adding %d records', INDEX_NAME, records.length)
      // each record should have a unique id set
      await index.saveObjects(records, {
        autoGenerateObjectIDIfNotExist: false,
      })

      // cy.task must return something
      return null
    },
  })
}
