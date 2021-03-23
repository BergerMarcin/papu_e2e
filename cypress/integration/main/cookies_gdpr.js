import '../../support';

/* TEST SETTINGS ---------------------------------------------------------------------------------------------------- */
// MAIN SETTINGS
// for values of below constants refer to commands.js
const URL = 'https://papu.io/'    // for test of the test set: 'http://papu.io/de/'
const LANG = 'pl'                 // for test of the test set: ''
const DEVICE = 'SXGA'             // for test of the test set: ''

// SELECTORS & VALIDATORS
const GDPR_BAR = {selector: '#cookie-law-info-bar'}
const GDPR_AGREEMENT_BUTTON = {selector: '#cookie_action_close_header'}
const GDPR_SETTINGS_BUTTON = {selector: 'a.cli_settings_button'}
const GDPR_SETTINGS_DIALOG = {selector: '.cli-modal-content.cli-bar-popup'}


/* TEST ------------------------------------------------------------------------------------------------------------- */
// SCENARIO with "simple" AGREEMENT
describe(`Test of GDPR (pl: RODO) - GDPR-cookies-agreement`, () => {
  before(() => {
    cy.visitDefault(URL)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })
  it (`GDRP footer/bar should disappear after click on GDRP-cookies-agreement button`, () => {
    cy.get(GDPR_BAR.selector).should('be.visible')
    cy.get(GDPR_AGREEMENT_BUTTON.selector).should('be.visible')
    cy.get(GDPR_AGREEMENT_BUTTON.selector).click()
    cy.get(GDPR_BAR.selector).should('not.visible')
  })
})


// SCENARIO with GDPR SETTINGS
describe(`Test of GDPR (pl: RODO) - GDRP settings`, () => {
  before(() => {
    cy.visitDefault(URL)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })

  it (`GDRP setting dialog/popup should appear after click on GDRP-settings button`, () => {
    cy.get(GDPR_BAR.selector).should('be.visible')
    cy.get(GDPR_SETTINGS_BUTTON.selector).should('be.visible')
    cy.get(GDPR_SETTINGS_BUTTON.selector).click()
    cy.get(GDPR_BAR.selector).should('not.visible')
    cy.get(GDPR_SETTINGS_DIALOG.selector).should('be.visible')
  })
})