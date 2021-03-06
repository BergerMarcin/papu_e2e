import {findFirstVisibleElementIndex} from './common_func';

// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('visitDefault', (url = 'http://papu.io/', cookiesDebugAndClear = false) => {
  Cypress.Cookies.debug(cookiesDebugAndClear)
  cy.visit(url)
  cookiesDebugAndClear && cy.clearCookies()
})

/**
 * Only setting viewport resolution (not changing environment into mobile or tablet - not possible for Cypress)
 */
Cypress.Commands.add('setDevice', (type) => {
  switch (type) {
    case 'mobileOldPortrait':
      cy.viewport(600, 800)
      break
    case 'mobileRegularPortrait':
      cy.viewport(720, 1280)    // Huawei P7 HD (in real operation)
      break
    case 'mobileModernPortrait':
      cy.viewport(1080, 2400)    // Samsung S51
      break
    case 'tabletSmallLandscape':
      cy.viewport('samsung-s10', 'landscape')
      break
    case 'tabletRegularLandscape':
      cy.viewport(600, 800)
      break
    case 'SVGA':
      cy.viewport(800, 600)
      break
    case 'XGA':
      cy.viewport(1024, 768)
      break
    case 'SXGA':
      cy.viewport(1280, 1024)
      break
    case 'WSXGA+':
      cy.viewport(1680, 1050)
      break
    case 'FHD':
      cy.viewport(1920, 1080)
      break
    case '4K':
      cy.viewport(3840, 2160)
      break
    default:
      cy.viewport(1280, 1024)   // Cypress default is 1000x660px
  }
})

Cypress.Commands.add('chooseLang', (lang) => {
  // settings
  const LANGUAGES = {
    pl: {
      langCode: 'pl-PL',
      langBtnSelector: `img[alt = "Polski"]`
    },
    en: {
      langCode: 'en-GB',
      langBtnSelector: `img[alt = "English"]`
    },
    de: {
      langCode: 'de-DE',
      langBtnSelector: `img[alt = "Deutsch"]`
    }
  }

  // lang validation
  const LANG = LANGUAGES[Object.keys(LANGUAGES).includes(lang) ? lang : 'pl']

  // core
  if (cy.$$('html').attr('lang') !== LANG.langCode) {
    // check for visible language button (& validate)
    cy.validateElementIfExistsAndVisible(LANG.langBtnSelector, 'language button')

    // change language (& validate)
    cy.get(LANG.langBtnSelector)
      .eq(findFirstVisibleElementIndex(LANG.langBtnSelector))
      .click()
    cy.wait(100)
    cy.get('html').should((htmlElem) => {
      expect(htmlElem.attr('lang')).to.be.equal(LANG.langCode)
    })
  }
})

Cypress.Commands.add('validateElementIfExistsAndVisible', (elementsSelector, elementsDescription) => {
  it (`Exists at least 1 ${elementsDescription}`, () => {
    cy.get(elementsSelector).should((elements) => {
      expect(elements.length).to.be.gte(1)
    })
  })

  it (`Visible at least 1 ${elementsDescription}`, () => {
    expect(findFirstVisibleElementIndex(elementsSelector), `Found visible ${elementsDescription}`)
      .to.be.gt(-1)
  })
})

Cypress.Commands.add('validateGDPRSettingSection', (GDPR_SETTINGS_SECTIONS, sectionElemIndex) => {
  cy.get(GDPR_SETTINGS_SECTIONS.CONTAINER.selector(sectionElemIndex)).should('be.visible')
  cy.get(GDPR_SETTINGS_SECTIONS.CONTENT.selector(sectionElemIndex)).should('not.visible')
  cy.get(GDPR_SETTINGS_SECTIONS.HEADER.selector(sectionElemIndex)).click()
  cy.get(GDPR_SETTINGS_SECTIONS.CONTENT.selector(sectionElemIndex)).should('be.visible')
  cy.get(GDPR_SETTINGS_SECTIONS.HEADER.selector(sectionElemIndex)).click()
})
