# Usage
## Start tests
 - Cypress as separate window: ```npm run cy```
 - Cypress headless: ```npm run test```

(for more see: `package.json`)

## After test
Remove from DB data with email `test.test2a.Test2-a@testrestaurant.com.pl`

## General notes

Invalid emails taken partially thanks to: https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses

> NOTE: To run in proper language please set it in before part of the code (hard coded + change texts)

> NOTE: To run in proper desktop, mobile or tablet mode please set it in before part of the code (hard coded)

<br/>
<hr/>
<hr/>

# Actions to be done later on

## Actions for Web Developer
### Main issues
#### Contact form
1. Fix validation of checkboxes (at least 1 checkbox should be checked)
2. Fix validation of email addresses
   - `email@example.web` is not validated by input (REGEX?) but throw error after submission
   - invalid emails are validated by input and does not throw error after submission: `.email@example.com`, `email.@example.com`, `email..email@example.com`, `email@111.222.333.44444`, `Abc..123@example.com`
#### Cookies
1. English texts @ EN

### Minor issues
#### Contact form
1. Website does not validate valid emails with comments wrapped with parentheses: test.test2a.Test2-a(test)@testrestaurant.com.pl (see: https://en.wikipedia.org/wiki/Email_address)
#### Cookies
No issues

## Actions for Test Developer
### Main issues
#### Contact form
1. After fixing validation of checkboxes (ref. `At least 1 checkbox should be checked`): 
   - uncomment lines of **Part 2** of the test
   - revise `FAILED_SUBMIT.selector` for the test (and check other tests as this selector is used at other tests)
2. After fixing validation of email addresses: 
   - uncomment emails of `INVALID_EMAILS_ACC_EMAIL_SPEC`
#### Cookies
No issues

### Minor issues
#### Contact form
1. After fixing validation of email addresses with parentheses: 
   - change `test.test2a.Test2-a@testrestaurant.com.pl` to `test.test2a.Test2-a(test)@testrestaurant.com.pl` of `VALID_FAKE_DATA`
#### Cookies
No issues

<hr/>

## Future features (tests development)
Next version of that test will contain following features:
1. E2E tests for all languages: EN, DE
2. E2E tests for different resolutions
