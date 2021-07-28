# test-pageLoader package
this package uses angeldav-testpackage and express

```javascript
const express = require('express');
const app = express();
const pageloader = require(`${__dirname}/pageloader.js`)(
    app,
    `${__dirname}/view`
)
```

# pages examples:

view/index.html
```html
<h3> welcome to my website </h3>
<p>hello</p>
```

view/foo.js
```javascript
new page.loader({
    "res":res,
    "req":req,
    "title":"title",
    "templatedir":`${__dirname}/public/foo.html`,
    "other":{
        "foo":"hello"
    }
}).load()
```
