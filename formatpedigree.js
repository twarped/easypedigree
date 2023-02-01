window.onload = () => {
    var customStateLocalStorage = window.localStorage.getItem("customState");
    window.pedigreeNameActive = false;
    if (customStateLocalStorage != null) {
        console.log(JSON.parse(customStateLocalStorage));
        window.customState = JSON.parse(customStateLocalStorage);
        loadPeople(JSON.parse(customStateLocalStorage));
        setTotalGens();
    }

    menuBarTimer();
    document.body.addEventListener("click", (e) => {
        if (e.target == document.getElementById("pedigree-name")) {
            return;
        } else if (e.target == document.getElementById("pencil")) {
            setPedigreeNameActive();
        } else {
            pedigreeNameActive = false;
        }
    });
    document.onkeydown = (e) => {
        e = e || window.event;
        if (e.key == "Enter") {
            if (pedigreeNameActive) {
                changePedigreeName();
                setPedigreeNameActive();
            }
        }
        if (e.key == "p") {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                printPedigree();
            }
        }
    };    
}

function loadNewPedigree() {
    document.body.querySelectorAll("input[type='file']").forEach((e) => {
        e.remove();
    })
    window.fi = document.createElement("input");

    fi.type = "file";
    fi.accept = "application/json";
    document.getElementById("nav-bar-hidden").appendChild(fi);
    fi.click();
    fi.onchange = () => {
        var file = fi.files[0]

        fi.remove()

        var reader = new FileReader()

        reader.onload = async (e) => {
            window.customState = JSON.parse(e.target.result);
            setPedigreeName(file.name);
            loadPeople(customState);
            setTotalGens();
        }

        reader.onerror = (e) => {
            alert(e.target.error.name)
        }

        reader.readAsText(file)
    }
}



function loadPeople(customState, descRoot = false, doToast = true) {
    window.localStorage.setItem("customState", JSON.stringify(customState));
    document.getElementById("person-container").innerHTML = "";
    document.getElementById("pedigree-name").textContent = customState.name;
    document.getElementById("root-toggle").style.border = "1px solid grey";
    document.getElementById("descroot-toggle").style.border = "";
    document.title = customState.name;
    var rootNamesType = descRoot ? customState.DESCROOTNAMES : customState.ROOTNAMES;
    var rootType = descRoot ? customState.DESCROOT : customState.ROOT;
    var rootNames;
    try {
        rootNames = Object.values(rootNamesType);
        window.oldVersion = false;
    } catch (e) {
        rootNames = false;
        window.oldVersion = true;
        if (doToast) toast("This is an old pedigree file, I can only load the couple ID's, not the names...", 8000);
    }
    var rootAhnentafels = Object.keys(rootType);//.sort(a => a);
    for (var i = 0; i < rootAhnentafels.length; i++) { //for (var i = rootAhnentafels.length - 1; i > -1; i--) { for backwards for-loop
        var ahnentafel = rootAhnentafels[i];
        createPerson(rootNames ? rootNames[ahnentafel] : "Ancestor Couple ID's (husband_wife):", rootType[ahnentafel], oldVersion ? (i + 1) * 2 - 1 : i + 1);
    }
}

function createPerson(name, id, genNumber) {
    var personContainer = document.getElementById("person-container");
    if (personContainer.childElementCount) {
        var spacer = document.createElement("div");
        spacer.className = "bl";
        personContainer.appendChild(spacer);
    }
    var person = document.createElement("div");
    person.className = "person";
    person.innerHTML = `<div class="name-container">
                            <h2><a>`+ name + `</a></h2>
                            <h3 class="id" onclick="copyText(this.textContent)">`+ id + `</h3>
                        </div>
                        <div class="gen">
                            <div>Gen:</div>
                            <div class="gens" style="font-size: 40;">`+ genNumber + `</div>
                        </div>`;
    document.getElementById("person-container").appendChild(person);
}

function copyText(text, customMessage = "Copied text to clipboard") {
    navigator.clipboard.writeText(text);
    toast(customMessage);
}

function toast(text, len = 3000) {
    document.body.querySelectorAll("toast").forEach((e) => e.remove());
    var toast = document.createElement("toast");
    toast.textContent = text;
    toast.style.animation = "fade " + len/1000 + "s";
    toast.addEventListener("click", () => toast.remove());
    document.body.appendChild(toast);
    setTimeout(() => {
        try {
            document.body.removeChild(toast);
        } catch (e) {}
    }, len);
}

function setTotalGens(genNum = 0, descGens = false) {
    var totalGenElem = document.getElementById("total-gens");
    if (genNum) {
        totalGenElem.textContent = genNum;
    } else {
        genNum = Object.values(customState[descGens == true ? "DESCROOT" : "ROOT"]).length;
        if (oldVersion) genNum = genNum * 2 - 1;
        totalGenElem.textContent = genNum;
    }
}

function setPedigreeName(name) {
    window.customState.name = name;
    document.getElementById("pedigree-name").textContent = name;
}

function toggleRootType(e) {
    var otherE = Array.from(e.parentNode.children).filter(el => e != el)[0];
    var isDesc = e.textContent == "DESCROOT";
    try {
        setTotalGens(0, isDesc);
        loadPeople(customState, isDesc, false);
    } catch (e) {
        console.log(e)
    }
    otherE.style = "border: 1px solid white";
    e.style = "border: 1px solid grey;";
}

function savePedigree() {
    var customStateNoName = JSON.parse(JSON.stringify(customState));
    delete customStateNoName.name;
    var a = document.createElement("a");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customStateNoName));
    a.download = customState.name;
    a.click();
}

function setPedigreeNameActive() {
    var pedigreeNameElem = document.getElementById("pedigree-name");
    if (pedigreeNameElem.contentEditable == "true") {
        pedigreeNameActive = true;
    } else {
        pedigreeNameActive = false;
    }
}

function changePedigreeName() {
    var pedigreeNameElem = document.getElementById("pedigree-name");
    if (pedigreeNameElem.contentEditable == ("false" || "inherit")) {
        pedigreeNameActive = true;
        pedigreeNameElem.contentEditable = true;
        pedigreeNameElem.style.boxShadow = "0px 0px 8px grey";
    } else {
        pedigreeNameActive = false;
        pedigreeNameElem.contentEditable = false;
        pedigreeNameElem.style.boxShadow = "";
        pedigreeNameElem.textContent.replace(/\n/g, "");
        if (pedigreeNameElem.textContent.substring(pedigreeNameElem.textContent.length - 5) != ".json") {
            pedigreeNameElem.textContent += ".json";
        }
        customState.name = pedigreeNameElem.textContent;
        setCustomStateLS(customState);
        document.title = customState.name;
    }
}

function printPedigree() {
    var pedigreeWindow = window.open("printpedigree.html");
    pedigreeWindow.window.givenCustomState = customState;
}

function setCustomStateLS(customState = window.customState) {
    window.localStorage.setItem("customState", JSON.stringify(customState))
}
