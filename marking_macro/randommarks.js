(function () {
    var g_markers = [
        "attack1",
        "attack2",
        "bind1",
        "bind2",
        "attack3",
        "attack4",
        "ignore1",
        "ignore2"
    ];

    var g_targets = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
    ];

    function generateMacro(targets, markers) {
        var selected = [];
        var output = [];
        var minlen = targets.length > markers.length ? markers.length : targets.length;
        for (var i = 0; i < minlen; i++) {
            var r = Math.floor(Math.random() * 100) % minlen;
            while (selected.indexOf(r) !== -1) {
                r = Math.floor(Math.random() * 100) % minlen;
            }

            selected.push(r);
            var s = "/mk " + markers[r] + " <" + targets[i] + ">";
            output.push(s);
        }
        var ret = output.join("\n");
        return ret;
    }

    if (typeof module !== "undefined") {
        if (module.exports) {
            console.log(generateMacro(g_targets, g_markers)); // nodejs
        }
    } else {
        window.Generate = {
            generateMacro: generateMacro
        };
    }
})();