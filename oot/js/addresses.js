/**
 * @typedef {{[name: string]: {value: number, raw: string}}} AddressMap
 * @typedef {{name: string, addr: string, type: string, raw: string}} DataMap
 */
/**@type string[] */
var versions = [];
/**
 * @param {{[version: string]: AddressMap}} definitions
 */
function buildTable(definitions) {
	var table = $("#address-table");
	var thead = $("thead tr", table);
	var tbody = $("tbody", table);
	var rootV = "";
	for (var version of Object.keys(definitions)) {
		if (!rootV) {
			rootV = version;
		}
		versions.push(version);
		thead.append($("<th>").text(version));
	}
	for (var name of Object.keys(definitions[rootV])) {
		var tr = $("<tr>").append($("<td>").text(name));
		for (var version of versions) {
			var value = definitions[version][name].value;
			var td = $("<td>");
			var span = $("<span>").attr("tabindex", "0");
			span.popover({
				container: "body",
				toggle: "popover",
				placement: "top",
				title: name,
				html: true,
				content: definitions[version][name].raw,
				trigger: "focus",
			});
			if (!value) {
			} else {
				span.text("0x" + value.toString(16).toUpperCase());
			}
			tr.append(td.append(span));
		}
		tbody.append(tr);
	}
}
/**
 * @param {DataMap[]} types
 */
function buildTypesTable(types) {

	/**@param {string} addrString @param {string} version*/
	function resolveOffset(addrString, version) {
		try {
			var symbolLoc = addrString.indexOf("+");
			var name = addrString.substring(0, symbolLoc).trim();
			var hex = addrString.substring(symbolLoc + 1);
			hex = hex.replace("0x", "").trim();
			var offset = parseInt(hex, 16);
			var base = gDefinitions[version][name].value;
			return base + offset;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	var table = $("#types-table");
	var thead = $("thead tr", table);
	var tbody = $("tbody", table);
	thead.append($("<th>").text("Type"));
	for (var version of versions) {
		thead.append($("<th>").text(version));
	}
	for (var data of types) {
		var tr = $("<tr>").append($("<td>").text(data.name));
		tr.append($("<td>").text(data.type));
		for (var version of versions) {
			var value = null;
			if(gDefinitions[version][data.addr]) {
				value = gDefinitions[version][data.addr].value;
			}
			var td = $("<td>");
			var span = $("<span>").attr("tabindex", "0");
			span.popover({
				container: "body",
				toggle: "popover",
				placement: "top",
				title: data.name,
				html: true,
				content: data.raw,
				trigger: "focus",
			});
			if (!value) {
				var val = resolveOffset(data.addr, version);
				if (val) {
					span.text("0x" + val.toString(16).toUpperCase());
				} else {
					span.text("Error");
				}
			} else {
				span.text("0x" + value.toString(16).toUpperCase());
			}
			tr.append(td.append(span));
		}
		tbody.append(tr);
	}
}
