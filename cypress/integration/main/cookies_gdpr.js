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
const GDPR_SETTINGS_DIALOG = {selector: 'div.cli-modal-content.cli-bar-popup'}

const GDPR_SETTINGS_SHOW_MORE_BUTTON = {selector: 'a.cli-privacy-readmore'}
const GDPR_SETTINGS_MORE_DETAILS = {selector: 'div.cli-privacy-content-text > span'}

const GDPR_SETTINGS_SECTIONS = {
  CONTAINER: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1})`},
  HEADER: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1}) > div.cli-tab-header`},
  CONTENT: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1}) > div.cli-tab-content`},
  SECTION_TYPES: [
    {name: 'REQUIRED / Niezbędne (Wymagane)'},
    {name: 'STATISTICS / Statystyczne'},
    {name: 'MARKETING / Marketingowe'}
  ]
}

const GDPR_SETTINGS_REQUIRED = {selector: 'div.cli-tab-section-container > div:nth-child(1)'}
const GDPR_SETTINGS_REQUIRED_HEADER = {selector: 'div.cli-tab-section-container > div:nth-child(1) > div.cli-tab-header'}
const GDPR_SETTINGS_REQUIRED_CONTENT = {selector: 'div.cli-tab-section-container > div:nth-child(1) > div.cli-tab-content'}

const GDPR_SETTINGS_STATISTICS = {selector: 'div.cli-tab-section-container > div:nth-child(2)'}
const GDPR_SETTINGS_STATISTICS_HEADER = {selector: 'div.cli-tab-section-container > div:nth-child(2) > div.cli-tab-header'}
const GDPR_SETTINGS_STATISTICS_CONTENT = {selector: 'div.cli-tab-section-container > div:nth-child(2) > div.cli-tab-content'}

const GDPR_SETTINGS_MARKETING = {selector: 'div.cli-tab-section-container > div:nth-child(3)'}
const GDPR_SETTINGS_MARKETING_HEADER = {selector: 'div.cli-tab-section-container > div:nth-child(3) > div.cli-tab-header'}
const GDPR_SETTINGS_MARKETING_CONTENT = {selector: 'div.cli-tab-section-container > div:nth-child(3) > div.cli-tab-content'}

/* TEST ------------------------------------------------------------------------------------------------------------- */
// SCENARIO with "simple" GDPR AGREEMENT
describe(`Test of GDPR (pl: RODO) - GDPR-cookies-agreement`, () => {
  before(() => {
    cy.visitDefault(URL)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })
  it(`GDRP footer/bar should disappear after click on GDRP-cookies-agreement button`, () => {
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

  it(`GDRP setting dialog/popup should appear after click on GDRP-settings button`, () => {
    cy.get(GDPR_BAR.selector).should('be.visible')
    cy.get(GDPR_SETTINGS_BUTTON.selector).should('be.visible')
    cy.get(GDPR_SETTINGS_BUTTON.selector).click()
    cy.get(GDPR_SETTINGS_DIALOG.selector).should('be.visible')
    cy.get(GDPR_BAR.selector).should('not.visible')
  })

  it(`More details should be showed after clicking on Show-more button`, () => {
    cy.get(GDPR_SETTINGS_SHOW_MORE_BUTTON.selector).should('be.visible')
    cy.get(GDPR_SETTINGS_MORE_DETAILS.selector).should('not.exist')
    cy.get(GDPR_SETTINGS_SHOW_MORE_BUTTON.selector).click()
    cy.get(GDPR_SETTINGS_MORE_DETAILS.selector).should('be.visible')
  })

  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[0].name}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 0)
  })

  // klikniecie “Statyczne” pokazuje dodatkowy content
  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[1].name}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 1)
  })

  // klikniecie “Marketingowe” pokazuje dodatkowy content
  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[2].name}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 2)
  })
})