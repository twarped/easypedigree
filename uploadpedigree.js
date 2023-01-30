window.expandButtons = [];
window.expandButtonsCoupleId = [];
document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree").shadowRoot.querySelectorAll("#pedigree > div:nth-child(1) > pedigree-couple-renderer").forEach(e => {
    var expandButton = e.shadowRoot.querySelector("div.couple-wrapper.show-marriages.show-portraits.daybreak > button");
    if (expandButton != null) {
        window.expandButtons.push(expandButton);
        window.expandButtonsCoupleId.push(expandButton.offsetParent.coupleId.slice(0, -2));
    }
})

var fi = document.createElement("input")

fi.type = "file"

fi.accept = "application/json"

document.body.appendChild(fi)

fi.click()

fi.onchange = () => {

    var file = fi.files[0]

    fi.remove()

    var reader = new FileReader()

    reader.onload = async (e) => {
        window.customState = JSON.parse(e.target.result);
        window.usedCustomState = window.customState;
        for (var i = 0; i < window.usedCustomState.length; i++) {
            await expandCouple(window.usedCustomState[i]);
            window.usedCustomState[i].splice(i, 1);
        }
        console.log(window.customState);
        console.log(window.usedCustomState);
    }

    reader.onerror = (e) => {
        alert(e.target.error.name)
    }

    reader.readAsText(file)
}

window.expandCouple = (coupleId) => {
    var expandButton = window.expandButtons[window.expandButtonsCoupleId.indexOf(coupleId)];
    if (expandButton.title.includes("Expand")) {    
        expandButton.click();
    }
    return new Promise(resolve => {
        if (expandButton.title.includes("Expand")) {
            return resolve(coupleId);
        }

        const observer = new MutationObserver(mutations => {
            if (expandButton.title.includes("Expand")) {
                resolve(coupleId);
                observer.disconnect();
            }
        });

        observer.observe(expandButton);
    });
}





(() => {

    var fi = document.createElement("input")

    fi.type = "file"

    fi.accept = "application/json"

    document.body.appendChild(fi)

    fi.click()

    fi.onchange = () => {

        var file = fi.files[0]

        fi.remove()

        var reader = new FileReader()

        reader.onload = (e) => {

            var customState = JSON.parse(e.target.result)

            var cpw = window.open(window.location.href.substring(0, 43) + "portrait/" + customState.ROOT[1].substring(0, 8))

            var cpse = cpw.document.createElement("script")

            cpse.innerHTML = `

                window.customState = ${JSON.stringify(customState)}

                async function setPosAndZoom() {

                    fsPedigree.pedigreeClass.getZoom().then(zoom => {

                        if (zoom > 0.065) {

                            fsPedigree.pedigreeClass.pedigreeEl

                                .transition()

                                .duration(1)

                                .call(fsPedigree.pedigreeClass.zoom.scaleBy, .2);

                            console.log(zoom)

                            fsPedigree.pedigreeClass.centerInit()

                        } else {

                            clearInterval(setPosInterval)

                        }

                    })

                }

                window.customPedigree = async () => {

                    clearInterval(setPosInterval)

                    var state = __state__.getState().pedigree

                    var pof = customState.ROOT[1].substring(0, 8)

                    FS.cache.stores.expandedDescPidsLandscape.getItem(pof).then(desc => FS.cache.stores.expandedDescPidsLandscape.setItem(pof, {1:pof}))

                    FS.cache.stores.expandedPidsLandscape.getItem(pof).then(p => FS.cache.stores.expandedPidsLandscape.setItem(pof, {1:pof}))

                    checkRoot();

                    checkDescRoot();

                    setTimeout(() => { window.setPosInterval = setInterval(setPosAndZoom, 1000) }, 50)

                }

                function doRoot(pedigreeRootPids) {

                    var state = __state__.getState()

                    console.log("doRoot: ");

                    console.log(pedigreeRootPids)

                    if (!Array.isArray(pedigreeRootPids) && pedigreeRootPids) {

                        var rootPids = Object.keys(pedigreeRootPids)

                            .filter(function(ahnentafel) {

                                return ahnentafel.toString() !== '1' || Object.keys(descPedigreeRootPids).length < 2;

                            })

                            .sort(function(a, b) {

                                return parseInt(a, 10) > parseInt(b, 10);

                            });

    

                        for (var coupleAhnentafel in rootPids) {

                            fsPedigree.dispatch(__actions__.pedigree.appendPedigree(pedigreeRootPids[coupleAhnentafel], __actions__.pedigree.getDepth(coupleAhnentafel), state.pedigree.config.gens, state.prefs.showPortraits, state.prefs.showMarriages, state.prefs.showDataQualityIssues, state.prefs.showRecordHints, state.prefs.showResearchSuggestions, state.prefs.showTempleOpportunities, state.prefs.showOrdinances, false, coupleAhnentafel));

                            console.log(coupleAhnentafel, " = ", rootPids[coupleAhnentafel], " : ", pedigreeRootPids[rootPids[coupleAhnentafel]]);

                        };

                    }

                }

                function doDescRoot(descPedigreeRootPids) {

                    var state = __state__.getState();

                    console.log("doDescRoot: ")

                    console.log(descPedigreeRootPids)

                    if (!Array.isArray(descPedigreeRootPids) && descPedigreeRootPids) {

                        var descRootPIDs = Object.keys(descPedigreeRootPids)

                            .filter(ahnentafel => ahnentafel.toString() !== '1')

                            .sort(function(a, b) {

                                return a.length > b.length;

                            });

    

                        for (var coupleAhnentafel in descRootPIDs) {

                            fsPedigree.dispatch(__actions__.pedigree.appendPedigree(descPedigreeRootPids[coupleAhnentafel], __actions__.pedigree.getDepth(coupleAhnentafel), state.pedigree.config.gens, state.prefs.showPortraits, state.prefs.showMarriages, state.prefs.showDataQualityIssues, state.prefs.showRecordHints, state.prefs.showResearchSuggestions, state.prefs.showTempleOpportunities, state.prefs.showOrdinances, false, coupleAhnentafel));

                            console.log(coupleAhnentafel, " = ", descRootPIDs[coupleAhnentafel], " : ", descPedigreeRootPids[descRootPIDs[coupleAhnentafel]]);

                        };

                    }

                }

                function checkRoot() {

                    var csr = customState.ROOT

                    var sgsp = __state__.getState().pedigree

                    if (Object.keys(csr).length > sgsp.centerAhnentafels.length) {

                        for (var i in sgsp.centerAhnentafels) {

                            delete csr[sgsp.centerAhnentafels[i]]

                        }

                        console.log(csr)

                        doRoot(csr)

                        //setTimeout(checkRoot, 15000)

                    }

                }

                function checkDescRoot() {

                    var csdr = customState.DESCROOT

                    var sgsp = __state__.getState().pedigree

                    if (Object.keys(csdr).length > sgsp.centerAhnentafels.length) {

                        for (var i in sgsp.centerAhnentafels) {

                            delete csdr[sgsp.centerAhnentafels[i]]

                        }

                        console.log(csdr)

                        doDescRoot(csdr)

                        //setTimeout(checkDescRoot, 15000)

                    }

                }

                window.onload = () => {

                    alert("this will take a very long time. maybe i can fix this in the future, but come back in like 5-10 minutes."); 

                    window.appendLoadingFront = () => {

                        if (document.getElementById("loadingFront") == null) {

                            window.loadingFront = document.createElement("div");

                            loadingFront.style = "background-color: rgba(0, 0, 0, .2); width: 100%; height: 100%; position: absolute; z-index: 9999999999999999; left: 0; top: 0;"

                            loadingFront.id = "loadingFront";

loadingFront.innerHTML = "<h1 id='dotdotdot' style=\"font-family: 'Gill Sans', sans-serif; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);\">LOADING</h1>"

window.changeDot = () => {

                             var dotdotdot = document.getElementById("dotdotdot");

                                var dots = ["LOADING", "LOADING.", "LOADING..", "LOADING..."]

var dotIndex = dots.indexOf(dotdotdot.textContent)

                                if (dotIndex === 3) dotIndex = -1;

                                dotdotdot.textContent = dots[dotIndex + 1]

                            }

window.dotDotDotInterval = setInterval(changeDot, 1000)

                            document.body.appendChild(loadingFront);

                            console.log("Not good");

                            console.log(loadingFront);

                        } else {

                            console.log("loadingFront All Good.");

                            console.log(loadingFront)

                        }

                    }

                    setTimeout(appendLoadingFront, 1000);

                    window.fsPedigree = document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree");

                    setTimeout(customPedigree, 30000);

                    window.setPosInterval = setInterval(setPosAndZoom, 50);

                }`

            cpw.document.head.appendChild(cpse)

        }

        reader.onerror = (e) => {

            alert(e.target.error.name)

        } 

        reader.readAsText(file)

    }

})()