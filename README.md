# test-pageLoader package
this package uses angeldav-testpackage and express

example of nodejs server
```javascript
const express = require('express');
const app = express();
const package = require('angeldav-testpackage');

package.url = "http://localhost:3000"
package.default.template = `${__dirname}/template.html`
package.default.notfound = `${__dirname}/view/404.html`

app.use('/public', express.static('public'));

const pageloader = require(`angeldav-test-pageloader`)(package,{
    "app":app,
    "path":`${__dirname}/view`
})
```