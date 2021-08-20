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
    async uploadRecords({ records, presentation }) {
      const { APPLICATION_ID, ADMIN_API_KEY } = process.env
      if (!APPLICATION_ID || !ADMIN_API_KEY) {
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

      const index = client.initIndex('quotes')

      console.log('removing existing records for %s', presentation)
      await index.deleteBy({
        filters: presentation,
      })

      console.log('adding %d records', records.length)
      // each record should have a unique id set
      await index.saveObjects(algoliaObjects, {
        autoGenerateObjectIDIfNotExist: false,
      })

      // cy.task must return something
      return null
    },
  })
}
