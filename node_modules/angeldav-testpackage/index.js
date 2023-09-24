const fs = require('fs');

class loader {
    constructor(configtable) { // loader constructor
        this.res = configtable.res
        this.req = configtable.req
        this.basetemplate = configtable.basetemplate || module.exports.default.template;
        this.custombasetemplate = configtable.custombasetemplate || "";
        this.templatedir = configtable.templatedir || "";
        this.template = configtable.template || "";
        this.other = configtable.other || {};
        this.title = configtable.title || "";
    }

    load() { // loads the html
        //console.log(__dirname);
        if (this.res && this.req) {
            let dirtemplate = this.templatedir
            let other = this.other

            if(!fs.existsSync(dirtemplate) && !fs.existsSync(this.templatedir) && this.template == "") { // checks if page exists
                this.res.status(404)
				dirtemplate = module.exports.default.notfound
                other = {
                    "errortitle": '404: Page not found',
                    "errorcode": + '404',
                    "errormessage": (this.req.path.substring(1) + " isn't a valid page")
                }
            }

            if (fs.existsSync(this.templatedir)) dirtemplate = this.templatedir

            var classmain = "main"
            var htmltemplate = fs.readFileSync(this.basetemplate).toString();
            
            if (this.custombasetemplate != "") htmltemplate = this.custombasetemplate

            let section = null;
            if (fs.existsSync(dirtemplate) && !section) section = fs.readFileSync(dirtemplate).toString()
            if (this.template && !section && !fs.existsSync(dirtemplate)) section = this.template

            let req = this.req;
            let res = this.res;

            module.exports.url = (module.exports.url || `https://${req.headers.host}`);
            new Promise(function(resolve, reject) {
                let autoresolve = true
                if (fs.existsSync(module.exports.default.codeDir)) eval(fs.readFileSync(module.exports.default.codeDir).toString());
                if (autoresolve == true) resolve("");
            }).then(() => {
                htmltemplate = htmltemplate.replace(/(\<html .*?\>)/g, `<html class="${classmain.replace(/main/g,"")}">`);
                htmltemplate = htmltemplate.replace(/<¿templatesectionmain>/g, section);
                htmltemplate = htmltemplate.replace(/<¿templatesectionclass>/g, classmain);

                if (module.exports.default.other != {}) for (let value in module.exports.default.other) {
                    htmltemplate = htmltemplate.replace(new RegExp(`<¡${value}>`,"g"),module.exports.default.other[value]);
                }
                
                if (other != {}) for (let value in other) {
                    if (typeof(other[value]) == "object") for (let val in other[value]) {
                        htmltemplate = htmltemplate.replace(new RegExp(`<¡${value}.${val}>`,"g"),other[value][val]);
                    }
                    htmltemplate = htmltemplate.replace(new RegExp(`<¡${value}>`,"g"),other[value]);
                }
                
                htmltemplate = htmltemplate.replace(/__pagetitle/g, this.title)
                htmltemplate = htmltemplate.replace(/__rooturl/g, module.exports.url || `https://${req.headers.host}`);
                
                if(!this.res.headersSent) this.res.send(htmltemplate) // send html if headers are not already sent
            })
        }
    }
}

class templater {
    constructor(configtable) {
        this.templatedir = configtable.templatedir;
        this.template = configtable.template || "";
        this.other = configtable.other || {};
    }

    load() {
        var template;
        if (fs.existsSync(this.templatedir)) {
            template = fs.readFileSync(this.templatedir).toString();
        } else if (this.template != "") {
            template = this.template
        }

        if (this.other != {}) for (let value in this.other) {
            if (typeof(this.other[value]) == "object") for (let val in this.other[value]) {
                template = template.replace(new RegExp(`<¡${value}.${val}>`,"g"),this.other[value][val]);
            }
            template = template.replace(new RegExp(`<¡${value}>`,"g"),this.other[value]);
        }

        template = template.replace(/__rooturl/g, module.exports.url);
        return template
    }
}

module.exports = {
    url: undefined,
    default:{
        codeDir: "",
        template: "",
        notfound:"",
        other:{

        }
    },
    loader,
    templater
}