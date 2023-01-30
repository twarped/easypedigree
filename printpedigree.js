window.onload = () => {
    try {
        window.localStorage.setItem("customState", JSON.stringify(givenCustomState));
    } catch (e) {};
    window.customState = JSON.parse(window.localStorage.getItem("customState"));
    loadPeople(customState);
    loadPeople(customState, true, false);
    window.print();
    window.onfocus = function() { 
        window.close();
    };
}

function loadPeople(customState, descRoot = false, newContainer = true) {
    window.localStorage.setItem("customState", JSON.stringify(customState));
    document.getElementById("pedigree-name").textContent = customState.name;
    if (newContainer) document.getElementById("person-container").innerHTML = "";
    document.title = customState.name;
    var rootNamesType = descRoot ? customState.DESCROOTNAMES : customState.ROOTNAMES;
    var rootType = descRoot ? customState.DESCROOT : customState.ROOT;
    var rootNames;
    try {
        rootNames = Object.keys(rootNamesType);
        window.oldVersion = false;
    } catch (e) {
        rootNames = false;
        window.oldVersion = true;
    }
    var rootAhnentafels = Object.keys(rootType).sort(e => e);
    if (descRoot) {
        for (var i = 1; i < rootAhnentafels.length; i++) { //for (var i = rootAhnentafels.length - 1; i > -1; i--) { for backwards for-loop
            var o = rootAhnentafels[i];
            createPerson(rootNames ? rootNames[o] : "Ancestor Couple ID's (husband_wife):", rootType[o], oldVersion ? (i + 1) * 2 - 1 : i + 1, descRoot);
        }
    } else {
        for (var i = rootAhnentafels.length - 1; i > 0; i--) { //for (var i = rootAhnentafels.length - 1; i > -1; i--) { for backwards for-loop
            var o = rootAhnentafels[i];
            createPerson(rootNames ? rootNames[o] : "Ancestor Couple ID's (husband_wife):", rootType[o], oldVersion ? (i + 1) * 2 - 1 : i + 1, descRoot);
        }
    }
    if (!descRoot) createPerson(rootNames ? rootNames[0] : "Ancestor Couple ID's (husband_wife):", rootType[1], 1, descRoot, true);
}

function createPerson(name, id, genNumber, descRoot = false, main = false) {
    // var personContainer = document.getElementById("person-container");
    // if (personContainer.childElementCount) {
    //     var spacer = document.createElement("div");
    //     spacer.className = "bl"
    //     personContainer.appendChild(spacer);
    // }
    var person = document.createElement("div");
    person.className = "person";
    if (main) person.id = "main";
    person.style = "box-shadow: 0 0 0; margin-bottom: 30px;"
    person.innerHTML = `<div class="name-container">
                            <h2><a>`+ name + `</a></h2>
                            <h3 class="id" style="cursor: default">`+ id + `</h3>
                        </div>
                        <div class="gen">
                            <div>Gen:</div>
                            <div class="gens" style="font-size: 40;">`+ (descRoot ? "-" : "") + genNumber + `</div>
                        </div>`;
    document.getElementById("person-container").appendChild(person);
}