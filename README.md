# Description
This is project for https://papu.io E2E tests of:
- ***contact form*** (to get DEMO TESTS by client/user) 
- ***cookies/GDPR-policy*** with checking creation cookies 

<br/>
Minimum specification of the tests: <br/> 
https://docs.google.com/document/d/1qFwFdG3MUBw-LGeXwwBuHccypu7ICBmvF6kM7hdmF_w/edit

<br/><hr/>

# Usage
## Init
```npm i``` (for dev Cypress)

## Start tests
 - Cypress @ browser: ```npm run cy```
 - Cypress @ terminal (headless): ```npm run tests```

(for more see: `package.json`)

## After test
Remove from DB data with email `test.test2a.Test2-a@testrestaurant.com.pl`

<br/><hr/>

# General notes

Invalid emails taken partially thanks to: <br/>
https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses

Parsing ArrayBuffer from request thanks to: <br/>
Konstantin Smolyanin answer @ https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers

> NOTE: To run in proper language please set it in before part of the code (hard coded + change texts)

> NOTE: To run in proper resolution please set constants `DEVICE` acc. `setDevice` command (hard coded)

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
#### Cookies/GDPR-policy
No issues

### Minor issues
#### Contact form
1. After fixing validation of email addresses with parentheses: 
   - change `test.test2a.Test2-a@testrestaurant.com.pl` to `test.test2a.Test2-a(test)@testrestaurant.com.pl` of `VALID_FAKE_DATA`
#### Cookies/GDPR-policy
No issues

<br/><hr/>

## Future features (tests development)
Next version of that test will contain following features:
0. Centralised main configuration settings
1. E2E tests for all languages: EN, DE
2. E2E tests for different resolutions
3. E2E tests with other inputs
