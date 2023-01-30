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
        window.fsPedigree = document.querySelector("#main-content-section > tree-app").shadowRoot.querySelector("#pages > tree-pedigree").shadowRoot.querySelector("#pedigree");
        window.customState = JSON.parse(e.target.result);
        delete customState.ROOT[1];
        delete customState.DESCROOT[1];
        window.ahnentafelsToClick = { "root": Object.keys(customState.ROOT).sort(e => e), "descroot": Object.keys(customState.DESCROOT).sort(e => e) };
        window.coupleIdsToClick = { "root": Object.keys(customState.ROOT).map((e, i) => customState.ROOT[ahnentafelsToClick.root[i]]), "descroot": Object.keys(customState.DESCROOT).map((e, i) => customState.DESCROOT[ahnentafelsToClick.descroot[i]]) };
        window.couplesToClick = { "root": false, "descroot": false };
        while ((await fsPedigree.pedigreeClass.getZoom()) > .065) {
            fsPedigree.pedigreeClass.pedigreeEl
                .transition()
                .duration(1)
                .call(fsPedigree.pedigreeClass.zoom.scaleBy, .2);
            fsPedigree.pedigreeClass.centerInit();
        }
        doRoot();
    }

    reader.onerror = (e) => {
        alert(e.target.error.name)
    }

    reader.readAsText(file)
}

function updateRootCouplesToClick() {
    return new Promise((resolve, reject) => {
        Array.from(coupleIdsToClick.root).forEach(coupleId => {
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
                var couple = false;
                try {
                    couple = coupleShadowParent.shadowRoot.querySelector("div.couple-wrapper");
                } catch (e) {
                    alert("something is bad with your saved pedigree, maybe they changed something... sorry.");
                    throw e;
                }
                console.log(coupleShadowParent.coupleId);
                var button = couple.querySelector("button.append-pedigree");
                if (button.ariaLabel.includes("Expand")) {
                    couplesToClick.root = couple;
                    resolve();
                } else {
                    var index = coupleIdsToClick.root.indexOf(coupleId);
                    ahnentafelsToClick.root.splice(index, 1);
                    coupleIdsToClick.root.splice(index, 1);
                }
            }
        });
    });
}

function clickNextRootCouple() {
    return new Promise((resolve, reject) => {
        var button = couplesToClick.root.querySelector("button.append-pedigree");
        button.click();
        var config = { attributes: true, subtree: false, childList: false };
        var mutationCallback = (mutations, observer) => {
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
    couplesToClick = { "root": false, "descroot": false };
    updateRootCouplesToClick().then(async () => {
        await clickNextRootCouple();
        if (ahnentafelsToClick.root.length) {
            return doRoot();
        }
        return true;
    });
}