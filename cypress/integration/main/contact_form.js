// require('../../support/commands')
import '../../support';


/* TEST SETTINGS ---------------------------------------------------------------------------------------------------- */
// MAIN SETTINGS
// for values of below constants refer to commands.js
const URL = 'https://papu.io/'    // for test of the test set: 'http://papu.io/de/'
const LANG = 'pl'                 // for test of the test set: ''
const DEVICE = 'SXGA'             // for test of the test set: ''

// SELECTORS & VALIDATORS
const TEST_DEMO_BUTTON = {
  selector: '.elementor-button-wrapper',
  validationContent: {
    pl: 'Przetestuj demo'
  }
}
const TEST_DEMO_CONTACT_FORM = {
  selector: '.dialog-message.dialog-lightbox-message',
  validation: ''
}
const SUCCESS_CONFIRMATION_TEXT = 'Formularz zosta\u0142 wys\u0142any. W przypadku pyta\u0144 napisz do nas na adres sales@papu.io'

// FIXTURES WRONG
const FAKE_DATA_EMAIL_TESTS = [
  {
    value: 'test@testrestaurant',
    result: false
  }
]

// FIXTURES CORRECT
// !!! WARNING: BELOW DATA WILL BE ADD TO DB (and it should be treated as a fake or removed)
const FAKE_DATA_CORRECT = {
  restaurantName: 'Test Restaurant',
  email: 'test@testrestaurant.pl',
  phone: '600 000 000',
  city: 'Poznań'
}


/* TEST ------------------------------------------------------------------------------------------------------------- */

/**
 * Testing contact form for DEMO-TESTING of landing page
 * !!!
 * WARNING:
 * AFTER THE TEST FAKE_DATA_CORRECT should be added to the DB (and it should be treated as a fake or removed)
 * !!!
 */
describe(`Test for CONTACT-FORM for user-DEMO-TESTING`, () => {
  before( () => {
    cy.visitDefault(URL)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })

  it (`There is at least 1 visible TEST-DEMO button. All TEST-DEMO buttons have proper text "${TEST_DEMO_BUTTON.validationContent[LANG]}"\``, () => {
    cy.validateElementIfExistsAndVisible(TEST_DEMO_BUTTON.selector, 'TEST-DEMO button')
    cy.get(TEST_DEMO_BUTTON.selector).each(element => {
      expect(element.text().toUpperCase(),
        `All TEST-DEMO buttons should have text "${TEST_DEMO_BUTTON.validationContent[LANG]}"`)
        .to.contain(TEST_DEMO_BUTTON.validationContent[LANG].toUpperCase())
    })
  })

  it('All TEST-DEMO buttons should display contact-form', () => {
    cy.get('body').click(0,0)
    cy.wait(1000)
    cy.get(TEST_DEMO_CONTACT_FORM.selector).should('not.exist')
    cy.get(TEST_DEMO_BUTTON.selector).each((elem, index) => {
      if (elem.is(':visible')) {
        cy.get(TEST_DEMO_BUTTON.selector).eq(index).click()
        cy.wait(1000)
        cy.get(TEST_DEMO_CONTACT_FORM.selector).should('be.visible')
        cy.get('body').click(0,0)
        cy.wait(100)
        // TODO: wyjaśnić sobie, dlaczego tutaj nie działało cy.get(TEST_DEMO_CONTACT_FORM.selector).should('not.exist'), gdy powyżej działało - czyżby to kod zamknięty w jQuery z powodu otoczenia go jQuerowym each?
        expect(cy.$$(TEST_DEMO_CONTACT_FORM.selector).length).to.be.eq(0)
      }
    })
  })

  // it('Email should be validated', () => {
  //   let ind = 0
  //   while (ind < FAKE_DATA_EMAIL_TESTS.length) {
  //     const divFormElem = document.getElementById('#form-field-email')
  //     console.log(`divFormElem BEFORE type: `, divFormElem)
  //     cy.get('#form-field-email').type(FAKE_DATA_EMAIL_TESTS[ind].value)
  //     cy.wait(50)
  //     console.log(`divFormElem AFTER type: `, divFormElem)
  //     // cy.get().should(FAKE_DATA_EMAIL_TESTS[ind].result)
  //     ind++
  //   }
  // })

  // it('At least 1 checkbox should be checked', () => {
  //
  // })
  //
  // it('There should be sent request POST with user-email', () => {
  //
  // })
  //
  // it(`Response should contain "${CONFIRMATION_TEXT} - SUCCESS CONFIRMATION"`, () => {
  //
  // })
  //
  // it(`Form should contain "${CONFIRMATION_TEXT}" - SUCCESS CONFIRMATION`, () => {
  //
  // })
})
