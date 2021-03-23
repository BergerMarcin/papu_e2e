import '../../support';

/* TEST SETTINGS ---------------------------------------------------------------------------------------------------- */
// MAIN SETTINGS
// for values of below constants refer to commands.js
const URL = 'https://papu.io/'    // for test of the test set: 'http://papu.io/de/'
const LANG = 'pl'                 // for test of the test set: ''
const DEVICE = 'SXGA'             // for test of the test set: ''

// SELECTORS & COOKIES
const GDPR_BAR = {selector: '#cookie-law-info-bar'}
const GDPR_AGREEMENT_BUTTON = {selector: '#cookie_action_close_header'}
const GDPR_AGREEMENT = {
  description: 'Agree All',
  cookie: {name: 'viewed_cookie_policy', property: 'value', value: ['yes']}
}

const GDPR_SETTINGS_BUTTON = {selector: 'a.cli_settings_button'}
const GDPR_SETTINGS_DIALOG = {selector: 'div.cli-modal-content.cli-bar-popup'}

const GDPR_SETTINGS_SHOW_MORE_BUTTON = {selector: 'a.cli-privacy-readmore'}
const GDPR_SETTINGS_MORE_DETAILS = {selector: 'div.cli-privacy-content-text > span'}

const GDPR_SETTINGS_SECTIONS = {
  CONTAINER: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1})`},
  HEADER: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1}) > div.cli-tab-header`},
  CHECKBOX: {selector: sectionElemIndex => sectionElemIndex > 0 ? `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1}) > div.cli-tab-header > .cli-switch` : null},
  CONTENT: {selector: sectionElemIndex => `div.cli-tab-section-container > div:nth-child(${sectionElemIndex + 1}) > div.cli-tab-content`},
  SUBMIT_BUTTON: {selector: '#wt-cli-privacy-save-btn'},
  SECTION_TYPES: [
    {
      description: 'REQUIRED / Niezbędne (Wymagane)',
      cookie: {name: 'cookielawinfo-checkbox-necessary', property: 'value', value: ['yes']}
    },
    {
      description: 'STATISTICS / Statystyczne',
      cookie: {name: 'cookielawinfo-checkbox-functional', property: 'value', value: ['no', 'yes']}
    },
    {
      description: 'MARKETING / Marketingowe',
      cookie: {name: 'cookielawinfo-checkbox-advertisement', property: 'value', value: ['no', 'yes']}
    }
  ]
}

const COOKIES = [GDPR_AGREEMENT, ...GDPR_SETTINGS_SECTIONS.SECTION_TYPES]


/* TEST ------------------------------------------------------------------------------------------------------------- */
// SCENARIO with "simple" GDPR AGREEMENT
describe(`Test of GDPR (pl: RODO) - GDPR-cookies-agreement`, () => {
  before(() => {
    cy.visitDefault(URL, true)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })

  it(`GDRP footer/bar should disappear and proper cookie should appear after click on GDRP-cookies-agreement button`, () => {
    cy.get(GDPR_BAR.selector).should('be.visible')
    cy.get(GDPR_AGREEMENT_BUTTON.selector).should('be.visible')
    cy.get(GDPR_AGREEMENT_BUTTON.selector).click()
    cy.get(GDPR_BAR.selector).should('not.visible')
    cy.getCookie(COOKIES[0].cookie.name)
      .should('have.property', COOKIES[0].cookie.property, COOKIES[0].cookie.value[0])
  })
})


// SCENARIO with GDPR SETTINGS
describe(`Test of GDPR (pl: RODO) - GDRP settings`, () => {
  before(() => {
    cy.visitDefault(URL, true)
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

  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[0].description}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 0)
  })

  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[1].description}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 1)
  })

  it(`More details should be showed after clicking on “${GDPR_SETTINGS_SECTIONS.SECTION_TYPES[2].description}”`, () => {
    cy.validateGDPRSettingSection(GDPR_SETTINGS_SECTIONS, 2)
  })

  // TODO: At Cypress only checked cookies are creating (at regular browsers all 4 cookies appear)
  // TODO: Revised below ugly code when answer found why 'At Cypress only checked cookies are creating (at regular browsers all 4 cookies appear)'
  it('Cookies should be set acc. GDRP settings', () => {
    const scenarios = [[false, false], [true, false], [true, true]]
    let ind = 0
    while (ind < scenarios.length) {
      cy.clearCookies()
      cy.visitDefault(URL, true)
      cy.chooseLang(LANG)
      cy.get(GDPR_SETTINGS_BUTTON.selector).click()
      scenarios[ind][0] && cy.get(GDPR_SETTINGS_SECTIONS.CHECKBOX.selector(1)).click()
      scenarios[ind][1] && cy.get(GDPR_SETTINGS_SECTIONS.CHECKBOX.selector(2)).click()
      cy.get(GDPR_SETTINGS_SECTIONS.SUBMIT_BUTTON.selector).click()
      cy.getCookie(COOKIES[0].cookie.name)
        .should('have.property', COOKIES[0].cookie.property, COOKIES[0].cookie.value[0])
      scenarios[ind][0] && cy.getCookie(COOKIES[2].cookie.name)
        .should('have.property', COOKIES[2].cookie.property, COOKIES[2].cookie.value[1])
      scenarios[ind][1] && cy.getCookie(COOKIES[3].cookie.name)
        .should('have.property', COOKIES[3].cookie.property, COOKIES[3].cookie.value[1])
      ind++
    }
  })
})
