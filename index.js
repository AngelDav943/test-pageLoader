const fs = require('fs');
let page = require('angeldav-testpackage');

module.exports = async function(testpage,config) {
    if (testpage != null) page = testpage;

    config.app.get('*', (req, res) => {
        let url = req.path.substring(1).split('/');
        let urlpath = req.url;
        urlpath = urlpath.split('?')[0];
        
        let filepath = `${urlpath.toLowerCase()}/index`;
        if (url[0] == "") urlpath = "/index"
        
        if (fs.existsSync(`${config.path}${urlpath.toLowerCase()}.html`)) {
            filepath = `${config.path}${urlpath.toLowerCase()}.html`
        } else if (fs.existsSync(`${config.path}${urlpath.toLowerCase()}/index.html`)) {
            filepath = `${config.path}${urlpath.toLowerCase()}/index.html`
        }
        
        let title = url[url.length - 1];
        let scriptpath = `${config.path}${urlpath.toLowerCase()}.js`;
        let scriptloaded = false
        
        if (fs.existsSync(scriptpath)) {
            var dirpath = `${config.path}${urlpath.toLowerCase().substring(0, urlpath.length - url[url.length-1].length)}`
            eval(fs.readFileSync(scriptpath).toString())
            scriptloaded = true
        } else {
            scriptpath = `${config.path}/${urlpath.toLowerCase()}/index.js`
            if (urlpath.toLowerCase() == "/") scriptpath = `${config.path}/index.js`
            try {
                eval(fs.readFileSync(scriptpath).toString())
                scriptloaded = true
                return
            } catch(err) {
                try {
                    if (urlpath.toLowerCase() != "/" && url[0].toLowerCase() != "assets") {
                        eval(fs.readFileSync(`${config.path}/${url[0].toLowerCase()}/notfound.js`).toString())
                        scriptloaded = true
                        return
                    }
                } catch(err) {
    
                }
            }
        }
        
        if (!scriptloaded) new page.loader({
            "res":res,
            "req":req,
            "title":title,
            "templatedir":filepath
        }).load()
    });
}