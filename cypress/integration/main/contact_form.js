import '../../support';
import {findFirstVisibleElementIndex, readBinaryStringFromArrayBuffer} from '../../support/common_func';


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
const TEST_DEMO_CONTACT_FORM = {selector: '.dialog-message.dialog-lightbox-message'}
const EMAIL_INPUT = {
  selector: '#form-field-email',
  errorSelector: '.elementor-field-type-email > span.elementor-message.elementor-message-danger'
}
const EMAIL_CHECKBOX = {selector: 'input[type = "checkbox"][value="e-mail"]'}
const PHONE_CHECKBOX = {selector: 'input[type = "checkbox"][value="polaczenia-telefoniczne"]'}
const SUBMIT_BUTTON = {selector: 'button[type="submit"]'}
const SUCCESS_SUBMIT = {
  selector: 'div.elementor-message.elementor-message-success',
  validationContent: {
    pl: 'Formularz został wysłany. W przypadku pytań napisz do nas na adres sales@papu.io'  // 'Formularz zosta\u0142 wys\u0142any. W przypadku pyta\u0144 napisz do nas na adres sales@papu.io',
  }
}
const FAILED_SUBMIT = {selector: 'div.elementor-message.elementor-message-danger'}

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
/* TODO: After fixing validation of email addresses:
  - uncomment emails of `INVALID_EMAILS_ACC_EMAIL_SPEC` */
// below causing response code 500 @ request
const INVALID_EMAILS_ACC_EMAIL_SPEC = [
  // ".email@example.com",
  // "email.@example.com",
  // "email..email@example.com",
  "email@example.web",
  // "email@111.222.333.44444",
  // "Abc..123@example.com"
]
// FIXTURES - CORRECT EMAILS
// !!! WARNING: BELOW DATA WILL BE ADD TO DB (and it should be treated as a fake or removed)
const VALID_FAKE_DATA = {
  // restaurantName: 'Test Restaurant',   // for future development
  email: ' test.test2a.Test2-a@testrestaurant.com.pl   ',
  // phone: '600 000 000',                // for future development
  // city: 'Poznań'                       // for future development
}

// FINAL TEST - REQUEST
const REQUEST_CONTACT_FORM = {
  url: 'https://papu.io/wp-admin/admin-ajax.php',
  method: 'POST',
  email: VALID_FAKE_DATA.email,
  validationContent: SUCCESS_SUBMIT.validationContent,
  responseStatusCode: 200
}


/* TEST ------------------------------------------------------------------------------------------------------------- */
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

  it('Contact-form should be OK (is visible; has email field with required attribute; has checkboxes; has submit button)', () => {
    cy.get(TEST_DEMO_BUTTON.selector)
      .eq(findFirstVisibleElementIndex(TEST_DEMO_BUTTON.selector))
      .click()
    cy.get(TEST_DEMO_CONTACT_FORM.selector).should('be.visible')
    cy.get(EMAIL_INPUT.selector).should('be.visible')
    cy.get(EMAIL_INPUT.selector).should('have.attr', 'required')
    cy.get(EMAIL_CHECKBOX.selector).should('be.visible')
    cy.get(PHONE_CHECKBOX.selector).should('be.visible')
    cy.get(SUBMIT_BUTTON.selector).should('be.visible')
  })

  it('Invalid emails should NOT be validated by REGEX of the email-input', () => {
    cy.get(EMAIL_CHECKBOX.selector).click()
    let ind = 0
    while (ind < INVALID_EMAILS_ACC_REGEX.length) {
      cy.get(EMAIL_INPUT.selector).type(INVALID_EMAILS_ACC_REGEX[ind])
      cy.get(SUBMIT_BUTTON.selector).click()
      cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.exist
        return false
      })
      cy.get(EMAIL_INPUT.errorSelector).should('be.visible')
      cy.get(SUCCESS_SUBMIT.selector).should('not.exist')
      cy.get(EMAIL_INPUT.selector).clear()
      ind++
    }
  })

  it('Invalid emails (but valid acc. REGEX) should cause error after submission', () => {
    cy.get(EMAIL_CHECKBOX.selector).click()
    let ind = 0
    while (ind < INVALID_EMAILS_ACC_EMAIL_SPEC.length) {
      cy.get(EMAIL_INPUT.selector).type(INVALID_EMAILS_ACC_EMAIL_SPEC[ind])
      cy.get(SUBMIT_BUTTON.selector).click()
      cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.exist
        return false
      })
      cy.get(FAILED_SUBMIT.selector).should('be.visible')
      cy.get(SUCCESS_SUBMIT.selector).should('not.exist')
      cy.get(EMAIL_INPUT.errorSelector).should('not.exist')
      cy.get(EMAIL_INPUT.selector).clear()
      ind++
    }
  })
  it('At least 1 checkbox should be checked', () => {
    // Part 1. At least 1 checkbox is checked - SUCCESS
    const checkedTest = [[true, true], [true, false], [false, true]]
    let ind = 0
    while (ind < INVALID_EMAILS_ACC_EMAIL_SPEC.length) {
      if (cy.$$(EMAIL_CHECKBOX.selector).checked !== checkedTest[ind][0]) cy.get(EMAIL_CHECKBOX.selector).click()
      if (cy.$$(PHONE_CHECKBOX.selector).checked !== checkedTest[ind][1]) cy.get(PHONE_CHECKBOX.selector).click()
      cy.get(EMAIL_INPUT.selector).clear().type(VALID_FAKE_DATA.email)
      cy.get(SUBMIT_BUTTON.selector).click()
      cy.get(SUCCESS_SUBMIT.selector).should('be.visible')
      cy.get(FAILED_SUBMIT.selector).should('not.exist')
      ind++
    }

    /* TODO: After fixing validation of checkboxes (ref. `At least 1 checkbox should be checked`):
       - uncomment lines of **Part 2** of the test
       - revise `FAILED_SUBMIT.selector` for the test (and check other tests as this selector is used at other tests)*/

    // // Part 2. All checkboxes are unchecked - FAILED
    // if (cy.$$(EMAIL_CHECKBOX.selector).checked) cy.get(EMAIL_CHECKBOX.selector).click()
    // if (cy.$$(PHONE_CHECKBOX.selector).checked) cy.get(PHONE_CHECKBOX.selector).click()
    // cy.get(EMAIL_INPUT.selector).clear().type(VALID_FAKE_DATA.email)
    // cy.get(SUBMIT_BUTTON.selector).click()
    // cy.on('uncaught:exception', (err, runnable) => {
    //   expect(err.message).to.exist
    //   return false
    // })
    // cy.get(FAILED_SUBMIT.selector).should('be.visible')
    // cy.get(SUCCESS_SUBMIT.selector).should('not.exist')
  })


  // FINAL TESTS
  it(`FINAL TEST. After submit contact form properly, there should be sent request POST with user-contact-email, response should have text which should be visible in contact form - text: ${SUCCESS_SUBMIT.validationContent.pl}`, () => {
    // preparing test
    cy.intercept(REQUEST_CONTACT_FORM.method, REQUEST_CONTACT_FORM.url).as('interceptFormRequest')

    // fill-in data and submit
    cy.get(EMAIL_INPUT.selector).clear().type(REQUEST_CONTACT_FORM.email)
    if (!cy.$$(EMAIL_CHECKBOX.selector).checked) cy.get(EMAIL_CHECKBOX.selector).click()
    cy.get(SUBMIT_BUTTON.selector).click()
    cy.get(SUCCESS_SUBMIT.selector).should('be.visible')
    expect(SUCCESS_SUBMIT.validationContent.pl).to.be.eq(REQUEST_CONTACT_FORM.validationContent.pl)
    cy.get(SUCCESS_SUBMIT.selector).should('contain.text', SUCCESS_SUBMIT.validationContent.pl)
    cy.get(FAILED_SUBMIT.selector).should('not.exist')
    cy.get(EMAIL_INPUT.errorSelector).should('not.exist')

    // core validation
    cy.wait('@interceptFormRequest').then(({request, response}) => {
      readBinaryStringFromArrayBuffer(request.body, (bodyStr) => {
        expect(bodyStr).to.include(REQUEST_CONTACT_FORM.email.trim())
      })
      // below commented simple solution but not recommended - sometimes causing "Maximum call stack size exceeded"
      // expect(String.fromCharCode.apply(null, new Uint8Array(request.body)))
      //   .to.include(REQUEST_CONTACT_FORM.email.trim())
      expect(JSON.stringify(response.body)).to.include(REQUEST_CONTACT_FORM.validationContent.pl)
      expect(response.statusCode).to.eq(REQUEST_CONTACT_FORM.responseStatusCode)
    })
  })
})
