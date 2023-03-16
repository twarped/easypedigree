//version 2.1 code. better data arrays. I forgot to upload 2.0, but basically FS reprogrammed their pedigree interface, so I had to reprogram mine.

(() => {
    try {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            "ROOT_PEOPLE_DATA": [
                [document.body.querySelector(".listCss_l14v1yn6").querySelector("[data-testid='asc-couple-0.0']")].map(e => [e.innerText.replaceAll("\n", " ").split("  ").map((e, i) => {
                    if (i % 2 == 1) return e.split(" ")[2];
                    return e;
                }), e.dataset.testid].flat()), ...Array.from(document.body.querySelector(".listCss_l14v1yn6").querySelectorAll("button.iconButtonCss_i1memprp.lowCss_l18l38sv")).filter(e => e.ariaLabel.includes("Collapse")).map(e => [...e.parentNode.parentNode.innerText.replaceAll("\n", " ").split("  ").map((e, i) => {
                    if (i % 2 == 1) return e.split(" ")[2];
                    return e;
                }), e.parentNode.parentNode.dataset.testid]).map((e, i, a) => [
                    [document.body.querySelector(".listCss_l14v1yn6").querySelector(`[data-testid='asc-couple-${e[e.length-1].split("-").splice(-1)[0].split(".").map((e, i) => { if (i) return Math.floor(e/2); return e - 1; }).join(".")}']`)].map(e => [e.innerText.replaceAll("\n", " ").split("  ").map((e, i) => {
                        if (i % 2 == 1) return e.split(" ")[2];
                        return e;
                    }), e.dataset.testid]).flat().flat(), e
                ])
            ].flat().map(e => {
                return {
                    "husband": {
                        "name": e[0],
                        "id": (e[0] == "ADD SPOUSE" ? 0 : e[1])
                    },
                    "wife": {
                        "name": (e[0] == "ADD SPOUSE" ? e[1] : e[2]),
                        "id": (e[1] == "ADD SPOUSE" ? 0 : (e[2] == "ADD SPOUSE" ? 0 : (e[0] == "ADD SPOUSE" ? e[2] : e[3])))
                    },
                    "coupleId": (e[e.length - 1])
                }
            }),
            "DESC_PEOPLE_DATA": [...Array.from(document.body.querySelector(".listCss_l11vv4r5").querySelectorAll("button.iconButtonCss_i1memprp.lowCss_l18l38sv")).filter(e => e.ariaLabel.includes("Collapse")).map(e => [...e.parentNode.parentNode.innerText.replaceAll("\n", " ").split("  ").map((e, i) => {
                if (i % 2 == 1) return e.split(" ")[2];
                return e;
            }), e.parentNode.parentNode.dataset.testid])].map(e => {
                return {
                    "husband": {
                        "name": e[0],
                        "id": (e[0] == "ADD SPOUSE" ? 0 : e[1])
                    },
                    "wife": {
                        "name": (e[0] == "ADD SPOUSE" ? e[1] : e[2]),
                        "id": (e[1] == "ADD SPOUSE" ? 0 : (e[2] == "ADD SPOUSE" ? 0 : (e[0] == "ADD SPOUSE" ? e[2] : e[3])))
                    },
                    "coupleId": (e[e.length - 1])
                }
            }),
            "ROOT": Array.from(document.body.querySelector(".listCss_l14v1yn6").querySelectorAll("button.iconButtonCss_i1memprp.lowCss_l18l38sv")).filter(e => e.ariaLabel.includes("Collapse")).map(e => e.parentNode.parentNode.dataset.testid),
            "DESCROOT": Array.from(document.body.querySelector(".listCss_l11vv4r5").querySelectorAll("button.iconButtonCss_i1memprp.lowCss_l18l38sv")).filter(e => e.ariaLabel.includes("Collapse")).map(e => e.parentNode.parentNode.dataset.testid),
            "VERSION": 2.0
        }));
        var a = document.createElement("a");
        a.href = dataStr;
        a.download = prompt("Pedigree (file)name:", "pedigree") + ".fsped";
        if (a.download == "null.fsped") return false;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 0);
    } catch (error) {
        alert("You have to be in FamilySearch portrait mode for this to work.");
        console.error(error);
        return;
    }
})();
