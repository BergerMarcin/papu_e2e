// require('../../support/commands')
import '../../support';

const URL = 'https://papu.io/'
const LANG = 'PL'
const FAKE_DATA_EMAIL_TESTS = [
  {
    value: 'test@testrestaurant',
    result: false
  }
]
// !!! WARNING: BELOW DATA WILL BE ADD TO DB (and it should be treated as a fake or removed)
const FAKE_DATA_CORRECT = {
  restaurantName: 'Test Restaurant',
  email: 'test@testrestaurant.pl',
  phone: '600 000 000',
  city: 'Poznań'
}
const TEST_DEMO_BUTTON = {
  selector: '.elementor-button-wrapper',
  content: {pl: 'Przetestuj demo'}
}
const TEST_DEMO_CONTACT_FORM_SELECTOR = '.dialog-message dialog-lightbox-message'
const SUCCESS_CONFIRMATION_TEXT = 'Formularz zosta\u0142 wys\u0142any. W przypadku pyta\u0144 napisz do nas na adres sales@papu.io'

/**
 * Testing contact form for DEMO-TESTING of landing page
 * LIMITS:
 *  - only PL language
 *  - check all test-demo buttons if form appearing
 *  - but tested only first child (from the top of the page-web)
 *  WARNING:
 *  AFTER THE TEST FAKE_DATA_CORRECT should be added to the DB (and it should be treated as a fake or removed)
 */
describe('Test for CONTACT-FORM for user-DEMO-TESTING', () => {
  before( () => {
    cy.visitDefault('http://papu.io/de/')
    // TODO: @ new version add feature of changing devices
    cy.setDevice()
    // TODO: @ new version add feature of changing languages (note: there are urls: http://papu.io/en/ http://papu.io/de/ - to be discussed with routing master / documentation)
    cy.chooseLang()
  })

  it ('At least 1 TEST-DEMO button should exist', () => {
    // const buttomElements = $('.elementor-button-wrapper')
    cy.get(TEST_DEMO_BUTTON.selector).should((buttomElements) => {
      expect(buttomElements.length).to.be.gte(1)
    })
    cy.get(TEST_DEMO_BUTTON.selector).each(element => {
      expect(element.text().toUpperCase()).to.contain(TEST_DEMO_BUTTON.content.pl.toUpperCase())
    })
  })

  // it('All buttons TEST-DEMO should display contact-form', () => {
  //   $(TEST_DEMO_BUTTON).each((index, elem) => {
  //     elem.click()
  //     cy.wait(100)
  //     cy.get(TEST_DEMO_CONTACT_FORM_SELECTOR).should(())
  //     cy.wait(100)
  //   })
  //   cy.get('').click
  // })

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
