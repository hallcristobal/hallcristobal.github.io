(function () {
    var cbAttack1 = document.getElementById("cbAttack1");
    var cbAttack2 = document.getElementById("cbAttack2");
    var cbAttack3 = document.getElementById("cbAttack3");
    var cbAttack4 = document.getElementById("cbAttack4");
    var cbAttack5 = document.getElementById("cbAttack5");
    var cbAttack6 = document.getElementById("cbAttack6");
    var cbAttack7 = document.getElementById("cbAttack7");
    var cbAttack8 = document.getElementById("cbAttack8");

    var cbBind1 = document.getElementById("cbBind1");
    var cbBind2 = document.getElementById("cbBind2");
    var cbBind3 = document.getElementById("cbBind3");
    var cbIgnore1 = document.getElementById("cbIgnore1");
    var cbIgnore2 = document.getElementById("cbIgnore2");
    var cbSquare = document.getElementById("cbSquare");
    var cbCircle = document.getElementById("cbCircle");
    var cbCross = document.getElementById("cbCross");
    var cbTriangle = document.getElementById("cbTriangle");

    var player1 = document.getElementById("player1");
    var player2 = document.getElementById("player2");
    var player3 = document.getElementById("player3");
    var player4 = document.getElementById("player4");
    var player5 = document.getElementById("player5");
    var player6 = document.getElementById("player6");
    var player7 = document.getElementById("player7");
    var player8 = document.getElementById("player8");
    var pet = document.getElementById("pet");
    var focusTarget = document.getElementById("focusTarget");
    var target = document.getElementById("target");

    var generateButton = document.getElementById("generateButton");
    var textAreaOutput = document.getElementById("textAreaOutput");

    var Generate = window.Generate;

    var STORAGE_KEY = "GENERATE_MARK_KEY";

    function generate() {
        var markers = [];
        var targets = [];

        if (cbAttack1.checked) markers.push("attack1");
        if (cbAttack2.checked) markers.push("attack2");
        if (cbAttack3.checked) markers.push("attack3");
        if (cbAttack4.checked) markers.push("attack4");
        if (cbAttack5.checked) markers.push("attack5");
        if (cbAttack6.checked) markers.push("attack6");
        if (cbAttack7.checked) markers.push("attack7");
        if (cbAttack8.checked) markers.push("attack8");
        if (cbBind1.checked) markers.push("bind1");
        if (cbBind2.checked) markers.push("bind2");
        if (cbBind3.checked) markers.push("bind3");
        if (cbIgnore1.checked) markers.push("ignore1");
        if (cbIgnore2.checked) markers.push("ignore2");
        if (cbSquare.checked) markers.push("square");
        if (cbCircle.checked) markers.push("circle");
        if (cbCross.checked) markers.push("cross");
        if (cbTriangle.checked) markers.push("triangle");

        if (player1.checked) targets.push("1");
        if (player2.checked) targets.push("2");
        if (player3.checked) targets.push("3");
        if (player4.checked) targets.push("4");
        if (player5.checked) targets.push("5");
        if (player6.checked) targets.push("6");
        if (player7.checked) targets.push("7");
        if (player8.checked) targets.push("8");
        if (pet.checked) targets.push("pet");
        if (focusTarget.checked) targets.push("f");
        if (target.checked) targets.push("t");

        var macro = Generate.generateMacro(targets, markers);
        textAreaOutput.value = macro;
    }

    function saveSelections() {
        if (!window.Storage)
            return;

        var selected = [];
        if (cbAttack1.checked) selected.push("attack1");
        if (cbAttack2.checked) selected.push("attack2");
        if (cbAttack3.checked) selected.push("attack3");
        if (cbAttack4.checked) selected.push("attack4");
        if (cbAttack5.checked) selected.push("attack5");
        if (cbAttack6.checked) selected.push("attack6");
        if (cbAttack7.checked) selected.push("attack7");
        if (cbAttack8.checked) selected.push("attack8");
        if (cbBind1.checked) selected.push("bind1");
        if (cbBind2.checked) selected.push("bind2");
        if (cbBind3.checked) selected.push("bind3");
        if (cbIgnore1.checked) selected.push("ignore1");
        if (cbIgnore2.checked) selected.push("ignore2");
        if (cbSquare.checked) selected.push("square");
        if (cbCircle.checked) selected.push("circle");
        if (cbCross.checked) selected.push("cross");
        if (cbTriangle.checked) selected.push("triangle");

        if (player1.checked) selected.push("player1");
        if (player2.checked) selected.push("player2");
        if (player3.checked) selected.push("player3");
        if (player4.checked) selected.push("player4");
        if (player5.checked) selected.push("player5");
        if (player6.checked) selected.push("player6");
        if (player7.checked) selected.push("player7");
        if (player8.checked) selected.push("player8");
        if (pet.checked) selected.push("pet");
        if (focusTarget.checked) selected.push("focusTarget");
        if (target.checked) selected.push("target");

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    }

    function loadSelections() {
        if (!window.Storage)
            return;
        var selected = window.localStorage.getItem(STORAGE_KEY);
        if (!selected)
            return;

        try {
            selected = JSON.parse(selected);
        } catch (e) {
            console.error(e);
            return;
        }

        if (selected.indexOf("attack1") > -1) cbAttack1.checked = true;
        if (selected.indexOf("attack2") > -1) cbAttack2.checked = true;
        if (selected.indexOf("attack3") > -1) cbAttack3.checked = true;
        if (selected.indexOf("attack4") > -1) cbAttack4.checked = true;
        if (selected.indexOf("attack5") > -1) cbAttack5.checked = true;
        if (selected.indexOf("attack6") > -1) cbAttack6.checked = true;
        if (selected.indexOf("attack7") > -1) cbAttack7.checked = true;
        if (selected.indexOf("attack8") > -1) cbAttack8.checked = true;
        if (selected.indexOf("bind1") > -1) cbBind1.checked = true;
        if (selected.indexOf("bind2") > -1) cbBind2.checked = true;
        if (selected.indexOf("bind3") > -1) cbBind3.checked = true;
        if (selected.indexOf("ignore1") > -1) cbIgnore1.checked = true;
        if (selected.indexOf("ignore2") > -1) cbIgnore2.checked = true;
        if (selected.indexOf("square") > -1) cbSquare.checked = true;
        if (selected.indexOf("circle") > -1) cbCircle.checked = true;
        if (selected.indexOf("cross") > -1) cbCross.checked = true;
        if (selected.indexOf("triangle") > -1) cbTriangle.checked = true;

        if (selected.indexOf("player1") > -1) player1.checked = true;
        if (selected.indexOf("player2") > -1) player2.checked = true;
        if (selected.indexOf("player3") > -1) player3.checked = true;
        if (selected.indexOf("player4") > -1) player4.checked = true;
        if (selected.indexOf("player5") > -1) player5.checked = true;
        if (selected.indexOf("player6") > -1) player6.checked = true;
        if (selected.indexOf("player7") > -1) player7.checked = true;
        if (selected.indexOf("player8") > -1) player8.checked = true;
        if (selected.indexOf("pet") > -1) pet.checked = true;
        if (selected.indexOf("focusTarget") > -1) focusTarget.checked = true;
        if (selected.indexOf("target") > -1) target.checked = true;
    }

    generateButton.onclick = function () { generate(); }
    loadSelections();

    cbAttack1.onchange = function () { saveSelections(); }
    cbAttack2.onchange = function () { saveSelections(); }
    cbAttack3.onchange = function () { saveSelections(); }
    cbAttack4.onchange = function () { saveSelections(); }
    cbAttack5.onchange = function () { saveSelections(); }
    cbAttack6.onchange = function () { saveSelections(); }
    cbAttack7.onchange = function () { saveSelections(); }
    cbAttack8.onchange = function () { saveSelections(); }
    cbBind1.onchange = function () { saveSelections(); }
    cbBind2.onchange = function () { saveSelections(); }
    cbBind3.onchange = function () { saveSelections(); }
    cbIgnore1.onchange = function () { saveSelections(); }
    cbIgnore2.onchange = function () { saveSelections(); }
    cbSquare.onchange = function () { saveSelections(); }
    cbCircle.onchange = function () { saveSelections(); }
    cbCross.onchange = function () { saveSelections(); }
    cbTriangle.onchange = function () { saveSelections(); }
    player1.onchange = function () { saveSelections(); }
    player2.onchange = function () { saveSelections(); }
    player3.onchange = function () { saveSelections(); }
    player4.onchange = function () { saveSelections(); }
    player5.onchange = function () { saveSelections(); }
    player6.onchange = function () { saveSelections(); }
    player7.onchange = function () { saveSelections(); }
    player8.onchange = function () { saveSelections(); }
    pet.onchange = function () { saveSelections(); }
    focusTarget.onchange = function () { saveSelections(); }
    target.onchange = function () { saveSelections(); }
})();