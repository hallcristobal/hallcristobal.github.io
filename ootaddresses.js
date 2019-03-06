const https = require("https");
const fs = require("fs");
const gDefinitions = {};
const gData = [];

function get_header_file(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let body = "";
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve(body);
            });
            res.on('error', (e) => {
                console.error(e);
                reject(e);
            })
        });
    });
}

/**
 * @param {string} definitions
 * @returns {{[key: string]: number}}
 */
function getDefinitions(definitions) {
    const defs = definitions.split('\n');
    const obj = {};
    for (const definition of defs) {
        if (!definition) {
            continue;
        }
        let split = definition.split(/\s{1,}/);
        if (split.length !== 3) {
            console.warn("invalid count", definition, split);
        } else {
            const name = split[1].trim();
            obj[name] = {};
            obj[name].value = parseInt(split[2].substring(2), 16);
            obj[name].raw = definition.trim();
        }
    }
    return obj;
}

/**@param {string} definitions */
function splitVersions(definitions) {
    /**@type string */
    const getVersion = (str) => str.substring(str.search(/Z64_OOT/));
    let firstLineBreak = definitions.search("\n");
    let endIndex = definitions.search(/\#elif/);
    if (!endIndex) {
        endIndex = null;
    }

    let z64Version = getVersion(definitions.substring(0, firstLineBreak));
    if (z64Version.endsWith("10")) {
        return {
            version: "10",
            definitions: getDefinitions(endIndex != null ? definitions.substring(firstLineBreak + 1, endIndex) : definitions.substring(firstLineBreak + 1)),
            startIndex: endIndex,
        };
    } else if (z64Version.endsWith("11")) {
        return {
            version: "11",
            definitions: getDefinitions(endIndex != null ? definitions.substring(firstLineBreak + 1, endIndex) : definitions.substring(firstLineBreak + 1)),
            startIndex: endIndex,
        };
    } else if (z64Version.endsWith("12")) {
        return {
            version: "12",
            definitions: getDefinitions(endIndex != null ? definitions.substring(firstLineBreak + 1, endIndex) : definitions.substring(firstLineBreak + 1)),
            startIndex: endIndex,
        };
    } else {
        return null;
    }

}

/**@param {string} definitions */
function parseDataDefinitions(definitions) {
    let tsplit = definitions.split('\n');
    /**@type string[] */
    let corrected = [];
    let s = false;

    let tmp = "";
    for (let line of tsplit) {
        if (s) {
            tmp += " " + line.trim();
        } else {
            tmp = line;
        }

        if (tmp.endsWith("\\")) {
            tmp = tmp.replace("\\", "").trim();
            s = true;
        } else {
            s = false;
        }

        if (s) {
        } else {
            corrected.push(tmp.trim());
            tmp = "";
        }
    }
    for (let definition of corrected) {
        const def = {};
        def.raw = definition.replace(/[\s|\t]+/g, " ");
        definition = definition.replace("#define", "").replace(/(\s|\t)/g, "");
        const start = definition.indexOf("(");
        const name = definition.substring(0, start);
        const declaration = definition.substring(start + 1, definition.length - 1);
        def.name = name;
        let definitionSearch = /z64[a-zA-Z\_]*addr/.exec(declaration);
        if (!definitionSearch) {
            console.warn("nothing found: ", definition);
            continue;
        }
        def.addr = declaration.substring(definitionSearch.index).replace(")", "");
        let type = declaration.substring(0, definitionSearch.index);
        if (type.endsWith("(")) {
            type = type.substr(0, type.length - 1);
        }
        def.type = type;
        gData.push(def);
    }
}

/**@param {string} raw */
function processData(raw) {
    const regex = /\s*\/\*\s*(data|functions|function\s*prototypes)\s*\*\//;
    const dataStart = /\s*\/\*\s*data\s*\*\//.exec(raw);//raw.search(/\/\*\s*data\s*\*\//);
    if (!dataStart) {
        return;
    }
    let header = raw.substring(dataStart.index);
    header = header.substring(header.search(/\*\//) + 3);
    const dataEnd = regex.exec(header);
    if (!dataEnd) {
        return;
    }
    header = header.substring(0, dataEnd.index);
    parseDataDefinitions(header);
    if (typeof window === "object" && window && window.buildTypesTable) {
        window.buildTypesTable(gData);
    }
}

/**@parm {string} header */
function processDefinitions(header) {
    const definitions = (raw => {
        const definitions_start = raw.search(/\#if\s*Z64_VERSION/);
        raw = raw.substring(definitions_start);
        const definitions_end = raw.search(/\#endif/);
        raw = raw.substring(0, definitions_end);
        return raw;
    })(header);
    let versionData = splitVersions(definitions);
    let startIndex = 0;
    while (versionData && versionData.startIndex != null) {
        gDefinitions[versionData.version] = versionData.definitions;
        startIndex += versionData.startIndex;
        versionData = splitVersions(definitions.substring(startIndex + "#elif".length));
    }
    gDefinitions[versionData.version] = versionData.definitions;

    // look for one way definitions
    for (const version of Object.keys(gDefinitions)) {
        for (const other_version of Object.keys(gDefinitions)) {
            if (other_version === version) {
                continue;
            }
            for (const name of Object.keys(gDefinitions[version])) {
                if (!gDefinitions[other_version][name]) {
                    gDefinitions[other_version][name] = null;
                    console.log("set null", other_version, name);
                }
            }
        }
    }
    if (typeof window === "object" && window && window.buildTable) {
        window.buildTable(gDefinitions);
    }
}

/**@param {string} url */
function run(url) {
    get_header_file(url).then(
        /**@param {string} header */
        header => {
            processDefinitions(header);
            processData(header);
            // fs.writeFileSync("data.json", Buffer.from(JSON.stringify(gData, null, 2)));
        }).catch(err => console.error(err));
}
run("https://raw.githubusercontent.com/glankk/gz/master/src/gz/z64.h");

function storeGlobaly(global) {
    if (typeof global === "object" && global && !global.run) {
        global.run = run;
        global.gDefinitions = gDefinitions;
        global.gData = gData;
    }
}
if (typeof window !== "undefined") {
    storeGlobaly(window);
}
if (typeof global !== "undefined") {
    storeGlobaly(global);
}
