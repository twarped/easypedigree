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
        window.appendLoadingFront = () => {

            if (document.getElementById("loadingFront") == null) {
                window.loadingFront = document.createElement("div");
                loadingFront.style = "pointer-events: none; background-color: rgba(0, 0, 0, .2); width: 100%; height: 100%; position: absolute; z-index: 9999999999999999; left: 0; top: 0;"
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
            } else {
                console.log("loadingFront All Good.");
            }

        }

        setTimeout(appendLoadingFront, 1000);
        window.fsPedigree = document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree");
        window.customState = JSON.parse(e.target.result);
        window.ROOT = customState.ROOT[1];
        delete customState.ROOT[1];
        delete customState.DESCROOT[1];
        window.ahnentafelsToClick = { "root": Object.keys(customState.ROOT).sort(e => e), "descroot": Object.keys(customState.DESCROOT).sort(e => e) };
        window.coupleIdsToClick = { "root": Object.keys(customState.ROOT).map((e, i) => customState.ROOT[ahnentafelsToClick.root[i]]), "descroot": Object.keys(customState.DESCROOT).map((e, i) => customState.DESCROOT[ahnentafelsToClick.descroot[i]]) };
        window.ahnentafelsToClickFreeze = structuredClone(ahnentafelsToClick);
        window.coupleIdsToClickFreeze = structuredClone(coupleIdsToClick);
        window.couplesToClick = { "root": false, "descroot": false };
        for (var i = 0; i < 5; i++) {
            fsPedigree.pedigreeClass.pedigreeEl
                .transition()
                .duration(1)
                .call(fsPedigree.pedigreeClass.zoom.scaleBy, .2);
        }
        var didroot = await doRoot();
        alert("did root ", didroot);
    }

    reader.onerror = (e) => {
        alert(e.target.error.name)
    }

    reader.readAsText(file)
}

function updateRootCouplesToClick() {
    return new Promise((resolve, reject) => {
        Array.from(coupleIdsToClick.root).forEach((coupleId, i) => {
            var coupleShadowParentUnfiltered = Array.from(document.querySelector("#main-content-section > tree-app")
                .shadowRoot.querySelector("#pages > tree-pedigree")
                .shadowRoot.querySelector("#pedigree")
                .shadowRoot.querySelector("#pedigree > div:nth-child(1)")
                .querySelectorAll("pedigree-couple-renderer[data-test-couple-ahnentafel]"));
            var coupleShadowParent = coupleShadowParentUnfiltered.filter(e =>
                e.coupleId.includes(coupleId) && e.coupleId.length < coupleId.length + 3
            )[0];

            if (coupleShadowParent == undefined) {
                coupleShadowParent = [];
                coupleShadowParentUnfiltered.forEach(e => {
                    if (e.coupleId.split("_")[0] == coupleId.split("_")[0] || e.coupleId.split("_")[1] == coupleId.split("_")[1]) {
                        coupleShadowParent.push(e);
                    }
                });
                coupleShadowParent = coupleShadowParent[0];
            }

            if (coupleShadowParent) {
                // console.log(coupleShadowParent);
                var couple = false;
                try {
                    couple = coupleShadowParent.shadowRoot.querySelector("div.couple-wrapper");
                    // console.log("couple: ");
                    // console.log(couple);
                } catch (e) {
                    alert("something is bad with your saved pedigree, maybe they changed something... sorry.");
                    reject(e);
                }
                console.log(coupleShadowParent.coupleId);
                console.log("coupleid ", coupleId)
                var button = couple.querySelector("button.append-pedigree");
                //console.log(button)
                if (button.ariaLabel.includes("Expand")) {
                    couplesToClick.root = couple;
                    // console.log("button has expand")
                    couplesToClick.rootCoupleId = coupleId;
                    resolve(couplesToClick);
                } else {
                    var index = coupleIdsToClick.root.indexOf(coupleId);
                    ahnentafelsToClick.root.splice(index, 1);
                    coupleIdsToClick.root.splice(index, 1);
                    // console.log("button doesn't have expand")
                }
            }
        });
    });
}

function clickNextRootCouple() {
    return new Promise((resolve) => {
        var button = couplesToClick.root.querySelector("button.append-pedigree");
        button.click();
        var config = { attributes: true, subtree: false, childList: false };
        var mutationCallback = (mutations) => {
            mutations.forEach(m => {
                if (m.attributeName == "aria-expanded") {
                    resolve();
                }
            })
        };

        var observer = new MutationObserver(mutationCallback);
        observer.observe(button, config);
    })
}

function doRoot() {
    return new Promise(async (resolve) => {
        couplesToClick = { "root": false, "descroot": false };
        var nextCouple = await updateRootCouplesToClick();
        alert(nextCouple.rootCoupleId);
        await clickNextRootCouple();
        if (coupleIdsToClick.root.length) {
            await doRoot();
            resolve(true)
        }
    });
}