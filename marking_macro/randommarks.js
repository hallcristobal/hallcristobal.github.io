(function () {
    function generateMacro(targets, markers) {
        var selectedmk = [];
        var selectedtarg = [];
        var output = [];
        var minlen = Math.min(markers.length, targets.length);
        for (var i = 0; i < minlen; i++) {
            var r = Math.floor(Math.random() * 100) % markers.length;
            while (selectedmk.indexOf(r) !== -1) {
                r = Math.floor(Math.random() * 100) % markers.length;
            }
            var m = Math.floor(Math.random() * 100) % targets.length;
            while (selectedtarg.indexOf(m) !== -1) {
                m = Math.floor(Math.random() * 100) % targets.length;
            }

            selectedmk.push(r);
            selectedtarg.push(m);
            var s = "/mk " + markers[r] + " <" + targets[m] + ">";
            output.push(s);
        }
        var ret = output.join("\n");
        return ret;
    }

    if (typeof module !== "undefined") {
        if (module.exports) {
            var markers = [
                "attack1",
                "attack2",
                "bind1",
                "bind2",
                "attack3",
                "attack4",
                "ignore1",
                "ignore2"
            ];

            var targets = [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
            ];

            console.log(generateMacro(targets, markers)); // nodejs
        }
    } else {
        window.Generate = {
            generateMacro: generateMacro
        };
    }
})();