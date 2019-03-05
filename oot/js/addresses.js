/**
 * @typedef {{[name: string]: number}} AddressMap
 */
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
		thead.append($("<th>").text(version));
	}
	for (var name of Object.keys(definitions[rootV])) {
		var tr = $("<tr>").append($("<td>").text(name));
		for (var version of Object.keys(definitions)) {
			var value = definitions[version][name];
			if (!value) {
				tr.append($("<td>"))
			} else {
				tr.append($("<td>").text("0x" + value.toString(16).toUpperCase()));
			}
		}
		tbody.append(tr);
	}
	console.log(table);

}
