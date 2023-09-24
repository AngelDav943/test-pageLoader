# test-pageLoader package
This is a small package i made that handles all express's app.get requests, it uses angeldav-testpackage and expressjs.

Initalization variables for ``angeldav-testpackage``
```javascript
// import angeldav-testpackage
const page = require('angeldav-testpackage');

// set url of the website to replace __rooturl in the html files to the chosen url
page.url = "localhost:1234" 

// Page to show when a page is not found
page.default.notfound:`${__dirname}/notfound.html` 

// Base template for the pages
page.default.template = `${__dirname}/template.html` 

// OPTIONAL
// replaces tags like <¡foo> to the content inside this value in all pages
page.default.other = {
    "foo":"<input type='button' value='button'>" 
}
```

page loader
```javascript
const express = require('express');
const app = express();

const pageloader = require(`angeldav-test-pageloader`)(page,{
    "app":app, // express app
    "path":`${__dirname}/view` // folder containing all pages to load
})
```

## TAGS

404 error tags
```html
<¡errortitle> <!-- Displays error title example: 404: Page not found -->
<¡errormessage> <!-- Displays error message ex: {page name} isn't a valid page -->
<¡errorcode> <!-- Displays error code ex: 404 -->
```

Other tags
```html
__pagetitle  <!-- Displays the title chosen in the config table -->
__rooturl  <!-- Returns the website url stated in package.url -->
```

## EXAMPLES

Example of ``index.js``
```javascript
const express = require('express');
const app = express();
const page = require('angeldav-testpackage');

page.url = "http://localhost:3000"
page.default.template = `${__dirname}/template.html`
page.default.notfound = `${__dirname}/view/404.html`

app.use('/public', express.static('public'));

const pageloader = require(`angeldav-test-pageloader`)(page,{
    "app":app,
    "path":`${__dirname}/view`
})
```

Example of ``template.html``
```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Website</title>
    </head>

    <body>
        <section class="<¿templatesectionclass>">
            <¿templatesectionmain> <!-- required for loader content to show -->
        </section>
    </body>

</html>
```
Example of index page

``view/index.html``
```html
<p>Hello world!</p>
```

![screenshot](https://github.com/AngelDav943/test-pageLoader/assets/35638964/99e25d26-948d-4b7e-959c-2c6f505c79e3)

Example of static page

``view/test.html``
```html
<h2>Test</h2>
<p>Hello this is a test</p>
```

![screenshot1](https://github.com/AngelDav943/test-pageLoader/assets/35638964/87726d8c-7f87-4b61-8357-1424b118005a)

Example of dynamic page

``view/codetest.js``
```javascript
const number1 = parseInt(req.query.a)
const number2 = parseInt(req.query.b)
var total = number1 + number2

new page.loader({
    "res": res,
    "req": req,
    "title": "Sum of numbers",
    "templatedir": `${__dirname}/../../pages/codetest.html`,
    "other": {
        "num1": number1,
        "num2": number2,
        "total": total
    }
}).load()
```

``pages/codetest.html``
```html
<h2>__pagetitle</h2>
<p>The sum of <¡num1> and <¡num2> is <¡total></p>
```

![screenshot](https://github.com/AngelDav943/test-pageLoader/assets/35638964/b4f58788-4bc1-4d14-97c3-a83d6661bc02)
