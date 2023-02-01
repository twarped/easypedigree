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
        var customState = JSON.parse(e.target.result);
        var fsWindow = window.open("https://familysearch.org/tree/pedigree/portrait/" + customState.ROOT[1]);
        fsWindow.customState = customState;
        fsWindow.addEventListener("load", () => {
            var script = fsWindow.document.createElement("script");
            var treeApp = fsWindow.document.querySelector("#main-content-section > tree-app")
                .shadowRoot.querySelector("iron-pages").querySelector("tree-pedigree");
            try {
                treeApp = treeApp.shadowRoot.children.pedigree;
                console.log(treeApp.pedigreeClass);
                fsWindow.fsPedigree = treeApp;
                script.innerHTML = injectCode;
                fsWindow.document.head.appendChild(script);
            } catch (e) {
                console.log(e);
                var observer = new MutationObserver((m) => {
                    if (m[0].attributeName == "pid") {
                        treeApp = treeApp.shadowRoot.querySelector("#pedigree");
                        console.log(treeApp.pedigreeClass);
                        fsWindow.fsPedigree = treeApp;
                        script.innerHTML = injectCode;
                        fsWindow.document.head.appendChild(script);
                    }
                })
                observer.observe(treeApp, { attributes: true, childList: true, subtree: true });
            }
        })
    }

    reader.onerror = (e) => {
        alert(e.target.error.name)
    }

    reader.readAsText(file)
}

var injectCode = `
(async () => {
window.updateRootCouplesToClick = () => {
    return new Promise((resolve, reject) => {
        Array.from(coupleIdsToClick.root).forEach((coupleId, i) => {
            var coupleShadowParentUnfiltered = Array.from(document.querySelector("#main-content-section > tree-app")
                .shadowRoot.querySelector("#pages > tree-pedigree")
                .shadowRoot.querySelector("#pedigree")
                .shadowRoot.querySelector("#pedigree > div:nth-child(1)")
                .querySelectorAll("pedigree-couple-renderer[data-test-couple-ahnentafel]"));
            var coupleShadowParent = coupleShadowParentUnfiltered.filter((e) => {
                e.coupleId.includes(coupleId) && e.coupleId.length < coupleId.length + 3
            })[0];

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
                // console.log(coupleShadowParent.coupleId);
                // console.log("coupleid ", coupleId)
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

window.clickNextRootCouple = () => {
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

window.doRoot = () => {
    return new Promise(async (resolve) => {
        for (var i = 0; i < 5; i++) {
            fsPedigree.pedigreeClass.pedigreeEl
                .transition()
                .duration(1)
                .call(fsPedigree.pedigreeClass.zoom.scaleBy, .2);
        }
        couplesToClick = { "root": false, "descroot": false };
        var nextCouple = await updateRootCouplesToClick();
        console.log(nextCouple.rootCoupleId);
        await clickNextRootCouple();
        if (coupleIdsToClick.root.length) {
            await doRoot();
            resolve(true)
        }
    });
}

window.ROOT = customState.ROOT[1];
delete customState.ROOT[1];
delete customState.DESCROOT[1];
window.ahnentafelsToClick = { "root": Object.keys(customState.ROOT).sort(e => e), "descroot": Object.keys(customState.DESCROOT).sort(e => e) };
window.coupleIdsToClick = { "root": Object.keys(customState.ROOT).map((e, i) => customState.ROOT[ahnentafelsToClick.root[i]]), "descroot": Object.keys(customState.DESCROOT).map((e, i) => customState.DESCROOT[ahnentafelsToClick.descroot[i]]) };
window.ahnentafelsToClickFreeze = structuredClone(ahnentafelsToClick);
window.coupleIdsToClickFreeze = structuredClone(coupleIdsToClick);
window.couplesToClick = { "root": false, "descroot": false };

var pedigreeObserver = new MutationObserver(mutations => {
    Array.from(mutations).forEach(m => {
        pedigreeObserver.disconnect();
        setTimeout(doRoot, 5000)
    });
})

pedigreeObserver.observe(fsPedigree.shadowRoot, {attributes: true, childList: true, subtree: true});
`;
