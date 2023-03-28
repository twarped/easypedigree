// version 2.0 code

window.onload = () => {
    window.isDesc = false;

    window.navCallback = (ms) => {
        for (const m of ms) {
            var height = m.contentRect.height;
            document.getElementById("couple-container").style.height = `calc(100% - ${height + 30}px)`;
            document.getElementById("nav-bar-hidden").style.height = `${height}px`;
            document.getElementById("menu-bar").style.top = `${height}px`;
        }
    }

    window.navObserver = new ResizeObserver(navCallback);
    navObserver.observe(document.getElementById("nav-bar"));

    var customStateLocalStorage = window.localStorage.getItem("customState");
    var customHistoryLocalStorage = window.localStorage.getItem("coupleHistory");
    window.pedigreeNameActive = false;
    if (customStateLocalStorage != null) {
        window.customState = JSON.parse(customStateLocalStorage);
        console.log(customState);
        loadPeople(customState);
        setTotalGens();
    }
    // if (customHistoryLocalStorage != null) {
    //     window.customHistory = JSON.parse(customHistoryLocalStorage);
    //     console.log(customHistory);
    // } else {
    //     window.customHistory = [];
    // }

    menuBarTimer();
    document.addEventListener("click", (e) => {
        document.body.querySelectorAll("[data-is-active]").forEach(e => {
            delete e.dataset.isActive;
        })
        if ((e.target.className != "" && e.target.className != null) || (e.target.id != "" && e.target.id != null)) e.target.dataset.isActive = true;
    });
    document.addEventListener("dblclick", (e) => {
        if ((e.target.className != "" && e.target.className != null) || (e.target.id != "" && e.target.id != null)) changePedigreeName();
    });
    document.onkeydown = (e) => {
        e = e || window.event;
        if (e.key == "Enter") {
            changePedigreeName();
        }
        if (e.key == "p") {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                printPedigree();
            }
        }
    };

    var scrollHeightCallback = () => {
        window.scrollTo(0, 0);
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            })
        }, 1000);
        scrollHeightObserver.disconnect();
    }
    var scrollHeightObserver = new MutationObserver(scrollHeightCallback);
    scrollHeightObserver.observe(document.getElementById("couple-container"), {
        attributes: true,
        subtree: true,
        childList: true
    });
}

function loadNewPedigree() {
    window.fi = document.createElement("input");

    fi.type = "file";
    fi.accept = ".json,.fsped";
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
            document.body.querySelectorAll("input[type='file']").forEach((e) => {
                e.remove();
            })
        }

        reader.onerror = (e) => {
            alert(e.target.error.name)
        }

        reader.readAsText(file)
    }
}



function loadPeople(customState, descRoot = false, doToast = true) {
    window.localStorage.setItem("customState", JSON.stringify(customState));
    document.getElementById("couple-container").innerHTML = "";
    document.getElementById("pedigree-name").textContent = customState.name;
    document.getElementById("root-toggle").style.border = "1px solid grey";
    document.getElementById("descroot-toggle").style.border = "";
    document.title = customState.name;
    var peopleData = descRoot ? customState.DESC_PEOPLE_DATA : customState.ROOT_PEOPLE_DATA;
    if (descRoot) {
        createCouple(customState.ROOT_PEOPLE_DATA[0].husband, customState.ROOT_PEOPLE_DATA[0].wife, customState.ROOT_PEOPLE_DATA[0].coupleId)
        for (var i = 0; i < Object.keys(peopleData).length; i++) {
            createCouple(peopleData[i].husband, peopleData[i].wife, peopleData[i].coupleId, descRoot);
        }
    } else {
        for (var i = Object.keys(peopleData).length - 1; i > -1; i--) { //var i = 0; i < Object.keys(peopleData).length; i++
            createCouple(peopleData[i].husband, peopleData[i].wife, peopleData[i].coupleId, descRoot);
        }
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        })
    }, 1000);
}

function createCouple(husband, wife, coupleId, isDesc = false) {
    var peopleData = coupleId.includes("desc") ? customState.DESC_PEOPLE_DATA : customState.ROOT_PEOPLE_DATA;
    var coupleIds = peopleData.map(e => e.coupleId);
    var nextCoupleId = coupleIds[coupleIds.indexOf(coupleId) + 1] != undefined ? coupleIds[coupleIds.indexOf(coupleId) + 1] : false;
    var coupleContainer = document.getElementById("couple-container");
    var couple = document.createElement("div");
    //console.log(coupleIds[coupleIds.indexOf(coupleId) + 1])
    var isWife = nextCoupleId ? parseInt((nextCoupleId).split(".")[1]) % 2 != 0 : undefined;
    var isFirst = isWife == undefined;
    var isSecond = coupleIds[coupleIds.indexOf(coupleId) + 2] == undefined;
    var isLast = coupleIds[coupleIds.indexOf(coupleId) - 1] == undefined;
    var genNum = Math.floor(parseInt(coupleId.split("-")[2])) + (isDesc ? 2 : 1);
    if (coupleContainer.childElementCount) {
        var selectorSpacer = document.createElement("div");
        selectorSpacer.className = "bl " + (isWife ? "wife" : "husband") /* + (isSecond ? " center" : "")*/ ;
        selectorSpacer.textContent = "";
        coupleContainer.appendChild(selectorSpacer);
    }
    couple.dataset.coupleId = coupleId;
    couple.className = "couple " + (isWife ? "" : "right ") /*(!isFirst ? (isWife ? "" : "right ") : "two-column ")*/ //+ (isFirst ? "top" : "");
    couple.innerHTML = `
        <div class="husband">
            <h4 class="ancestor-name"><a title="${husband.name == "ADD SPOUSE" ? `No Spouse` : husband.name}" ${husband.id ? `href="https://www.familysearch.org/tree/person/${husband.id}" target="_blank" onclick="toast('That person might not exist anymore, it\\\'s a common occurance.', 5000)"` : ""}>${husband.name == "ADD SPOUSE" ? "No Spouse" : husband.name}</a></h4>
            <h5 class="id"><a ${husband.id ? `href="javascript:copyText('${husband.id}')"` : ""}>${husband.id ? husband.id : "none"}</a></h5>
            ${/*(isFirst || isLast) && !isWife ? `<div class="star"></div>` : ``*/""}
        </div> 
        ${`<div class="bl c"></div>` /*!nextCoupleId ? `<div class="gens inline">${genNum}</div>` : `<div class="bl c"></div>`*/}
        <div class="wife ${/*isFirst ? "inline" : ""*/ ""}">
            <h4 class="ancestor-name"><a title="${wife.name == "ADD SPOUSE" ? `No Spouse` : wife.name}" ${wife.id ? `href="https://www.familysearch.org/tree/person/${wife.id}" target="_blank" onclick="toast('That person might not exist anymore, it\\\'s a common occurance.', 5000)"` : ""}>${wife.name == "ADD SPOUSE" ? "No Spouse" : wife.name}</a></h4>
            <h5 class="id"><a ${wife.id ? `href="javascript:copyText('${wife.id}')"` : ""}>${wife.id ? wife.id : "none"}</a></h5>
            ${/*(isFirst || isLast) && isWife ? `<div class="star"></div>` : ``*/""}
        </div>
        `;
    document.getElementById("couple-container").appendChild(couple);
    var gen = document.createElement("div");
    gen.className = "gens"
    gen.textContent = genNum;
    document.getElementById("couple-container").appendChild(gen);
}

function copyText(text, customMessage = "Copied text to clipboard") {
    navigator.clipboard.writeText(text);
    toast(customMessage);
}

function toast(text, len = 3000) {
    document.body.querySelectorAll("toast").forEach((e) => e.remove());
    var toast = document.createElement("toast");
    toast.textContent = text;
    toast.style.animation = "fade " + len / 1000 + "s";
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
        genNum = Object.values(customState[descGens == true ? "DESC_PEOPLE_DATA" : "ROOT_PEOPLE_DATA"]).length;
        totalGenElem.textContent = genNum;
    }
}

function setPedigreeName(name) {
    window.customState.name = name;
    document.getElementById("pedigree-name").textContent = name;
}

function toggleRootType(e) {
    var otherE = Array.from(e.parentNode.children).filter(el => e != el)[0];
    window.isDesc = e.textContent == "DESCROOT";
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

function changePedigreeName() {
    var pedigreeNameElem;
    var couple;
    var isAncestorName;
    var isPedigreeName;
    var isID;
    var peopleData;
    var genNum;
    var action;

    try {
        pedigreeNameElem = document.body.querySelector("[data-is-active='true']");
        couple = pedigreeNameElem.parentNode.parentNode;
        isAncestorName = pedigreeNameElem.className.includes("ancestor-name");
        isPedigreeName = pedigreeNameElem.id == "pencil" || pedigreeNameElem.id == "pedigree-name";
        isID = pedigreeNameElem.className.includes("id");
        peopleData = isDesc ? customState.DESC_PEOPLE_DATA : customState.ROOT_PEOPLE_DATA;
    } catch (error) {
        return;
    }

    if (!isAncestorName && !isPedigreeName && !isID) return;

    var spouse = pedigreeNameElem.parentNode.className.includes("wife") ? "wife" : "husband";
    var peopleDataType = isDesc ? "DESC_PEOPLE_DATA" : "ROOT_PEOPLE_DATA";
    var text = pedigreeNameElem.textContent;

    if ((pedigreeNameElem.contentEditable == "false" || pedigreeNameElem.contentEditable == "inherit") && isPedigreeName) {
        pedigreeNameActive = true;
        pedigreeNameElem.contentEditable = true;
        pedigreeNameElem.style.boxShadow = "0px 0px 8px grey";
        pedigreeNameElem.style.borderRadius = "5px";
        console.log(couple.dataset.coupleId);
        // if (isPedigreeName) {
        //     window.lastAction = {
        //         customStatePath: ["name"],
        //         change: text
        //     }
        // } else if (isAncestorName) {
        //     genNum = Math.floor(parseInt(couple.dataset.coupleId.split("-")[2]));
        //     window.lastAction = {
        //         customStatePath: [peopleDataType, genNum, spouse, "name"],
        //         change: text
        //     }
        // } else if (isID) {
        //     window.lastAction = {
        //         customStatePath: [peopleDataType, genNum, spouse, "id"],
        //         change: text
        //     }
        // }
    } else if (isPedigreeName) {
        pedigreeNameActive = false;
        pedigreeNameElem.contentEditable = false;
        pedigreeNameElem.style.boxShadow = "";
        pedigreeNameElem.textContent.replace(/\n/g, "");
        if (isPedigreeName) {
            if (text.substring(text.length - 6) != ".fsped") {
                pedigreeNameElem.textContent += ".fsped";
                customState.name = text;
            }
            // action = {
            //     customStatePath: ["name"],
            //     change: text
            // }
        } else {
            genNum = Math.floor(parseInt(couple.dataset.coupleId.split("-")[2]));
            if (isAncestorName) {
                peopleData[genNum][spouse].name = text;
                // action = {
                //     customStatePath: [peopleDataType, genNum, spouse, "name"],
                //     change: text
                // };
            } else if (isID) {
                peopleData[genNum][spouse].id = text;
                // action = {
                //     customStatePath: [peopleDataType, genNum, spouse, "id"],
                //     change: text
                // }
            }
        }
        setCustomStateLS(customState);
        document.title = customState.name;
        addActionToHistory(action, window.lastAction);
    }
    // console.log(customHistory);
}

// function addActionToHistory(after, before) {
//     if (JSON.stringify(after) == JSON.stringify(before) || after == undefined || before == undefined) return;
//     customHistory.push({
//         before: before,
//         after: after,
//     })
// }

function printPedigree() {
    window.print();
    // var pedigreeWindow = window.open("/printpedigree.html");
    // pedigreeWindow.window.givenCustomState = customState;
}

function setCustomStateLS(customState = window.customState) {
    window.localStorage.setItem("customState", JSON.stringify(customState))
}
