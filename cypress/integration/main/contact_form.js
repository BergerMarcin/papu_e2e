// require('../../support')
import '../../support';
import {findFirstVisibleElementIndex} from '../../support/common_func';


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
  selector: '.dialog-message.dialog-lightbox-message'
}
const EMAIL_INPUT = {
  selector: '#form-field-email',
  validationElementNotExist: '.elementor-field-type-email > span.elementor-message.elementor-message-danger'
}
const TEST_DEMO_CONTACT_FORM_SUBMIT_BUTTON = {
  selector: 'button[type="submit"]'
}
const SUCCESS_CONFIRMATION_TEXT = 'Formularz zosta\u0142 wys\u0142any. W przypadku pyta\u0144 napisz do nas na adres sales@papu.io'

// FIXTURES
// below causing regex mismatch @ input field
const INVALID_EMAILS_ACC_REGEX = [
  'test@testrestaurant',
  'test@$testrestaurant.pl',
  'test@.pl',
// thanks to: https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
  "plainaddress",
  "#@%^%#$@#$@#.com",
  "@example.com",
  "Joe Smith <email@example.com>",
  "email.example.com",
  "email@example@example.com",
  "あいうえお@example.com",
  "email@example.com (Joe Smith)",
  "email@example",
  "email@-example.com",
  "email@example..com"
]
// below causing response code 500 @ request
const INVALID_EMAILS_ACC_EMAIL_SPEC = [
  ".email@example.com",
  "email.@example.com",
  "email..email@example.com",
  "email@example.web",
  "email@111.222.333.44444",
  "Abc..123@example.com"
]
// FIXTURES - CORRECT EMAILS
// !!! WARNING: BELOW DATA WILL BE ADD TO DB (and it should be treated as a fake or removed)
const VALID_FAKE_DATA = {
  restaurantName: 'Test Restaurant',
  email: ' test.test2a.Test2-a@testrestaurant.com.pl   ',
  phone: '600 000 000',
  city: 'Poznań'
}


/* TEST ------------------------------------------------------------------------------------------------------------- */

/**
 * Testing contact form for DEMO-TESTING of landing page
 * !!!
 * WARNING:
 * AFTER THE TEST VALID_FAKE_DATA should be added to the DB (and it should be treated as a fake or removed)
 * !!!
 */
describe(`Test for CONTACT-FORM for user-DEMO-TESTING`, () => {
  before(() => {
    cy.visitDefault(URL)
    // TODO: @ new version add feature of changing devices
    cy.setDevice(DEVICE)
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang(LANG)
  })

  it(`There is at least 1 visible TEST-DEMO button. All TEST-DEMO buttons have proper text "${TEST_DEMO_BUTTON.validationContent[LANG]}"\``, () => {
    cy.validateElementIfExistsAndVisible(TEST_DEMO_BUTTON.selector, 'TEST-DEMO button')
    cy.get(TEST_DEMO_BUTTON.selector).each(elem => {
      if (elem.is(':visible')) {
        expect(elem.text().toUpperCase(),
          `All TEST-DEMO buttons should have text "${TEST_DEMO_BUTTON.validationContent[LANG]}"`)
          .to.contain(TEST_DEMO_BUTTON.validationContent[LANG].toUpperCase())
      }
    })
  })

  it('All TEST-DEMO buttons should display contact-form', () => {
    cy.get('body').click(0, 0)
    cy.get(TEST_DEMO_CONTACT_FORM.selector).should('not.exist')
    cy.get(TEST_DEMO_BUTTON.selector).each((elem, index) => {
      if (elem.is(':visible')) {
        cy.get(TEST_DEMO_BUTTON.selector).eq(index).click()
        cy.get(TEST_DEMO_CONTACT_FORM.selector).should('be.visible')
        cy.get('body').click(0, 0)
        // TODO: doczytać sobie, dlaczego tutaj nie działało cy.get(TEST_DEMO_CONTACT_FORM.selector).should('not.exist'), gdy powyżej działało - czyżby to kod zamknięty w jQuery z powodu otoczenia go jQuerowym each (chyba utrata promisowego Cypressa)?
        expect(cy.$$(TEST_DEMO_CONTACT_FORM.selector).length).to.be.eq(0)
      }
    })
  })

  it('Contact-form should be visible, should have email field visible with required attribute and should have visible submit button', () => {
    cy.get(TEST_DEMO_BUTTON.selector)
      .eq(findFirstVisibleElementIndex(TEST_DEMO_BUTTON.selector))
      .click()
    cy.get(TEST_DEMO_CONTACT_FORM.selector).should('be.visible')
    cy.get(EMAIL_INPUT.selector).should('be.visible')
    cy.get(EMAIL_INPUT.selector).should('have.attr', 'required')
    cy.get(TEST_DEMO_CONTACT_FORM_SUBMIT_BUTTON.selector).should('be.visible')
  })

  it('Invalid emails should NOT be validated by REGEX of the email-input', () => {
    let ind = 0
    while (ind < INVALID_EMAILS_ACC_REGEX.length) {
      cy.get(EMAIL_INPUT.selector).type(INVALID_EMAILS_ACC_REGEX[ind])
      cy.get(TEST_DEMO_CONTACT_FORM_SUBMIT_BUTTON.selector).click()
      cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.exist
        return false
      })
      cy.get(EMAIL_INPUT.validationElementNotExist).should('be.visible')
      cy.get(EMAIL_INPUT.selector).clear()
      ind++
    }
  })

  // it('At least 1 checkbox should be checked', () => {
  //
  // })
  //
  // it('There should be sent request POST with user-email', () => {
  // cy.get(EMAIL_INPUT.selector).should('be.visible')
  // cy.get(EMAIL_INPUT.selector).type(VALID_FAKE_DATA.email)
  // cy.wait(200)
  // cy.get(TEST_DEMO_CONTACT_FORM_SUBMIT_BUTTON.selector).click()
  // cy.wait(200)
  // cy.get(EMAIL_INPUT.validationElementNotExist).should('not.exist')
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
