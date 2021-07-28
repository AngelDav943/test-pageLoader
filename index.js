const fs = require('fs');
const page = require('angeldav-testpackage');

class loader {
    constructor(express_app,pages_path) {
        this.app = express_app
        this.pages = pages_path

        this.app.get('*', (req, res) => {
            let url = req.path.substring(1).split('/');
            let urlpath = req.url;
            urlpath = urlpath.split('?')[0]
        
            let baseurl = url[0];
        
            let filepath = `${urlpath.toLowerCase()}/index`;

            if ( url[url.length-1] != "index" && fs.existsSync(`${pages_path}${urlpath.toLowerCase()}.html`)) {
                filepath = `${pages_path}${urlpath.toLowerCase()}.html`
            }
        
            let paths = filepath.split('/');
            let title = [url.length - 1];
            let scriptpath = `${pages_path}${urlpath.toLowerCase()}.js`;
            let scriptloaded = false
        
            if (fs.existsSync(scriptpath)) {
                eval(fs.readFileSync(scriptpath).toString())
                scriptloaded = true
            } else {
                scriptpath = `${pages_path}/${urlpath.toLowerCase()}/index.js`
                if (urlpath.toLowerCase() == "/") scriptpath = `${pages_path}/index.js`
                try {
                    eval(fs.readFileSync(scriptpath).toString())
                    scriptloaded = true
                } catch(err) {
                    try {
                        if (urlpath.toLowerCase() != "/" && url[0].toLowerCase() != "assets") {
                            eval(fs.readFileSync(`${pages_path}/${url[0].toLowerCase()}/notfound.js`).toString())
                            scriptloaded = true
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
}

module.exports = loader;