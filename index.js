const fs = require("fs");
let page = require("angeldav-loaderhtml");

const bodyParser = require("body-parser");

module.exports = async function (testpage, config) {
    if (testpage != null) page = testpage;

    async function loadQuery(req, res) {

        let url = req.path.substring(1).split("/");
        let urlpath = req.url;
        urlpath = urlpath.split("?")[0];

        let filepath = `${urlpath.toLowerCase()}/index`;
        if (url[0] == "") urlpath = "/index";

        if (fs.existsSync(`${config.path}${urlpath.toLowerCase()}.html`)) {
            filepath = `${config.path}${urlpath.toLowerCase()}.html`;
        } else if (
            fs.existsSync(`${config.path}${urlpath.toLowerCase()}/index.html`)
        ) {
            filepath = `${config.path}${urlpath.toLowerCase()}/index.html`;
        }

        let title = url[url.length - 1];
        let scriptpath = `${config.path}${urlpath.toLowerCase()}.js`;
        let scriptloaded = false;

        Object.keys(require.cache).forEach((key) => {
            if (key.includes("node_modules")) return;
            delete require.cache[key];
        });

        try {
            if (fs.existsSync(scriptpath)) {
                let dirpath = `${config.path}${urlpath
                    .toLowerCase()
                    .substring(
                        0,
                        urlpath.length - url[url.length - 1].length
                    )}`;
                await require(scriptpath)(req, res, page);
                // eval(fs.readFileSync(scriptpath).toString())
                scriptloaded = true;
            } else {
                scriptpath = `${config.path}/${urlpath.toLowerCase()}/index.js`;
                if (urlpath.toLowerCase() == "/")
                    scriptpath = `${config.path}/index.js`;

                if (fs.existsSync(scriptpath)) {
                    // eval(fs.readFileSync(scriptpath).toString())
                    await require(scriptpath)(req, res, page);
                    scriptloaded = true;
                    // return
                } else if (
                    urlpath.toLowerCase != "/" &&
                    url[0].toLowerCase() != "assets"
                ) {
                    scriptpath = `${
                        config.path
                    }/${url[0].toLowerCase()}/notfound.js`;

                    if (fs.existsSync(scriptpath)) {
                        await require(scriptpath)(req, res, page);
                        // eval(fs.readFileSync(scriptpath).toString())
                        scriptloaded = true;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        if (!scriptloaded)
            new page.loader({
                res: res,
                req: req,
                title: title,
                templatedir: filepath,
            }).load();
    }

    // req.body parser
    config.app.use(bodyParser.json());
    config.app.use(bodyParser.urlencoded({ extended: true }));

    config.app.all("*", (req, res) => {
        loadQuery(req, res);
    });

    config.app.use(function (error, req, res, next) {
        new page.loader({
            res: res,
            req: req,
            title: "ERROR 500",
            templatedir: page.default.notfound,
            other: {
                errortitle: `Internal Server Error`,
                errorcode: `500`,
                errormessage: error,
            },
        }).load();
        console.error(error);
    });
};
