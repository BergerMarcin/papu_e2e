// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('visitDefault', (url = 'http://papu.io/') => {
  cy.visit(url)
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
    // looking for visible language button (& validate)
    const langBtns = cy.$$(LANG.langBtnSelector)
    let visibleIndex = 0
    while (!langBtns.eq(visibleIndex).is(':visible')) visibleIndex++
    expect(visibleIndex, 'Visible language buttons found').to.be.lt(langBtns.length)

    // change language (& validate
    cy.get(LANG.langBtnSelector).eq(visibleIndex).click()
    cy.wait(100)
    cy.get('html').should((htmlElem) => {
      expect(htmlElem.attr('lang')).to.be.equal(LANG.langCode)
    })
  }
})
