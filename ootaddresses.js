const https = require("https");

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
			obj[name] = parseInt(split[2].substring(2), 16);
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

const gDefinitions = {};
/**@param {string} url */
function run(url) {
	get_header_file(url).then(header => {
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
			for(const other_version of Object.keys(gDefinitions)) {
				if(other_version === version) {
					continue;
				}
				for(const name of Object.keys(gDefinitions[version])) {
					if(!gDefinitions[other_version][name]) {
						gDefinitions[other_version][name] = null;
						console.log("set null", other_version, name);
					}
				}
			}
		}

	}).catch(err => console.error(err));
}
run("https://raw.githubusercontent.com/glankk/gz/master/src/gz/z64.h");

if(window && !window.run) {
	window.run = run;
	window.gDefinitions = gDefinitions;
}
