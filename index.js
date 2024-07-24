const fs = require("fs");
let page = require("angeldav-loaderhtml");

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

        Object.keys(require.cache).forEach(key => {
            if (key.includes("node_modules")) return
            console.log("not a node, remove cache...")
            delete require.cache[key]
        })

        const testpath = scriptpath.replace(/\//g,"\\").replace(/\\/g,"\\\\")
        console.log("CACHE:")
        console.log(Object.keys(require.cache))
        console.log("compare:")
        console.log(testpath)
        console.log(`isCached: ${Object.keys(require.cache).includes(testpath)}`)

        if (fs.existsSync(scriptpath)) {
            var dirpath = `${config.path}${urlpath
                .toLowerCase()
                .substring(0, urlpath.length - url[url.length - 1].length)}`;
            //
            await require(scriptpath)(req, res, page);
            // eval(fs.readFileSync(scriptpath).toString())

            scriptloaded = true;
        } else {
            scriptpath = `${config.path}/${urlpath.toLowerCase()}/index.js`;
            if (urlpath.toLowerCase() == "/")
                scriptpath = `${config.path}/index.js`;
            try {
                //
                await require(scriptpath)(req, res, page);
                // eval(fs.readFileSync(scriptpath).toString())
                scriptloaded = true;
                return;
            } catch (err) {
                try {
                    if (
                        urlpath.toLowerCase() != "/" &&
                        url[0].toLowerCase() != "assets"
                    ) {
                        //
                        await require(scriptpath)(req, res, page);
                        // eval(fs.readFileSync(`${config.path}/${url[0].toLowerCase()}/notfound.js`).toString())
                        scriptloaded = true;
                        return;
                    }
                } catch (err) {}
            }
        }

        if (!scriptloaded) {
            new page.loader({
                res: res,
                req: req,
                title: title,
                templatedir: filepath,
            }).load();
        }
    }

    config.app.get("*", (req, res) => {
        loadQuery(req, res);
    });
};
