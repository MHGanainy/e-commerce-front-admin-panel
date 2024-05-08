# TMG Security Checklist

## Frontend

#### HTML5 

##### Local Storage

- A single XSS attack can be used to steal all the data in these objects, so again it's recommended not to store sensitive information in local storage.

- A single XSS attack can be used to load malicious data into these objects too, so don't consider objects in these to be trusted.

- Do not store session identifiers in local storage as the data is always accessible by JavaScript. Cookies can mitigate this risk using the `httpOnly` flag.

  

##### Tabnabbing

it's the capacity to act on parent page's content or location from a newly opened page via the back link exposed by the opener javascript object instance.

​       **Fix:**

- For html link:

  - To cut this back link, add the attribute `rel="noopener"` on the tag used to create the link from the parent page to the child page. This attribute value cuts the link, but depending on the browser, lets referrer information be present in the request to the child page.
  - To also remove the referrer information use this attribute value: `rel="noopener noreferrer"`.

- For javascript `window.open` function, add the values `noopener,noreferrer` in the [windowFeatures](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) parameter of the `window.open` function.

  ```javascript
  function openPopup(url, name, windowFeatures){
    //Open the popup and set the opener and referrer policy instruction
    var newWindow = window.open(url, name, 'noopener,noreferrer,' + windowFeatures);
    //Reset the opener link
    newWindow.opener = null;
  }
  ```

* Add the HTTP response header `Referrer-Policy: no-referrer` to every HTTP response sent by the application ([Header Referrer-Policy information](https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#rp). This configuration will ensure that no referrer information is sent along with requests from the page.

##### Credential and Personally Identifiable Information (PII) Input hints

- Protect the input values from being cached by the browser.

> Access a financial account from a public computer. Even though one is logged-off, the next person who uses the machine can log-in because the browser autocomplete functionality. To mitigate this, we tell the input fields not to assist in any way.

```html
<input type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></input>
```

#### Authentication

##### User IDS

Make sure your usernames or user IDs are case insensitive. User 'smith' and user 'Smith' should be the same user. Usernames should also be unique. For high security applications usernames could be assigned and secret instead of user-defined public data.

##### Passwords

A key concern when using passwords for authentication is password strength. A "strong" password policy makes it difficult or even improbable for one to guess the password through either manual or automated means. The following characteristics define a strong password:

- Password Length

  - **Minimum** length of the passwords should be **enforced** by the application. Passwords **shorter than 8 characters** are considered to be weak ([NIST SP800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)).

  - **Maximum** password length should not be set **too low**, as it will prevent users from creating passphrases. 

    Bcrypt -> 64 characters

    Others -> Up to 128 (varies)

- Do not truncate passwords. Make sure that every character the user types in is actually included in the password.

- Allow usage of **all** characters including Unicode and whitespace. There should be no password composition rules limiting the type of characters permitted.

- Ensure credential rotation when a password leak, or at the time of compromise identification.

- Include password strength meter to help users create a more complex password and block common and previously breached passwords

  - [Pwned Passwords](https://haveibeenpwned.com/Passwords) is a service where passwords can be checked against previously breached passwords. You can host it yourself or use [API](https://haveibeenpwned.com/API/v2#PwnedPasswords).

##### Compare Password Hashes Using Safe Functions

Where possible, the user-supplied password should be compared to the stored password hash using a secure password comparison function provided by the language or framework, such as the [password_verify()](https://www.php.net/manual/en/function.password-verify.php) function in PHP. 

##### Transmit Passwords Only Over TLS or Other Strong Transport

The login page and all subsequent authenticated pages must be exclusively accessed over TLS or other strong transport. The initial login page, referred to as the "login landing page", must be served over TLS or other strong transport. Failure to utilize TLS or other strong transport for the login landing page allows an attacker to modify the login form action, causing the user's credentials to be posted to an arbitrary location. Failure to utilize TLS or other strong transport for authenticated pages after login enables an attacker to view the unencrypted session ID and compromise the user's authenticated session.

##### Require Re-authentication for Sensitive Features

In order to mitigate CSRF and session hijacking, it's important to require the current credentials for an account before updating sensitive account information such as the user's password, user's email, or before sensitive transactions, such as shipping a purchase to a new address. Without this countermeasure, an attacker may be able to execute sensitive transactions through a CSRF or XSS attack without needing to know the user's current credentials. Additionally, an attacker may get temporary physical access to a user's browser or steal their session ID to take over the user's session.

##### Authentication Responses

Using any of the authentication mechanisms (login, password reset or password recovery) an application must respond with a generic error message regardless of whether:

- The user ID or password was incorrect.
- The account does not exist.
- The account is locked or disabled.

The account registration feature should also be taken into consideration, and the same approach of generic error message can be applied regarding the case in which the user exists.

The objective is to prevent the creation of a [discrepancy factor](https://cwe.mitre.org/data/definitions/204.html) allowing an attacker to mount a user enumeration action against the application.

The problem with returning a generic error message for the user is a User Experience (UX) matter. A legitimate user might feel confused with the generic messages, thus making it hard for them to use the application, and might after several retries, leave the application because of its complexity. The decision to return a *generic error message* can be determined based on the criticality of the application and its data. For example, for critical applications, the team can decide that under the failure scenario, a user will always be redirected to the support page and a *generic error message* will be returned.

Regarding the user enumeration itself, protection against [brute-force attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Authentication_Cheat_Sheet.md#protect-against-automated-attacks) are also effective because they prevent an attacker to apply the enumeration at scale. Usage of [CAPTCHA](https://en.wikipedia.org/wiki/CAPTCHA) can be applied on a feature for which a *generic error message* cannot be returned because the *user experience* must be preserved.

##### Protect Against Automated Attacks

  * Account Lockout
  * 2FA
  * Secondary Passwords
  * CAPTCHA
  * IP Blacklisting

#### Session Management

A web session is a sequence of network HTTP request and response transactions associated to the same user. Modern and complex web applications require the retaining of information or status about each user for the duration of multiple requests. Therefore, sessions provide the ability to establish variables – such as access rights and localization settings – which will apply to each and every interaction a user has with the web application for the duration of the session.

##### Session ID Properties

In order to keep the authenticated state and track the users progress within the web application, applications provide users with a **session identifier** (session ID or token) that is assigned at session creation time, and is shared and exchanged by the user and the web application for the duration of the session (it is sent on every HTTP request). The session ID is a `name=value` pair.

###### ID Fingerprinting 

The session ID names used by the most common web application development frameworks [can be easily fingerprinted](https://www.owasp.org/index.php/Category:OWASP_Cookies_Database), such as `PHPSESSID` (PHP), `JSESSIONID` (J2EE), `CFID` & `CFTOKEN` (ColdFusion), `ASP.NET_SessionId` (ASP .NET), etc. Therefore, the session ID name can disclose the technologies and programming languages used by the web application.

It is recommended to change the default session ID name of the web development framework to a generic name, such as `id`.

###### ID Length

The session ID length must be at least `128 bits (16 bytes)`.

###### ID Entropy

The session ID must be unpredictable (random enough) to prevent guessing attacks, where an attacker is able to guess or predict the ID of a valid session through statistical analysis techniques. For this purpose, a good [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) (Pseudo Random Number Generator) must be used.

The session ID value must provide at least `64 bits` of entropy (if a good PRNG is used, this value is estimated to be half the length of the session ID).

###### ID Content 

The session ID content (or value) must be meaningless to prevent information disclosure attacks, where an attacker is able to decode the contents of the ID and extract details of the user, the session, or the inner workings of the web application.

The session ID must simply be an identifier on the client side, and its value must never include sensitive information (or [PII](https://en.wikipedia.org/wiki/Personally_identifiable_information)).

The stored information can include the client IP address, User-Agent, e-mail, username, user ID, role, privilege level, access rights, language preferences, account ID, current state, last login, session timeouts, and other internal session details. If the session objects and properties contain sensitive information, such as credit card numbers, it is required to duly encrypt and protect the session management repository.

It is recommended to create cryptographically strong session IDs through the usage of cryptographic hash functions such as SHA256

#### Cross-site Scripting (XSS)

#### REST

## Backend

##### Authentication / JSON Web Tokens

##### Session Management

##### Cross-site Scripting (XSS)

##### Cross-site Request Forgery (CSRF)

##### Error Handling

##### REST

